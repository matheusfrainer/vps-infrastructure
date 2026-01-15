# Estrutura de Infraestrutura - VPS Nodus AI (v1)

> Documentação gerada em: 2026-01-14
> VPS ID: 1198204 | IP: 147.93.36.243

---

## Infraestrutura Base

| Componente | Função | Status |
|------------|--------|--------|
| **VPS Hostinger** | Servidor (147.93.36.243) | ✅ Ativo |
| **Docker** | Container runtime | ✅ 16 containers |
| **Firewall Hostinger** | Proteção de rede (portas 22/80/443) | ✅ Ativo |

---

## Aplicações

| Componente | Função | URL |
|------------|--------|-----|
| **Traefik** | Reverse proxy + SSL automático | - |
| **Supabase** | Backend (13 containers) | api/studio.nodusai.com.br |

---

## Monitoramento & Segurança

| Componente | Função | URL/Status |
|------------|--------|------------|
| **Netdata** | Métricas infra (CPU/RAM/Disco/Network) | monitor.nodusai.com.br |
| **Gatus** | Health checks + Status page | health.nodusai.com.br |
| **Fail2ban** | Proteção SSH (bloqueia brute-force) | 2 jails ativas |
| **Logrotate** | Rotação de logs Docker | Diário, 7 dias |

---

## Funcionalidades de Monitoramento

| Funcionalidade | Ferramenta | O que faz |
|----------------|------------|-----------|
| Métricas de CPU | Netdata | Uso em tempo real |
| Métricas de RAM | Netdata | Uso + swap |
| Métricas de Disco | Netdata | Espaço + I/O |
| Métricas de Network | Netdata | Bandwidth in/out |
| Métricas por Container | Netdata | Cada um dos 16 containers |
| Health Check HTTP | Gatus | Verifica se URLs respondem |
| Verificação SSL | Gatus | Alerta se certificado expira |
| Response Time | Gatus | Alerta se > X ms |
| Status Page | Gatus | Página pública de status |

---

## Diagrama Visual

```
                    INTERNET
                        │
                   ┌────┴────┐
                   │ FIREWALL│ (22/80/443)
                   └────┬────┘
                        │
                   ┌────┴────┐
                   │ TRAEFIK │ → SSL automático
                   └────┬────┘
          ┌─────────────┼─────────────┐
          │             │             │
     ┌────┴────┐   ┌────┴────┐   ┌────┴────┐
     │SUPABASE │   │ NETDATA │   │  GATUS  │
     │(13 cont)│   │(métricas)│   │(health) │
     └─────────┘   └─────────┘   └─────────┘
          │
    ┌─────┴─────┐
    │ FAIL2BAN  │ → Protege SSH
    │ LOGROTATE │ → Limpa logs
    └───────────┘
```

---

## Detalhes Técnicos

### Containers Supabase (13)
- `supabase-kong` - API Gateway
- `supabase-auth` - Autenticação
- `supabase-rest` - PostgREST API
- `realtime-dev.supabase-realtime` - WebSockets
- `supabase-storage` - Storage API
- `supabase-studio` - Dashboard
- `supabase-analytics` - Logflare
- `supabase-db` - PostgreSQL 15.8
- `supabase-vector` - Vector/Logs
- `supabase-imgproxy` - Image Processing
- `supabase-edge-functions` - Edge Runtime
- `supabase-meta` - Metadata API
- `supabase-pooler` - Supavisor

### Containers de Monitoramento (3)
- `traefik` - Reverse proxy
- `netdata` - Métricas de infraestrutura
- `gatus` - Health checks

### Configurações de Segurança

**Firewall (ID: 174701)**
- Porta 22 (SSH) - Aberta
- Porta 80 (HTTP) - Aberta
- Porta 443 (HTTPS) - Aberta
- Demais portas - Bloqueadas

**Fail2ban**
- `sshd` - Ban 2h após 3 tentativas
- `sshd-ddos` - Ban 24h após 10 tentativas/min

**Logrotate**
- Rotação diária
- Retenção de 7 dias
- Compressão ativada
- Max 100MB por arquivo
