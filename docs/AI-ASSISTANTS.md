# AI Assistants - Guia de Integração

Este documento descreve como usar os AI assistants configurados para este projeto.

---

## 1. Claude Code (Anthropic)

**O que é:** CLI interativa que você já está usando. Ideal para tarefas complexas.

### Instalação
```bash
# Já instalado no VPS
claude
```

### Casos de Uso
- Refatorações grandes
- Exploração de codebase
- Debugging complexo
- Criação de novos módulos

### Configuração do Projeto
O arquivo `.claude/` contém configurações específicas do projeto.

### Comandos Úteis
```bash
# Iniciar sessão
claude

# Com contexto específico
claude "Analise o módulo de gateway e sugira melhorias"
```

---

## 2. Google Gemini Code Assist

**O que é:** Assistente de código gratuito do Google, integrado ao VS Code.

### Instalação (VS Code)
1. Abra VS Code
2. Extensions → Busque "Gemini Code Assist"
3. Instale a extensão oficial do Google
4. Faça login com conta Google

### Instalação (CLI)
```bash
# Instalar Google Cloud SDK
curl https://sdk.cloud.google.com | bash

# Autenticar
gcloud auth login

# Usar Gemini via API
gcloud ai gemini generate-content "Sua pergunta aqui"
```

### Casos de Uso
- Autocomplete de código
- Explicação de funções
- Geração de testes
- Documentação automática

### Configuração
```json
// settings.json (VS Code)
{
  "gemini.enable": true,
  "gemini.inlineCompletion.enable": true
}
```

---

## 3. OpenAI Codex / ChatGPT

**O que é:** Modelo de linguagem da OpenAI especializado em código.

### Acesso
- **Web:** https://chat.openai.com (GPT-4 com Code Interpreter)
- **API:** https://platform.openai.com
- **CLI:** Via ferramentas como `aider` ou `gpt-engineer`

### Instalação CLI (aider)
```bash
# Instalar aider (usa GPT-4/Codex)
pip install aider-chat

# Configurar API key
export OPENAI_API_KEY="sua-key-aqui"

# Usar no projeto
cd /root/repo
aider apps/app-ia/src/main.tsx
```

### Casos de Uso
- Pair programming interativo
- Geração de código a partir de descrições
- Conversão entre linguagens
- Otimização de algoritmos

---

## 4. Cursor (Recomendado para IDE)

**O que é:** IDE com AI nativo, baseado em VS Code.

### Instalação
```bash
# Download de https://cursor.com
# Disponível para Linux, Mac, Windows
```

### Por que usar junto com Claude Code?
| Ferramenta | Melhor para |
|------------|-------------|
| Claude Code | Tarefas complexas, refatorações, análise profunda |
| Cursor | Edição diária, autocomplete, pequenas mudanças |

### Configuração
1. Baixe o Cursor
2. Abra o projeto: `cursor /root/repo`
3. O AI já vem configurado

---

## Comparativo

| Feature | Claude Code | Gemini | Codex/GPT-4 | Cursor |
|---------|-------------|--------|-------------|--------|
| Preço | Varia | Grátis | $20/mês | $20/mês |
| CLI | ✅ | ✅ | Via aider | ❌ |
| IDE | ❌ | VS Code | VS Code | Própria |
| Contexto | Muito alto | Médio | Alto | Alto |
| Melhor para | Tarefas complexas | Autocomplete | Geração | Edição diária |

---

## Fluxo de Trabalho Sugerido

```
┌─────────────────────────────────────────────────────────┐
│                    SEU WORKFLOW                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  1. PLANEJAMENTO        → Claude Code                   │
│     "Quero adicionar feature X"                         │
│                                                         │
│  2. IMPLEMENTAÇÃO       → Cursor ou Gemini              │
│     Coding diário, autocomplete                         │
│                                                         │
│  3. REVIEW              → CodeRabbit (automático)       │
│     PR criado → Review AI                               │
│                                                         │
│  4. DEBUGGING           → Claude Code                   │
│     Problemas complexos                                 │
│                                                         │
│  5. REFATORAÇÃO         → Claude Code + Knip            │
│     Limpeza de código morto                             │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## API Keys Necessárias

| Serviço | Onde obter | Variável de ambiente |
|---------|------------|---------------------|
| OpenAI | platform.openai.com | `OPENAI_API_KEY` |
| Anthropic | console.anthropic.com | `ANTHROPIC_API_KEY` |
| Google | console.cloud.google.com | `GOOGLE_API_KEY` |

### Armazenamento Seguro
```bash
# Adicionar ao ~/.bashrc (NÃO commitar!)
export OPENAI_API_KEY="sk-..."
export ANTHROPIC_API_KEY="sk-ant-..."
```

Ou usar um gerenciador de secrets como `direnv` ou `1password-cli`.
