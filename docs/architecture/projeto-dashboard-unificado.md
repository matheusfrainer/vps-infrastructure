# Projeto: Dashboard Unificado de Infraestrutura

> Requisitos consolidados em: 2026-01-14

---

## Visão Geral

Criar um aplicativo (dashboard) que consolide **toda a infraestrutura** em uma única interface, permitindo visualização e gerenciamento completo de todos os componentes.

---

## Requisitos Funcionais

### 1. Firewall
- Visualizar regras ativas
- Adicionar novas regras
- Remover regras existentes
- Editar configurações

### 2. Docker
- Gerenciar containers (start, stop, restart, remove)
- Visualizar logs de cada container
- Monitorar APIs expostas
- Status em tempo real

### 3. Traefik
- Todas as funcionalidades do reverse proxy
- Configuração de rotas
- Certificados SSL
- Middlewares

### 4. Supabase
- Gerenciamento dos 16 containers
- Monitoramento individual
- Logs e métricas

### 5. Métricas de Infraestrutura (substituindo Netdata)
- CPU em tempo real
- RAM e swap
- Disco (espaço + I/O)
- Network (bandwidth)
- Métricas por container

### 6. Gatus
- Health checks
- Status page
- Métricas de disponibilidade
- Formas de acompanhamento

### 7. Fail2ban (se possível)
- Status das jails
- IPs banidos
- Configurações

### 8. Logrotate (se possível)
- Status de rotação
- Configurações

### 9. DNS
- Visualizar registros
- Editar configurações
- Adicionar/remover entradas

### 10. Airbyte (futuro)
- Organização de APIs do aplicativo
- Integração com o dashboard
- Potencial uso no próprio projeto

---

## Arquitetura Proposta

### Abordagem
- **Frontend**: Interface unificada (React/Next.js ou similar)
- **Backend/Middleware**: Utilizar APIs das ferramentas existentes
- **Comunicação**: Preferencialmente via API (forma mais adequada)

### Princípio
- Não reinventar a roda
- Consumir APIs existentes das ferramentas
- Frontend como camada de visualização unificada

---

## Funcionalidades Visuais

- Visualizar portas abertas
- Editar, remover e adicionar configurações
- DNS completo
- Database (visualização)
- Todas as métricas consolidadas
- Containers e seus estados
- Informações não citadas mas relevantes

---

## Chat Conversacional (Agente IA)

### Requisitos
- Chat floating no app
- Detecta automaticamente a página atual
- Conversação contextual com agente

### Tecnologia
- LLM: Anthropic Claude
- Biblioteca: `claude-agent-sdk`
- Referência: Observability Agent do repositório Anthropic

### Referências
- Airbyte: https://airbyte.com
- Observability Agent: https://github.com/anthropics/claude-cookbooks/tree/main/claude_agent_sdk/observability_agent

---

## Resumo da Visão

Um único dashboard onde seja possível:
1. **Ver tudo**: métricas, containers, logs, DNS, firewall
2. **Gerenciar tudo**: editar, adicionar, remover configurações
3. **Conversar**: agente IA contextual para ajudar na operação
