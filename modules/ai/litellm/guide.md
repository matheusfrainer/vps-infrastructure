# Guia de Implementação LiteLLM com Docker

Integrado com Traefik + Supabase Self-Hosted
Baseado exclusivamente na documentação oficial do LiteLLM.

## Pré-requisitos

| Requisito | Especificação |
| --- | --- |
| Hardware mínimo | 4 CPU cores, 8 GB RAM |
| Supabase Self-Hosted | PostgreSQL acessível na rede Docker |
| Traefik Self-Hosted | Configurado com entrypoints e certificados |
| Rede Docker | Traefik e Supabase acessíveis pelo LiteLLM |

## Etapa 1 — Estrutura de Diretórios

```bash
mkdir -p ~/repo/proxy/litellm
cd ~/repo/proxy/litellm
```

## Etapa 2 — Criar Arquivo de Configuração

Criar o arquivo litellm_config.yaml:

```yaml
model_list:
  - model_name: gpt-4o
    litellm_params:
      model: openai/gpt-4o
      api_key: os.environ/OPENAI_API_KEY

  - model_name: gpt-4o-mini
    litellm_params:
      model: openai/gpt-4o-mini
      api_key: os.environ/OPENAI_API_KEY

  - model_name: claude-sonnet
    litellm_params:
      model: anthropic/claude-sonnet-4-20250514
      api_key: os.environ/ANTHROPIC_API_KEY

  - model_name: claude-haiku
    litellm_params:
      model: anthropic/claude-3-5-haiku-20241022
      api_key: os.environ/ANTHROPIC_API_KEY

general_settings:
  master_key: os.environ/LITELLM_MASTER_KEY
  database_url: os.environ/DATABASE_URL
```

## Etapa 3 — Criar Arquivo de Variáveis de Ambiente

Criar o arquivo .env:

```bash
# Master Key - chave de administrador do proxy
# OBRIGATÓRIO: deve começar com "sk-"
LITELLM_MASTER_KEY=sk-sua-chave-master-segura-aqui

# Salt Key - usada para criptografar credenciais de API
# ATENÇÃO: NÃO pode ser alterada após adicionar um modelo
# Recomendação: usar https://1password.com/password-generator/
LITELLM_SALT_KEY=sua-hash-aleatoria-forte-aqui

# Conexão com PostgreSQL do Supabase Self-Hosted
# Formato: postgresql://<user>:<password>@<host>:<port>/<dbname>
DATABASE_URL=postgresql://postgres:sua_senha@supabase-db:5432/postgres

# API Keys dos Provedores LLM
OPENAI_API_KEY=sk-sua-openai-key
ANTHROPIC_API_KEY=sk-ant-sua-anthropic-key
```

## Etapa 4 — Criar Docker Compose

Criar o arquivo docker-compose.yml:

```yaml
version: "3.9"

services:
  litellm:
    image: docker.litellm.ai/berriai/litellm-database:main-stable
    container_name: litellm
    restart: unless-stopped
    volumes:
      - ./litellm_config.yaml:/app/config.yaml
    env_file:
      - .env
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - LITELLM_MASTER_KEY=${LITELLM_MASTER_KEY}
      - LITELLM_SALT_KEY=${LITELLM_SALT_KEY}
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
    command:
      - "--config"
      - "/app/config.yaml"
      - "--port"
      - "4000"
      - "--num_workers"
      - "8"
    networks:
      - traefik-public
      - supabase_default
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.litellm.rule=Host(`llm.seudominio.com`)"
      - "traefik.http.routers.litellm.entrypoints=websecure"
      - "traefik.http.routers.litellm.tls.certresolver=letsencrypt"
      - "traefik.http.services.litellm.loadbalancer.server.port=4000"

networks:
  traefik-public:
    external: true
  supabase_default:
    external: true
```

**Observações conforme documentação oficial:**

- A imagem litellm-database:main-stable é mantida especificamente para reduzir tempo de build quando conectado a PostgreSQL.
- O parâmetro --num_workers define o número de workers. Ajuste conforme sua capacidade de hardware.
- AVISO DA DOCUMENTAÇÃO: Em produção, NÃO use --detailed_debug pois causa lentidão nos tempos de resposta.
- A documentação recomenda usar versionamento ou SHA digests (exemplo: litellm:main-v1.30.3 ou litellm@sha256:12345abcdef...) ao invés de main-stable para evitar problemas de previsibilidade, dificuldades em rollback e ambientes inconsistentes.

## Etapa 5 — Ajustar Nome da Rede do Supabase

Verificar o nome exato da rede Docker do seu Supabase:

```bash
docker network ls | grep supabase
```

Substituir supabase_default no docker-compose.yml pelo nome correto da sua rede.

## Etapa 6 — Verificar Hostname do PostgreSQL

O hostname do PostgreSQL depende de como seu Supabase está configurado. Verificar:

```bash
docker ps | grep postgres
```

Ajustar o DATABASE_URL no .env com o nome correto do container ou hostname.

## Etapa 7 — Iniciar o Container

```bash
docker compose up -d
```

## Etapa 8 — Verificar Logs

```bash
docker logs -f litellm
```

Aguardar até ver mensagem indicando que o servidor está rodando na porta 4000.

## Etapa 9 — Testar a Requisição

Conforme documentação oficial, passar o model definido na Etapa 2:

```bash
curl --location 'https://llm.seudominio.com/chat/completions' \\
  --header 'Content-Type: application/json' \\
  --header 'Authorization: Bearer sk-sua-chave-master-segura-aqui' \\
  --data '{
    "model": "gpt-4o",
    "messages": [
      {
        "role": "user",
        "content": "what llm are you"
      }
    ]
  }'
```

## Configurações Avançadas Opcionais

### Keepalive Timeout

Padrão: 5 segundos. Para aumentar, adicionar ao command ou via variável de ambiente:

```yaml
# Via command
command:
  - "--config"
  - "/app/config.yaml"
  - "--port"
  - "4000"
  - "--keepalive_timeout"
  - "75"
```

Ou via variável de ambiente no .env:

```bash
KEEPALIVE_TIMEOUT=75
```

### Reiniciar Workers Após N Requisições

Para mitigar crescimento de memória, adicionar ao command ou via variável de ambiente:

```yaml
# Via command
command:
  - "--config"
  - "/app/config.yaml"
  - "--port"
  - "4000"
  - "--max_requests_before_restart"
  - "10000"
```

Ou via variável de ambiente no .env:

```bash
MAX_REQUESTS_BEFORE_RESTART=10000
```

### Desabilitar Busca Online de Preços de Modelos

Se estiver enfrentando tempos de cold start longos ou problemas de segurança de rede, adicionar ao .env:

```bash
LITELLM_LOCAL_MODEL_COST_MAP=True
```

---

## Estrutura Final de Arquivos

```text
~/litellm/
├── .env
├── docker-compose.yml
└── litellm_config.yaml
```

## Resumo das Imagens Docker Oficiais

| Imagem | Uso |
| --- | --- |
| docker.litellm.ai/berriai/litellm:main-stable | Uso básico sem banco de dados |
| docker.litellm.ai/berriai/litellm-database:main-stable | Com suporte a PostgreSQL (recomendado para seu caso) |
| docker.litellm.ai/berriai/litellm-non_root:main-stable | Ambientes sem internet (binários Prisma pré-gerados) |

## Verificação de Saúde

O LiteLLM expõe endpoints de health check conforme documentação:

```bash
# Liveness
curl https://llm.seudominio.com/health/liveliness

# Readiness  
curl https://llm.seudominio.com/health/readiness
```

## Referência

Documentação oficial: <https://docs.litellm.ai/docs/proxy/deploy>
