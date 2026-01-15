# Nodus Control Center - TODO List Completa

> Arquivo gerado em: 2026-01-14
> Projeto: Portal Unificado de Infraestrutura
> Stack: Next.js 15 + Tremor + TailwindCSS + Supabase Auth

---

## Visão Geral das Fases

| Fase | Nome | Status | Progresso |
|------|------|--------|-----------|
| 1 | Setup Base | 🔲 Pendente | 0/15 |
| 2 | Dashboard Hub | 🔲 Pendente | 0/12 |
| 3 | Módulo Workloads | 🔲 Pendente | 0/18 |
| 4 | Módulo Networking | 🔲 Pendente | 0/16 |
| 5 | Módulo Observability | 🔲 Pendente | 0/14 |
| 6 | Módulo Security | 🔲 Pendente | 0/15 |
| 7 | Módulo Data | 🔲 Pendente | 0/10 |
| 8 | Chat Agent | 🔲 Pendente | 0/12 |
| 9 | Deploy & Produção | 🔲 Pendente | 0/10 |

---

## FASE 1: Setup Base

### 1.1 Criar Projeto Next.js
- [ ] `1.1.1` Executar `npx create-next-app@latest nodus-control-center --typescript --tailwind --eslint --app --src-dir`
- [ ] `1.1.2` Configurar `tsconfig.json` com paths aliases (`@/components`, `@/lib`, etc)
- [ ] `1.1.3` Criar estrutura de diretórios base (`src/components`, `src/lib`, `src/hooks`, `src/types`)
- [ ] `1.1.4` Configurar `.env.local` com variáveis de ambiente placeholder

### 1.2 Instalar Dependências
- [ ] `1.2.1` Instalar Tremor: `npm install @tremor/react`
- [ ] `1.2.2` Instalar Supabase: `npm install @supabase/supabase-js @supabase/ssr`
- [ ] `1.2.3` Instalar React Query: `npm install @tanstack/react-query`
- [ ] `1.2.4` Instalar ícones: `npm install lucide-react`
- [ ] `1.2.5` Instalar utilitários: `npm install date-fns clsx tailwind-merge`
- [ ] `1.2.6` Instalar Dockerode (para API Docker): `npm install dockerode @types/dockerode`

### 1.3 Configurar TailwindCSS + Tremor
- [ ] `1.3.1` Atualizar `tailwind.config.ts` com configurações do Tremor
- [ ] `1.3.2` Adicionar cores customizadas do tema Nodus (dark mode default)
- [ ] `1.3.3` Criar arquivo `src/lib/utils.ts` com função `cn()` para classes condicionais
- [ ] `1.3.4` Configurar `globals.css` com variáveis CSS do tema

### 1.4 Configurar Autenticação Supabase
- [ ] `1.4.1` Criar `src/lib/supabase/client.ts` - cliente browser
- [ ] `1.4.2` Criar `src/lib/supabase/server.ts` - cliente server-side
- [ ] `1.4.3` Criar `src/lib/supabase/middleware.ts` - proteção de rotas
- [ ] `1.4.4` Configurar `middleware.ts` na raiz para interceptar requisições

---

## FASE 2: Dashboard Hub (Overview)

### 2.1 Layout Base
- [ ] `2.1.1` Criar `src/components/layout/Sidebar.tsx` - navegação lateral com módulos
- [ ] `2.1.2` Criar `src/components/layout/Header.tsx` - barra superior com user menu
- [ ] `2.1.3` Criar `src/components/layout/ModuleNav.tsx` - sub-navegação por módulo
- [ ] `2.1.4` Criar `src/app/(dashboard)/layout.tsx` - layout wrapper com sidebar

### 2.2 Página de Login
- [ ] `2.2.1` Criar `src/app/(auth)/login/page.tsx` - formulário de login
- [ ] `2.2.2` Criar `src/app/(auth)/layout.tsx` - layout sem sidebar
- [ ] `2.2.3` Implementar login com email/senha via Supabase
- [ ] `2.2.4` Adicionar redirecionamento pós-login para dashboard

### 2.3 Dashboard Principal
- [ ] `2.3.1` Criar `src/app/(dashboard)/page.tsx` - página inicial
- [ ] `2.3.2` Criar `src/components/overview/QuickStats.tsx` - cards de métricas
- [ ] `2.3.3` Criar `src/components/overview/ModuleCards.tsx` - cards de navegação
- [ ] `2.3.4` Criar `src/components/overview/HealthGrid.tsx` - status dos endpoints

---

## FASE 3: Módulo Workloads (Containers)

### 3.1 API Routes Docker
- [ ] `3.1.1` Criar `src/lib/api/docker.ts` - cliente Docker via socket
- [ ] `3.1.2` Criar `src/app/api/docker/containers/route.ts` - listar containers
- [ ] `3.1.3` Criar `src/app/api/docker/containers/[id]/route.ts` - detalhes container
- [ ] `3.1.4` Criar `src/app/api/docker/containers/[id]/logs/route.ts` - logs
- [ ] `3.1.5` Criar `src/app/api/docker/containers/[id]/stats/route.ts` - stats real-time
- [ ] `3.1.6` Criar `src/app/api/docker/containers/[id]/actions/route.ts` - start/stop/restart

### 3.2 Types Docker
- [ ] `3.2.1` Criar `src/types/docker.ts` - interfaces Container, ContainerStats, etc
- [ ] `3.2.2` Definir tipos para logs com timestamps
- [ ] `3.2.3` Definir tipos para compose projects (labels)

### 3.3 Hooks Docker
- [ ] `3.3.1` Criar `src/hooks/useContainers.ts` - lista de containers com React Query
- [ ] `3.3.2` Criar `src/hooks/useContainerDetails.ts` - detalhes de um container
- [ ] `3.3.3` Criar `src/hooks/useContainerLogs.ts` - logs com polling/streaming
- [ ] `3.3.4` Criar `src/hooks/useContainerActions.ts` - mutations start/stop/restart

### 3.4 Componentes Workloads
- [ ] `3.4.1` Criar `src/components/workloads/ContainerTable.tsx` - tabela com filtros
- [ ] `3.4.2` Criar `src/components/workloads/ContainerDetails.tsx` - card de detalhes
- [ ] `3.4.3` Criar `src/components/workloads/LogViewer.tsx` - visualizador de logs
- [ ] `3.4.4` Criar `src/components/workloads/ContainerActions.tsx` - botões de ação
- [ ] `3.4.5` Criar `src/components/workloads/ContainerStats.tsx` - gráficos de recursos

### 3.5 Páginas Workloads
- [ ] `3.5.1` Criar `src/app/(dashboard)/workloads/page.tsx` - lista de containers
- [ ] `3.5.2` Criar `src/app/(dashboard)/workloads/[containerId]/page.tsx` - detalhes
- [ ] `3.5.3` Criar `src/app/(dashboard)/workloads/compose/page.tsx` - projetos compose

---

## FASE 4: Módulo Networking (Rotas, DNS, Certificados)

### 4.1 API Routes Traefik
- [ ] `4.1.1` Criar `src/lib/api/traefik.ts` - cliente HTTP para Traefik API
- [ ] `4.1.2` Criar `src/app/api/traefik/routers/route.ts` - listar routers
- [ ] `4.1.3` Criar `src/app/api/traefik/services/route.ts` - listar services
- [ ] `4.1.4` Criar `src/app/api/traefik/middlewares/route.ts` - listar middlewares
- [ ] `4.1.5` Criar `src/app/api/traefik/entrypoints/route.ts` - listar entrypoints

### 4.2 API Routes DNS (Hostinger)
- [ ] `4.2.1` Criar `src/lib/api/hostinger.ts` - cliente Hostinger API
- [ ] `4.2.2` Criar `src/app/api/hostinger/dns/[domain]/route.ts` - CRUD registros DNS
- [ ] `4.2.3` Criar `src/app/api/hostinger/dns/[domain]/snapshots/route.ts` - backups DNS

### 4.3 Types Networking
- [ ] `4.3.1` Criar `src/types/traefik.ts` - Router, Service, Middleware, Entrypoint
- [ ] `4.3.2` Criar `src/types/hostinger.ts` - DNSRecord, Domain, Snapshot

### 4.4 Hooks Networking
- [ ] `4.4.1` Criar `src/hooks/useRouters.ts` - lista routers Traefik
- [ ] `4.4.2` Criar `src/hooks/useDNSRecords.ts` - registros DNS com CRUD
- [ ] `4.4.3` Criar `src/hooks/useCertificates.ts` - status certificados SSL

### 4.5 Componentes Networking
- [ ] `4.5.1` Criar `src/components/networking/RouterTable.tsx` - tabela de routers
- [ ] `4.5.2` Criar `src/components/networking/DNSTable.tsx` - tabela DNS com edição
- [ ] `4.5.3` Criar `src/components/networking/DNSForm.tsx` - formulário criar/editar DNS
- [ ] `4.5.4` Criar `src/components/networking/CertificateList.tsx` - lista certificados

### 4.6 Páginas Networking
- [ ] `4.6.1` Criar `src/app/(dashboard)/networking/page.tsx` - overview
- [ ] `4.6.2` Criar `src/app/(dashboard)/networking/routing/page.tsx` - routers/services
- [ ] `4.6.3` Criar `src/app/(dashboard)/networking/dns/page.tsx` - lista domínios
- [ ] `4.6.4` Criar `src/app/(dashboard)/networking/dns/[domain]/page.tsx` - registros
- [ ] `4.6.5` Criar `src/app/(dashboard)/networking/certificates/page.tsx` - SSL/TLS

---

## FASE 5: Módulo Observability (Métricas, Health, Logs)

### 5.1 API Routes Métricas
- [ ] `5.1.1` Criar `src/lib/api/netdata.ts` - cliente Netdata API
- [ ] `5.1.2` Criar `src/app/api/metrics/system/route.ts` - CPU, RAM, Disco
- [ ] `5.1.3` Criar `src/app/api/metrics/containers/route.ts` - métricas por container
- [ ] `5.1.4` Criar `src/app/api/metrics/network/route.ts` - bandwidth

### 5.2 API Routes Health (Gatus)
- [ ] `5.2.1` Criar `src/lib/api/gatus.ts` - cliente Gatus API
- [ ] `5.2.2` Criar `src/app/api/health/status/route.ts` - status endpoints
- [ ] `5.2.3` Criar `src/app/api/health/[endpoint]/route.ts` - histórico endpoint

### 5.3 Types Observability
- [ ] `5.3.1` Criar `src/types/metrics.ts` - SystemMetrics, ContainerMetrics
- [ ] `5.3.2` Criar `src/types/health.ts` - EndpointStatus, HealthHistory

### 5.4 Hooks Observability
- [ ] `5.4.1` Criar `src/hooks/useSystemMetrics.ts` - métricas com polling
- [ ] `5.4.2` Criar `src/hooks/useHealthStatus.ts` - status endpoints
- [ ] `5.4.3` Criar `src/hooks/useAggregatedLogs.ts` - logs múltiplos containers

### 5.5 Componentes Observability
- [ ] `5.5.1` Criar `src/components/observability/CPUChart.tsx` - gráfico CPU (Tremor AreaChart)
- [ ] `5.5.2` Criar `src/components/observability/MemoryChart.tsx` - gráfico RAM
- [ ] `5.5.3` Criar `src/components/observability/DiskChart.tsx` - gráfico disco
- [ ] `5.5.4` Criar `src/components/observability/NetworkChart.tsx` - bandwidth
- [ ] `5.5.5` Criar `src/components/observability/HealthStatusGrid.tsx` - grid de status
- [ ] `5.5.6` Criar `src/components/observability/UptimeTracker.tsx` - % uptime

### 5.6 Páginas Observability
- [ ] `5.6.1` Criar `src/app/(dashboard)/observability/page.tsx` - overview
- [ ] `5.6.2` Criar `src/app/(dashboard)/observability/metrics/page.tsx` - gráficos
- [ ] `5.6.3` Criar `src/app/(dashboard)/observability/health/page.tsx` - status
- [ ] `5.6.4` Criar `src/app/(dashboard)/observability/logs/page.tsx` - logs agregados

---

## FASE 6: Módulo Security (Firewall, Proteção)

### 6.1 API Routes Firewall (Hostinger)
- [ ] `6.1.1` Criar `src/app/api/hostinger/firewall/route.ts` - listar regras
- [ ] `6.1.2` Criar `src/app/api/hostinger/firewall/rules/route.ts` - CRUD regras
- [ ] `6.1.3` Criar `src/app/api/hostinger/firewall/sync/route.ts` - sincronizar

### 6.2 API Routes Fail2ban
- [ ] `6.2.1` Criar `src/lib/api/system.ts` - executor de comandos seguros
- [ ] `6.2.2` Criar `src/app/api/system/fail2ban/status/route.ts` - status jails
- [ ] `6.2.3` Criar `src/app/api/system/fail2ban/banned/route.ts` - IPs banidos
- [ ] `6.2.4` Criar `src/app/api/system/fail2ban/actions/route.ts` - ban/unban

### 6.3 Types Security
- [ ] `6.3.1` Criar `src/types/firewall.ts` - FirewallRule, FirewallSync
- [ ] `6.3.2` Criar `src/types/fail2ban.ts` - Jail, BannedIP

### 6.4 Hooks Security
- [ ] `6.4.1` Criar `src/hooks/useFirewall.ts` - regras com CRUD
- [ ] `6.4.2` Criar `src/hooks/useFail2ban.ts` - status e ações

### 6.5 Componentes Security
- [ ] `6.5.1` Criar `src/components/security/FirewallTable.tsx` - tabela de regras
- [ ] `6.5.2` Criar `src/components/security/FirewallForm.tsx` - criar/editar regra
- [ ] `6.5.3` Criar `src/components/security/BannedIPsTable.tsx` - IPs bloqueados
- [ ] `6.5.4` Criar `src/components/security/JailStatus.tsx` - status das jails

### 6.6 Páginas Security
- [ ] `6.6.1` Criar `src/app/(dashboard)/security/page.tsx` - overview
- [ ] `6.6.2` Criar `src/app/(dashboard)/security/firewall/page.tsx` - regras
- [ ] `6.6.3` Criar `src/app/(dashboard)/security/protection/page.tsx` - fail2ban
- [ ] `6.6.4` Criar `src/app/(dashboard)/security/audit/page.tsx` - histórico

---

## FASE 7: Módulo Data (Database, Backups)

### 7.1 API Routes Data
- [ ] `7.1.1` Criar `src/app/api/hostinger/vps/snapshot/route.ts` - snapshots VPS
- [ ] `7.1.2` Criar `src/app/api/docker/supabase/route.ts` - status containers Supabase

### 7.2 Types Data
- [ ] `7.2.1` Criar `src/types/backup.ts` - Snapshot, BackupHistory

### 7.3 Hooks Data
- [ ] `7.3.1` Criar `src/hooks/useSnapshots.ts` - lista e ações de snapshots
- [ ] `7.3.2` Criar `src/hooks/useSupabaseStatus.ts` - status dos 13 containers

### 7.4 Componentes Data
- [ ] `7.4.1` Criar `src/components/data/SupabaseStatus.tsx` - grid containers Supabase
- [ ] `7.4.2` Criar `src/components/data/SnapshotList.tsx` - lista de backups
- [ ] `7.4.3` Criar `src/components/data/SnapshotActions.tsx` - criar/restaurar

### 7.5 Páginas Data
- [ ] `7.5.1` Criar `src/app/(dashboard)/data/page.tsx` - overview
- [ ] `7.5.2` Criar `src/app/(dashboard)/data/database/page.tsx` - Supabase
- [ ] `7.5.3` Criar `src/app/(dashboard)/data/backups/page.tsx` - snapshots

---

## FASE 8: Chat Agent (Claude)

### 8.1 Setup Agent SDK
- [ ] `8.1.1` Instalar `npm install @anthropic-ai/sdk`
- [ ] `8.1.2` Criar `src/lib/agent/index.ts` - configuração do agente
- [ ] `8.1.3` Criar `src/lib/agent/context.ts` - contexto baseado na página atual

### 8.2 Agent Tools
- [ ] `8.2.1` Criar `src/lib/agent/tools/containers.ts` - consultar/agir em containers
- [ ] `8.2.2` Criar `src/lib/agent/tools/metrics.ts` - consultar métricas
- [ ] `8.2.3` Criar `src/lib/agent/tools/firewall.ts` - consultar/modificar firewall
- [ ] `8.2.4` Criar `src/lib/agent/tools/dns.ts` - consultar/modificar DNS
- [ ] `8.2.5` Criar `src/lib/agent/tools/health.ts` - consultar status endpoints

### 8.3 API Routes Agent
- [ ] `8.3.1` Criar `src/app/api/agent/chat/route.ts` - endpoint de conversação
- [ ] `8.3.2` Implementar streaming de respostas

### 8.4 Componentes Agent
- [ ] `8.4.1` Criar `src/components/chat/ChatWidget.tsx` - widget floating
- [ ] `8.4.2` Criar `src/components/chat/ChatMessages.tsx` - lista de mensagens
- [ ] `8.4.3` Criar `src/components/chat/ChatInput.tsx` - input com submit
- [ ] `8.4.4` Integrar ChatWidget no layout do dashboard

---

## FASE 9: Deploy & Produção

### 9.1 Containerização
- [ ] `9.1.1` Criar `Dockerfile` multi-stage otimizado
- [ ] `9.1.2` Criar `docker-compose.yml` com variáveis de ambiente
- [ ] `9.1.3` Criar `.dockerignore` para excluir arquivos desnecessários

### 9.2 Configuração Traefik
- [ ] `9.2.1` Adicionar labels Traefik no docker-compose.yml
- [ ] `9.2.2` Configurar rota para `control.nodusai.com.br`
- [ ] `9.2.3` Configurar SSL automático via Let's Encrypt

### 9.3 DNS
- [ ] `9.3.1` Criar registro A para `control.nodusai.com.br` → IP do VPS
- [ ] `9.3.2` Aguardar propagação DNS

### 9.4 Deploy
- [ ] `9.4.1` Build da imagem Docker
- [ ] `9.4.2` Subir container com docker-compose
- [ ] `9.4.3` Verificar logs de inicialização
- [ ] `9.4.4` Testar acesso via HTTPS

---

## Componentes Compartilhados

### Shared Components
- [ ] `S.1` Criar `src/components/shared/DataTable.tsx` - tabela reutilizável
- [ ] `S.2` Criar `src/components/shared/StatusBadge.tsx` - badges de status
- [ ] `S.3` Criar `src/components/shared/ConfirmDialog.tsx` - modal de confirmação
- [ ] `S.4` Criar `src/components/shared/LoadingState.tsx` - skeleton loading
- [ ] `S.5` Criar `src/components/shared/EmptyState.tsx` - estado vazio
- [ ] `S.6` Criar `src/components/shared/ErrorBoundary.tsx` - tratamento de erros

### Utilitários
- [ ] `U.1` Criar `src/lib/utils/format.ts` - formatação de datas, bytes, etc
- [ ] `U.2` Criar `src/lib/utils/queries.ts` - helpers para React Query
- [ ] `U.3` Criar `src/lib/utils/constants.ts` - constantes do projeto

---

## Variáveis de Ambiente

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://api.nodusai.com.br
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key

# Hostinger API
HOSTINGER_API_TOKEN=seu_token_hostinger
HOSTINGER_VPS_ID=1198204
HOSTINGER_FIREWALL_ID=174701

# Docker (socket path)
DOCKER_SOCKET_PATH=/var/run/docker.sock

# Traefik
TRAEFIK_API_URL=http://traefik:8080

# Netdata
NETDATA_API_URL=http://netdata:19999

# Gatus
GATUS_API_URL=http://gatus:8080

# Anthropic (Chat Agent)
ANTHROPIC_API_KEY=sua_api_key

# App
NEXT_PUBLIC_APP_URL=https://control.nodusai.com.br
```

---

## Métricas de Progresso

| Métrica | Valor |
|---------|-------|
| Total de Tarefas | 122 |
| Completadas | 0 |
| Em Progresso | 0 |
| Pendentes | 122 |
| Progresso Geral | 0% |

---

## Comandos Úteis

```bash
# Desenvolvimento
npm run dev

# Build
npm run build

# Lint
npm run lint

# Type check
npm run type-check

# Docker build
docker build -t nodus-control-center .

# Docker run
docker-compose up -d

# Verificar logs
docker logs nodus-control-center -f
```

---

## Notas de Implementação

### Prioridades
1. **MVP**: Fases 1-3 (Setup + Dashboard + Workloads) - funcionalidade básica
2. **Core**: Fases 4-6 (Networking + Observability + Security) - gestão completa
3. **Advanced**: Fases 7-8 (Data + Agent) - features avançadas
4. **Production**: Fase 9 (Deploy) - ir ao ar

### Dependências entre Fases
- Fase 2 depende de Fase 1 (layout base precisa do setup)
- Fase 3-7 dependem de Fase 2 (todos usam o layout)
- Fase 8 depende de Fases 3-7 (agent precisa das APIs)
- Fase 9 depende de todas as anteriores

### Riscos Identificados
- Docker socket no container requer configuração de segurança
- Hostinger API tem rate limiting (monitorar)
- Streaming de logs pode consumir muita memória (implementar buffer)

---

## Changelog

| Data | Versão | Descrição |
|------|--------|-----------|
| 2026-01-14 | 0.1.0 | Criação do arquivo TODO inicial |

