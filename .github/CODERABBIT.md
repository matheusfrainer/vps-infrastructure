# CodeRabbit - Instalação

## Passo a Passo

### 1. Acesse o GitHub Marketplace
https://github.com/marketplace/coderabbit

### 2. Clique em "Set up a plan"
- Selecione "Free" para começar
- Autorize acesso ao repositório `vps-infrastructure`

### 3. Configure (opcional)
Após instalar, crie um arquivo `.coderabbit.yaml` na raiz:

```yaml
# .coderabbit.yaml
language: "pt-BR"
reviews:
  auto_review:
    enabled: true
    base_branches:
      - main
  path_filters:
    - "!vendor/**"
    - "!node_modules/**"
  path_instructions:
    - path: "modules/**"
      instructions: "Foco em segurança e configurações de infraestrutura"
    - path: "apps/**"
      instructions: "Foco em performance e boas práticas React/TypeScript"
```

### 4. Pronto!
Todo PR novo receberá automaticamente:
- Resumo das mudanças
- Review linha por linha
- Sugestões de melhoria
- Detecção de bugs potenciais

## Comandos no PR

Você pode interagir com o CodeRabbit nos comentários:

| Comando | Ação |
|---------|------|
| `@coderabbitai review` | Força um novo review |
| `@coderabbitai summary` | Gera resumo das mudanças |
| `@coderabbitai help` | Lista todos os comandos |

## Exemplo de Review

```
## Walkthrough
Este PR adiciona autenticação OAuth ao módulo de gateway...

## Changes
| File | Summary |
|------|---------|
| modules/gateway/traefik/config.yml | Adicionado middleware de auth |
| apps/app-ia/src/auth.ts | Novo serviço de autenticação |

## Suggestions
- [ ] Considere adicionar rate limiting ao endpoint /oauth/callback
- [ ] A variável `token` pode vazar em logs. Use masking.
```
