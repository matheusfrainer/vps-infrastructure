#!/usr/bin/env python3
"""
Gerador de Sumário para arquivos OpenAPI/Swagger (YAML)

Uso:
    python openapi_summary.py brapi.yaml
    python openapi_summary.py brapi.yaml --output summary.md
    python openapi_summary.py brapi.yaml --format markdown
    python openapi_summary.py brapi.yaml --format json
"""

import yaml
import json
import argparse
import sys
from pathlib import Path
from typing import Any
from collections import defaultdict


def load_yaml(file_path: str) -> dict:
    """Carrega arquivo YAML."""
    with open(file_path, 'r', encoding='utf-8') as f:
        return yaml.safe_load(f)


def count_schema_fields(schema: dict, schemas: dict, visited: set = None) -> int:
    """Conta campos de um schema, incluindo referências."""
    if visited is None:
        visited = set()

    count = 0
    properties = schema.get('properties', {})
    count += len(properties)

    # Contar campos de allOf, oneOf, anyOf
    for key in ['allOf', 'oneOf', 'anyOf']:
        for item in schema.get(key, []):
            if '$ref' in item:
                ref_name = item['$ref'].split('/')[-1]
                if ref_name not in visited and ref_name in schemas:
                    visited.add(ref_name)
                    count += count_schema_fields(schemas[ref_name], schemas, visited)
            else:
                count += count_schema_fields(item, schemas, visited)

    return count


def extract_enums(schemas: dict) -> list[dict]:
    """Extrai todos os enums dos schemas."""
    enums = []

    for schema_name, schema in schemas.items():
        # Enum no nível do schema
        if 'enum' in schema:
            enums.append({
                'name': schema_name,
                'location': schema_name,
                'values': schema['enum'],
                'description': schema.get('description', '')
            })

        # Enums nas propriedades
        for prop_name, prop in schema.get('properties', {}).items():
            if 'enum' in prop:
                enums.append({
                    'name': f"{schema_name}.{prop_name}",
                    'location': f"{schema_name} → {prop_name}",
                    'values': prop['enum'],
                    'description': prop.get('description', '')
                })

            # Enums em items (arrays)
            if 'items' in prop and 'enum' in prop.get('items', {}):
                enums.append({
                    'name': f"{schema_name}.{prop_name}[]",
                    'location': f"{schema_name} → {prop_name} (array)",
                    'values': prop['items']['enum'],
                    'description': prop.get('description', '')
                })

    return enums


def extract_endpoints(paths: dict) -> list[dict]:
    """Extrai informações dos endpoints."""
    endpoints = []
    http_methods = ['get', 'post', 'put', 'delete', 'patch', 'options', 'head']

    for path, methods in paths.items():
        for method, details in methods.items():
            if method.lower() in http_methods:
                # Extrair parâmetros
                params = details.get('parameters', [])
                param_names = [p.get('name', '') for p in params]

                endpoints.append({
                    'path': path,
                    'method': method.upper(),
                    'summary': details.get('summary', ''),
                    'description': details.get('description', ''),
                    'operationId': details.get('operationId', ''),
                    'tags': details.get('tags', []),
                    'parameters': param_names,
                    'param_count': len(params)
                })

    return endpoints


def extract_schemas(components: dict) -> list[dict]:
    """Extrai informações dos schemas."""
    schemas_dict = components.get('schemas', {})
    schemas = []

    for name, schema in schemas_dict.items():
        properties = schema.get('properties', {})
        required = schema.get('required', [])

        # Listar campos
        fields = []
        for prop_name, prop in properties.items():
            field_type = prop.get('type', '')
            if '$ref' in prop:
                field_type = prop['$ref'].split('/')[-1]
            elif 'items' in prop:
                if '$ref' in prop['items']:
                    field_type = f"array<{prop['items']['$ref'].split('/')[-1]}>"
                else:
                    field_type = f"array<{prop['items'].get('type', 'any')}>"

            fields.append({
                'name': prop_name,
                'type': field_type,
                'required': prop_name in required,
                'nullable': prop.get('nullable', False),
                'description': prop.get('description', ''),
                'has_enum': 'enum' in prop
            })

        schemas.append({
            'name': name,
            'type': schema.get('type', 'object'),
            'description': schema.get('description', ''),
            'field_count': len(properties),
            'total_fields': count_schema_fields(schema, schemas_dict),
            'required_count': len(required),
            'fields': fields
        })

    return schemas


def generate_summary(spec: dict) -> dict:
    """Gera sumário completo da especificação OpenAPI."""
    info = spec.get('info', {})
    paths = spec.get('paths', {})
    components = spec.get('components', {})

    endpoints = extract_endpoints(paths)
    schemas = extract_schemas(components)
    enums = extract_enums(components.get('schemas', {}))

    # Agrupar endpoints por tag
    endpoints_by_tag = defaultdict(list)
    for ep in endpoints:
        tags = ep.get('tags', ['Sem Tag'])
        for tag in tags:
            endpoints_by_tag[tag].append(ep)

    # Estatísticas
    total_fields = sum(s['field_count'] for s in schemas)

    return {
        'info': {
            'title': info.get('title', 'API'),
            'version': info.get('version', 'N/A'),
            'description': info.get('description', ''),
        },
        'statistics': {
            'endpoints': len(endpoints),
            'schemas': len(schemas),
            'enums': len(enums),
            'total_fields': total_fields,
        },
        'endpoints': endpoints,
        'endpoints_by_tag': dict(endpoints_by_tag),
        'schemas': schemas,
        'enums': enums,
    }


def format_text(summary: dict) -> str:
    """Formata sumário como texto simples."""
    lines = []
    info = summary['info']
    stats = summary['statistics']

    lines.append("=" * 70)
    lines.append(f"  {info['title']} (v{info['version']})")
    lines.append("=" * 70)

    if info['description']:
        lines.append(f"\n{info['description'][:200]}...")

    lines.append(f"\n📊 ESTATÍSTICAS")
    lines.append(f"  • Endpoints: {stats['endpoints']}")
    lines.append(f"  • Schemas: {stats['schemas']}")
    lines.append(f"  • Enums: {stats['enums']}")
    lines.append(f"  • Total de Campos: {stats['total_fields']}")

    lines.append(f"\n🔗 ENDPOINTS ({stats['endpoints']})")
    lines.append("-" * 50)
    for ep in summary['endpoints']:
        params = f" [{ep['param_count']} params]" if ep['param_count'] else ""
        lines.append(f"  {ep['method']:6} {ep['path']}{params}")
        if ep['summary']:
            lines.append(f"         └─ {ep['summary']}")

    lines.append(f"\n📦 SCHEMAS ({stats['schemas']})")
    lines.append("-" * 50)
    for schema in sorted(summary['schemas'], key=lambda x: -x['field_count']):
        lines.append(f"  • {schema['name']} ({schema['field_count']} campos)")

    lines.append(f"\n🏷️  ENUMS ({stats['enums']})")
    lines.append("-" * 50)
    for enum in summary['enums']:
        values_str = ', '.join(str(v) for v in enum['values'][:5])
        if len(enum['values']) > 5:
            values_str += f", ... (+{len(enum['values']) - 5})"
        lines.append(f"  • {enum['name']}: [{values_str}]")

    return '\n'.join(lines)


def format_markdown(summary: dict) -> str:
    """Formata sumário como Markdown."""
    lines = []
    info = summary['info']
    stats = summary['statistics']

    lines.append(f"# {info['title']} - Sumário da API")
    lines.append(f"\n> **Versão**: {info['version']}")
    lines.append(f"> **Gerado automaticamente** a partir da especificação OpenAPI\n")

    if info['description']:
        lines.append(f"{info['description']}\n")

    lines.append("---\n")
    lines.append("## 📊 Estatísticas\n")
    lines.append("| Métrica | Quantidade |")
    lines.append("|---------|------------|")
    lines.append(f"| Endpoints | {stats['endpoints']} |")
    lines.append(f"| Schemas | {stats['schemas']} |")
    lines.append(f"| Enums | {stats['enums']} |")
    lines.append(f"| Total de Campos | {stats['total_fields']} |")

    lines.append("\n---\n")
    lines.append(f"## 🔗 Endpoints ({stats['endpoints']})\n")
    lines.append("| Método | Path | Descrição | Params |")
    lines.append("|--------|------|-----------|--------|")
    for ep in summary['endpoints']:
        desc = ep['summary'][:50] + "..." if len(ep['summary']) > 50 else ep['summary']
        lines.append(f"| `{ep['method']}` | `{ep['path']}` | {desc} | {ep['param_count']} |")

    lines.append("\n---\n")
    lines.append(f"## 📦 Schemas ({stats['schemas']})\n")
    lines.append("| Schema | Campos | Descrição |")
    lines.append("|--------|--------|-----------|")
    for schema in sorted(summary['schemas'], key=lambda x: -x['field_count']):
        desc = schema['description'][:40] + "..." if len(schema['description']) > 40 else schema['description']
        lines.append(f"| `{schema['name']}` | {schema['field_count']} | {desc} |")

    lines.append("\n---\n")
    lines.append(f"## 🏷️ Enums ({stats['enums']})\n")
    for enum in summary['enums']:
        values_str = ', '.join(f"`{v}`" for v in enum['values'])
        lines.append(f"### {enum['name']}\n")
        lines.append(f"{values_str}\n")

    # Detalhes dos Schemas
    lines.append("\n---\n")
    lines.append("## 📋 Detalhes dos Schemas\n")
    for schema in sorted(summary['schemas'], key=lambda x: x['name']):
        lines.append(f"### {schema['name']}\n")
        if schema['description']:
            lines.append(f"> {schema['description']}\n")
        lines.append(f"**Campos**: {schema['field_count']}\n")
        if schema['fields']:
            lines.append("| Campo | Tipo | Obrigatório |")
            lines.append("|-------|------|-------------|")
            for field in schema['fields']:
                req = "✅" if field['required'] else ""
                lines.append(f"| `{field['name']}` | `{field['type']}` | {req} |")
        lines.append("")

    return '\n'.join(lines)


def format_json(summary: dict) -> str:
    """Formata sumário como JSON."""
    return json.dumps(summary, indent=2, ensure_ascii=False)


def main():
    parser = argparse.ArgumentParser(
        description='Gera sumário de arquivos OpenAPI/Swagger',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Exemplos:
  python openapi_summary.py brapi.yaml
  python openapi_summary.py brapi.yaml --format markdown --output summary.md
  python openapi_summary.py brapi.yaml --format json > summary.json
        """
    )
    parser.add_argument('file', help='Arquivo OpenAPI YAML')
    parser.add_argument('--format', '-f', choices=['text', 'markdown', 'json'],
                        default='text', help='Formato de saída (default: text)')
    parser.add_argument('--output', '-o', help='Arquivo de saída (default: stdout)')
    parser.add_argument('--schemas-only', action='store_true',
                        help='Mostrar apenas schemas')
    parser.add_argument('--endpoints-only', action='store_true',
                        help='Mostrar apenas endpoints')

    args = parser.parse_args()

    # Verificar arquivo
    if not Path(args.file).exists():
        print(f"Erro: Arquivo não encontrado: {args.file}", file=sys.stderr)
        sys.exit(1)

    # Carregar e processar
    try:
        spec = load_yaml(args.file)
        summary = generate_summary(spec)
    except Exception as e:
        print(f"Erro ao processar arquivo: {e}", file=sys.stderr)
        sys.exit(1)

    # Formatar saída
    formatters = {
        'text': format_text,
        'markdown': format_markdown,
        'json': format_json,
    }
    output = formatters[args.format](summary)

    # Escrever saída
    if args.output:
        with open(args.output, 'w', encoding='utf-8') as f:
            f.write(output)
        print(f"Sumário salvo em: {args.output}")
    else:
        print(output)


if __name__ == '__main__':
    main()
