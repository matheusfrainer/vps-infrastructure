import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs';

// Ler credenciais
const creds = JSON.parse(fs.readFileSync('/root/.claude/.credentials.json', 'utf8'));
const token = creds.claudeAiOauth.accessToken;

console.log('Token prefix:', token.substring(0, 20) + '...');
console.log('Testando diferentes configurações...\n');

// Teste 1: Com baseURL diferente
const endpoints = [
  'https://api.anthropic.com',
  'https://claude.ai/api',
];

for (const baseURL of endpoints) {
  console.log(`\nTestando: ${baseURL}`);
  try {
    const client = new Anthropic({
      authToken: token,
      baseURL: baseURL,
    });
    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 50,
      messages: [{ role: 'user', content: 'Diga oi' }],
    });
    console.log('✅ Sucesso!', message.content);
    break;
  } catch (error) {
    console.log('❌ Erro:', error.message?.substring(0, 100));
  }
}
