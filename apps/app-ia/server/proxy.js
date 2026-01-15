import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3001;

// Caminho das credenciais e do Claude CLI
const CREDENTIALS_PATH = path.join(process.env.HOME || '/root', '.claude', '.credentials.json');
const CLAUDE_PATH = '/root/.local/bin/claude';

app.use(cors());
app.use(express.json());

// Função para ler credenciais
function getCredentials() {
  try {
    const data = fs.readFileSync(CREDENTIALS_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Erro ao ler credenciais:', error.message);
    return null;
  }
}

// Endpoint de status
app.get('/api/status', (req, res) => {
  const credentials = getCredentials();
  if (!credentials?.claudeAiOauth) {
    return res.json({ authenticated: false, error: 'Credenciais não encontradas' });
  }
  
  const oauth = credentials.claudeAiOauth;
  const now = Date.now();
  
  res.json({
    authenticated: true,
    subscriptionType: oauth.subscriptionType,
    rateLimitTier: oauth.rateLimitTier,
    scopes: oauth.scopes,
    expiresAt: oauth.expiresAt,
    expiresIn: Math.max(0, Math.floor((oauth.expiresAt - now) / 1000 / 60)) + ' minutos',
    isExpired: oauth.expiresAt < now,
  });
});

// Função para executar o Claude CLI via shell
function runClaudeCLI(prompt, systemPrompt = '') {
  // Escapar aspas simples no prompt
  const escapedPrompt = prompt.replace(/'/g, "'\\''");
  const escapedSystem = systemPrompt ? systemPrompt.replace(/'/g, "'\\''") : '';
  
  let command = `${CLAUDE_PATH} --print`;
  
  if (escapedSystem) {
    command += ` --system-prompt '${escapedSystem}'`;
  }
  
  command += ` '${escapedPrompt}'`;

  console.log(`[${new Date().toISOString()}] Executando comando...`);
  
  try {
    const result = execSync(command, {
      encoding: 'utf8',
      timeout: 120000, // 2 minutos
      maxBuffer: 10 * 1024 * 1024, // 10MB
      env: {
        ...process.env,
        HOME: process.env.HOME || '/root',
        PATH: '/root/.local/bin:/root/.nvm/versions/node/v24.12.0/bin:/usr/local/bin:/usr/bin:/bin',
      },
      cwd: process.env.HOME || '/root',
    });
    
    return result.trim();
  } catch (error) {
    console.error('[execSync error]', error.message);
    throw new Error(error.stderr || error.message);
  }
}

// Proxy para mensagens usando Claude CLI
app.post('/api/messages', async (req, res) => {
  try {
    const { messages, system } = req.body;
    
    if (!messages || messages.length === 0) {
      return res.status(400).json({ error: 'Nenhuma mensagem encontrada' });
    }

    // Construir prompt com histórico completo para manter contexto
    const conversationHistory = messages.map(m => {
      const content = typeof m.content === 'string' 
        ? m.content 
        : m.content.map(c => c.text || '').join('');
      return `${m.role === 'user' ? 'Usuário' : 'Assistente'}: ${content}`;
    }).join('\n\n');
    
    // O prompt final inclui o histórico
    const prompt = `Histórico da conversa:\n${conversationHistory}\n\nContinue a conversa respondendo à última mensagem do usuário.`;

    console.log(`\n[${new Date().toISOString()}] Novo request`);
    console.log('[prompt]', prompt.substring(0, 100) + (prompt.length > 100 ? '...' : ''));
    
    // Executar via Claude CLI
    const response = runClaudeCLI(prompt, system);
    
    console.log('[response]', response.substring(0, 100) + (response.length > 100 ? '...' : ''));
    
    // Formatar resposta no formato da API Anthropic
    res.json({
      id: 'msg_' + Date.now(),
      type: 'message',
      role: 'assistant',
      content: [{ type: 'text', text: response }],
      model: req.body.model || 'claude-sonnet-4-20250514',
      stop_reason: 'end_turn',
      usage: { input_tokens: 0, output_tokens: 0 },
    });
  } catch (error) {
    console.error('[ERROR]', error.message);
    res.status(500).json({ 
      type: 'error',
      error: { type: 'api_error', message: error.message }
    });
  }
});

// Rota raiz
app.get('/', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Proxy OAuth para Claude CLI',
    endpoints: {
      status: '/api/status',
      messages: 'POST /api/messages'
    }
  });
});

app.listen(PORT, () => {
  console.log(`\n🔐 Proxy OAuth (via Claude CLI) rodando em http://localhost:${PORT}`);
  console.log(`📁 Claude CLI: ${CLAUDE_PATH}`);
  
  const credentials = getCredentials();
  if (credentials?.claudeAiOauth) {
    const oauth = credentials.claudeAiOauth;
    const now = Date.now();
    const expiresIn = Math.floor((oauth.expiresAt - now) / 1000 / 60);
    console.log(`✅ Credenciais encontradas (${oauth.subscriptionType})`);
    console.log(`⏱️  Token expira em ${expiresIn} minutos`);
  } else {
    console.log('❌ Credenciais não encontradas');
  }
  console.log('');
});
