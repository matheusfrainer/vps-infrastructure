import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs';

// Ler credenciais
const creds = JSON.parse(fs.readFileSync('/root/.claude/.credentials.json', 'utf8'));
const token = creds.claudeAiOauth.accessToken;

console.log('Token prefix:', token.substring(0, 20) + '...');

// Testar com authToken (OAuth style)
const client = new Anthropic({
  authToken: token,
});

try {
  const message = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 50,
    messages: [{ role: 'user', content: 'Diga oi em português' }],
  });
  console.log('Sucesso!', message.content);
} catch (error) {
  console.error('Erro:', error.message);
}
