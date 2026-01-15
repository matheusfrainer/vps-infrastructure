# Nodus Control Center - Validação de Stack em Cascata

> Metodologia: Híbrido BMAD + Spec-Kit
> Versão: 1.0.0
> Data: 2026-01-14

---

## Filosofia de Validação

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        CASCATA DE VALIDAÇÃO                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   NÍVEL 0 ──────────────────────────────────────────────────────────────    │
│   │  Next.js (Ferramenta Principal)                                         │
│   │  └─ Critérios: Estabilidade, Docs, TypeScript, Manutenção               │
│   │                                                                          │
│   ▼                                                                          │
│   NÍVEL 1 ──────────────────────────────────────────────────────────────    │
│   │  React (Dependência Core)                                                │
│   │  └─ Herda: N0 + Compatibilidade com Next.js                             │
│   │                                                                          │
│   ▼                                                                          │
│   NÍVEL 2 ──────────────────────────────────────────────────────────────    │
│   │  Tremor + TailwindCSS (UI Layer)                                        │
│   │  └─ Herda: N0 + N1 + Compatibilidade com React                          │
│   │                                                                          │
│   ▼                                                                          │
│   NÍVEL 3 ──────────────────────────────────────────────────────────────    │
│   │  React Query + Supabase SDK (Data Layer)                                │
│   │  └─ Herda: N0 + N1 + N2 + Compatibilidade com Next.js App Router        │
│   │                                                                          │
│   ▼                                                                          │
│   NÍVEL 4 ──────────────────────────────────────────────────────────────    │
│   │  Dockerode + Anthropic SDK (Integration Layer)                          │
│   │  └─ Herda: N0..N3 + Compatibilidade com Node.js runtime                 │
│   │                                                                          │
│   ▼                                                                          │
│   ✓ STACK VALIDADA                                                          │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Critérios Base (Aplicados a TODAS as ferramentas)

| ID | Critério | Descrição | Verificação |
|----|----------|-----------|-------------|
| `B1` | **Estabilidade** | Versão stable/LTS, não alpha/beta/canary | `npm info [pkg] version` |
| `B2` | **Documentação** | Docs oficiais acessíveis e atualizados | URL docs + data última atualização |
| `B3` | **TypeScript** | Suporte nativo ou @types disponível | `@types/[pkg]` ou built-in |
| `B4` | **Manutenção** | Commits nos últimos 90 dias | GitHub insights |
| `B5` | **Segurança** | Sem vulnerabilidades críticas conhecidas | `npm audit` |
| `B6` | **Licença** | MIT, Apache 2.0, ou compatível | `package.json license` |

---

## NÍVEL 0: Ferramenta Principal

### Next.js

| Gate | Critério | Validação | Status |
|------|----------|-----------|--------|
| `N0.1` | B1-B6 | Critérios base | 🔲 |
| `N0.2` | App Router estável | Não experimental | 🔲 |
| `N0.3` | Server Components | Suporte production-ready | 🔲 |
| `N0.4` | API Routes | Route Handlers funcionais | 🔲 |
| `N0.5` | Middleware | Edge runtime estável | 🔲 |

**Comando de Validação:**
```bash
npm info next version
# Esperado: >= 15.0.0 (stable)
```

**Docs:** https://nextjs.org/docs

**Decisão de Versão:**
```
┌─ Versão Candidata: _____________
├─ Data Release: _____________
├─ Breaking Changes: [ ] Nenhum crítico
└─ Aprovado: [ ] SIM  [ ] NÃO
```

---

## NÍVEL 1: Dependência Core

### React

| Gate | Critério | Validação | Status |
|------|----------|-----------|--------|
| `N1.1` | B1-B6 | Critérios base | 🔲 |
| `N1.2` | **Compat Next.js** | peerDependency satisfeita | 🔲 |
| `N1.3` | Server Components | RSC support | 🔲 |
| `N1.4` | Concurrent Features | Stable, não experimental | 🔲 |

**Validação de Compatibilidade:**
```bash
npm info next peerDependencies
# Verificar: react >= X.X.X
```

**Regra:** `React.version` DEVE satisfazer `Next.js.peerDependencies.react`

**Decisão de Versão:**
```
┌─ Versão Candidata: _____________
├─ Next.js requer: >= _____________
├─ Compatível: [ ] SIM  [ ] NÃO
└─ Aprovado: [ ] SIM  [ ] NÃO
```

---

## NÍVEL 2: UI Layer

### TailwindCSS

| Gate | Critério | Validação | Status |
|------|----------|-----------|--------|
| `N2.1` | B1-B6 | Critérios base | 🔲 |
| `N2.2` | **Compat Next.js** | PostCSS integration | 🔲 |
| `N2.3` | **Compat React** | className support | 🔲 |
| `N2.4` | JIT Engine | Stable | 🔲 |

**Validação:**
```bash
npm info tailwindcss version
npm info tailwindcss peerDependencies
```

### Tremor

| Gate | Critério | Validação | Status |
|------|----------|-----------|--------|
| `N2.5` | B1-B6 | Critérios base | 🔲 |
| `N2.6` | **Compat React** | peerDependency satisfeita | 🔲 |
| `N2.7` | **Compat Tailwind** | Versão Tailwind compatível | 🔲 |
| `N2.8` | **Compat Next.js** | App Router support | 🔲 |
| `N2.9` | Charts | Tremor charts funcionais com RSC | 🔲 |

**Validação:**
```bash
npm info @tremor/react peerDependencies
# Verificar: react, tailwindcss
```

**Decisão de Versão:**
```
┌─ TailwindCSS: _____________
├─ Tremor: _____________
├─ React requer: >= _____________
├─ Tailwind requer: >= _____________
├─ Compatível: [ ] SIM  [ ] NÃO
└─ Aprovado: [ ] SIM  [ ] NÃO
```

---

## NÍVEL 3: Data Layer

### React Query (TanStack Query)

| Gate | Critério | Validação | Status |
|------|----------|-----------|--------|
| `N3.1` | B1-B6 | Critérios base | 🔲 |
| `N3.2` | **Compat React** | peerDependency | 🔲 |
| `N3.3` | **Compat Next.js** | App Router hydration | 🔲 |
| `N3.4` | SSR Support | Dehydrate/Hydrate funcionais | 🔲 |

**Validação:**
```bash
npm info @tanstack/react-query peerDependencies
```

### Supabase SDK

| Gate | Critério | Validação | Status |
|------|----------|-----------|--------|
| `N3.5` | B1-B6 | Critérios base | 🔲 |
| `N3.6` | **Compat Next.js** | @supabase/ssr disponível | 🔲 |
| `N3.7` | Auth Helpers | Next.js App Router support | 🔲 |
| `N3.8` | Realtime | WebSocket estável | 🔲 |

**Validação:**
```bash
npm info @supabase/supabase-js version
npm info @supabase/ssr peerDependencies
```

**Decisão de Versão:**
```
┌─ React Query: _____________
├─ Supabase JS: _____________
├─ Supabase SSR: _____________
├─ React requer: >= _____________
├─ Next.js App Router: [ ] Suportado
└─ Aprovado: [ ] SIM  [ ] NÃO
```

---

## NÍVEL 4: Integration Layer

### Dockerode

| Gate | Critério | Validação | Status |
|------|----------|-----------|--------|
| `N4.1` | B1-B6 | Critérios base | 🔲 |
| `N4.2` | **Compat Node.js** | Engine version | 🔲 |
| `N4.3` | TypeScript | @types/dockerode disponível | 🔲 |
| `N4.4` | Docker API | Versão API suportada | 🔲 |

**Validação:**
```bash
npm info dockerode engines
npm info @types/dockerode version
```

### Anthropic SDK

| Gate | Critério | Validação | Status |
|------|----------|-----------|--------|
| `N4.5` | B1-B6 | Critérios base | 🔲 |
| `N4.6` | **Compat Node.js** | Engine version | 🔲 |
| `N4.7` | TypeScript | Built-in types | 🔲 |
| `N4.8` | Streaming | SSE support | 🔲 |

**Validação:**
```bash
npm info @anthropic-ai/sdk engines
```

**Decisão de Versão:**
```
┌─ Dockerode: _____________
├─ @types/dockerode: _____________
├─ Anthropic SDK: _____________
├─ Node.js requer: >= _____________
├─ Next.js Node version: _____________
├─ Compatível: [ ] SIM  [ ] NÃO
└─ Aprovado: [ ] SIM  [ ] NÃO
```

---

## Utilitários (Validação Simplificada)

| Pacote | Critério Extra | Validação |
|--------|----------------|-----------|
| `lucide-react` | Compat React | `peerDependencies` |
| `date-fns` | Tree-shakeable | ESM support |
| `clsx` | Zero dependencies | `dependencies: {}` |
| `tailwind-merge` | Compat Tailwind | `peerDependencies` |

---

## Checklist de Validação Consolidado

### Gate 1: Critérios Base (Paralelo)
```
[ ] N0.1  Next.js      → B1-B6 ✓
[ ] N1.1  React        → B1-B6 ✓
[ ] N2.1  TailwindCSS  → B1-B6 ✓
[ ] N2.5  Tremor       → B1-B6 ✓
[ ] N3.1  React Query  → B1-B6 ✓
[ ] N3.5  Supabase     → B1-B6 ✓
[ ] N4.1  Dockerode    → B1-B6 ✓
[ ] N4.5  Anthropic    → B1-B6 ✓
```

### Gate 2: Cascata de Compatibilidade (Sequencial)
```
[ ] N0   Next.js escolhido         → Versão: ___________
  │
  └─[ ] N1   React compat Next.js   → Versão: ___________
      │
      └─[ ] N2.a Tailwind compat     → Versão: ___________
          │
          └─[ ] N2.b Tremor compat    → Versão: ___________
              │
              └─[ ] N3.a Query compat  → Versão: ___________
                  │
                  └─[ ] N3.b Supabase compat → Versão: ___________
                      │
                      └─[ ] N4 Integrations compat → ✓
```

### Gate 3: Cross-Validation (Matriz)
```
                 Next.js  React  Tailwind  Tremor  Query  Supabase  Node.js
Next.js             ─       ✓       ✓        ✓       ✓       ✓        ✓
React               ✓       ─       ─        ✓       ✓       ─        ─
Tailwind            ✓       ─       ─        ✓       ─       ─        ─
Tremor              ✓       ✓       ✓        ─       ─       ─        ─
React Query         ✓       ✓       ─        ─       ─       ─        ─
Supabase            ✓       ─       ─        ─       ─       ─        ✓
Dockerode           ─       ─       ─        ─       ─       ─        ✓
Anthropic           ─       ─       ─        ─       ─       ─        ✓

Legenda: ✓ = Deve validar compatibilidade | ─ = Não aplicável
```

---

## Protocolo de Execução

### Passo 1: Descoberta de Versões
```bash
# Executar em paralelo
npm info next version dist-tags
npm info react version dist-tags
npm info tailwindcss version dist-tags
npm info @tremor/react version dist-tags
npm info @tanstack/react-query version dist-tags
npm info @supabase/supabase-js version dist-tags
npm info dockerode version
npm info @anthropic-ai/sdk version
```

### Passo 2: Análise de peerDependencies
```bash
# Para cada pacote
npm info [pacote] peerDependencies
```

### Passo 3: Verificação de Segurança
```bash
# Criar package.json temporário com versões candidatas
npm audit --json
```

### Passo 4: Documentação de Decisões
Preencher seção "Decisão de Versão" para cada nível.

### Passo 5: Lock de Versões
```bash
# Após validação, criar package.json com versões exatas
npm install --save-exact
```

---

## Registro de Validação

### Sessão de Validação

| Campo | Valor |
|-------|-------|
| Data | _____________ |
| Validador | _____________ |
| Resultado | 🔲 APROVADO / 🔲 REPROVADO |

### Versões Finais Aprovadas

```json
{
  "dependencies": {
    "next": "^__.__.__ ",
    "react": "^__.__.__ ",
    "react-dom": "^__.__.__ ",
    "@tremor/react": "^__.__.__ ",
    "tailwindcss": "^__.__.__ ",
    "@tanstack/react-query": "^__.__.__ ",
    "@supabase/supabase-js": "^__.__.__ ",
    "@supabase/ssr": "^__.__.__ ",
    "dockerode": "^__.__.__ ",
    "@anthropic-ai/sdk": "^__.__.__ ",
    "lucide-react": "^__.__.__ ",
    "date-fns": "^__.__.__ ",
    "clsx": "^__.__.__ ",
    "tailwind-merge": "^__.__.__ "
  },
  "devDependencies": {
    "@types/dockerode": "^__.__.__ ",
    "@types/node": "^__.__.__ ",
    "@types/react": "^__.__.__ ",
    "typescript": "^__.__.__ "
  }
}
```

### Notas de Incompatibilidade

| Pacote | Problema | Resolução |
|--------|----------|-----------|
| | | |

### Rollback Plan

Se incompatibilidade crítica for descoberta pós-validação:
1. Identificar pacote problemático
2. Consultar changelog para versão anterior compatível
3. Re-executar Gate 2 (cascata) a partir do nível afetado
4. Documentar na seção "Notas de Incompatibilidade"

---

## Automação (Script de Validação)

```bash
#!/bin/bash
# validate-stack.sh

echo "=== VALIDAÇÃO DE STACK - NODUS CONTROL CENTER ==="

# Gate 1: Verificar versões disponíveis
echo "\n[Gate 1] Descobrindo versões estáveis..."
NEXT_VERSION=$(npm info next version)
REACT_VERSION=$(npm info react version)
TAILWIND_VERSION=$(npm info tailwindcss version)
TREMOR_VERSION=$(npm info @tremor/react version)
QUERY_VERSION=$(npm info @tanstack/react-query version)
SUPABASE_VERSION=$(npm info @supabase/supabase-js version)

echo "Next.js: $NEXT_VERSION"
echo "React: $REACT_VERSION"
echo "TailwindCSS: $TAILWIND_VERSION"
echo "Tremor: $TREMOR_VERSION"
echo "React Query: $QUERY_VERSION"
echo "Supabase: $SUPABASE_VERSION"

# Gate 2: Verificar peerDependencies
echo "\n[Gate 2] Verificando compatibilidade..."
echo "Next.js peerDeps:"
npm info next peerDependencies

echo "\nTremor peerDeps:"
npm info @tremor/react peerDependencies

echo "\nReact Query peerDeps:"
npm info @tanstack/react-query peerDependencies

# Gate 3: Audit de segurança
echo "\n[Gate 3] Verificando vulnerabilidades..."
npm audit --audit-level=high

echo "\n=== VALIDAÇÃO CONCLUÍDA ==="
```

---

## Changelog

| Data | Ação | Responsável |
|------|------|-------------|
| 2026-01-14 | Criação do protocolo | Sistema |
| | | |

