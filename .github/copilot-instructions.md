# Copilot Instructions

Instruções para o GitHub Copilot ao revisar PRs neste repositório.

## Contexto do Projeto

Este é um repositório de infraestrutura VPS com:
- Módulos de gateway (Traefik)
- Módulos de banco de dados (Supabase)
- Módulos de observabilidade (Gatus, Netdata)
- Aplicações frontend (React/TypeScript)

## Diretrizes de Review

### Foco Principal
- Segurança de infraestrutura (Docker, Traefik, Supabase)
- Configurações de ambiente e secrets
- Boas práticas de Docker Compose
- Performance e otimização

### Verificar Sempre
- Exposição de portas desnecessárias
- Credenciais hardcoded ou vazadas
- Volumes montados com permissões excessivas
- Configurações de rede inseguras

### Idioma
Responda em **português brasileiro**.

### Formato de Resposta
- Resumo das mudanças
- Pontos de atenção (se houver)
- Sugestões de melhoria
