// chat.js - Simple interface to OpenAI Chat API
// Requires a global OPENAI_API_KEY set in config.js (ignored by git)

async function sendMessage(message) {
  const apiKey = window.OPENAI_API_KEY;
  if (!apiKey) {
    alert('API key missing. Crie um arquivo config.js com window.OPENAI_API_KEY = "seu_token".');
    return null;
  }
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + apiKey
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: message }],
      max_tokens: 500
    })
  });
  if (!response.ok) {
    console.error('Erro na API', response.status, await response.text());
    return 'Desculpe, houve um erro ao contactar o serviço de chat.';
  }
  const data = await response.json();
  return data.choices?.[0]?.message?.content ?? 'Sem resposta.';
}

function appendMessage(text, fromUser = true) {
  const container = document.getElementById('chat-messages');
  const msg = document.createElement('div');
  msg.className = fromUser ? 'msg user' : 'msg bot';
  msg.textContent = text;
  container.appendChild(msg);
  container.scrollTop = container.scrollHeight;
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('chat-form');
  const input = document.getElementById('chat-input');

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    appendMessage(text, true);
    input.value = '';
    appendMessage('...', false);
    const botReply = await sendMessage(text);
    // replace the '...' with the actual reply
    const msgs = document.querySelectorAll('#chat-messages .msg.bot');
    msgs[msgs.length - 1].textContent = botReply;
  });
});
