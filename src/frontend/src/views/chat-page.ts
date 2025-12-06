import { Component } from '../core/Component.js';

export class Chat extends Component {
  render(): string {
    return `
      <section class="p-8">
        <h1 class="text-2xl font-bold mb-4">Chat page</h1>
        <div id="messages" class="mt-4 p-2 border"></div>
        <input id="chat-input" class="border p-2 flex-1" placeholder="Type a message…" />
        <button id="send" class="ml-2 border p-2">Send</button>
      </section>
    `;
  }

  connectedCallback() {
    super.connectedCallback(); // this runs render()
    this.initWebsocket();
  }

  initWebsocket() {
    const ws = new WebSocket('ws://localhost:3001/chat');
    const messagesDiv = document.getElementById('messages');
    const input = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send');

    sendBtn?.addEventListener('click', (el) => {
      const text = input.value;
      if (text) {
        ws.send(text);
        input.value = '';
      }
    });

    ws.onopen = () => {
      ws.send('hi from client');
    };

    ws.onmessage = (msg) => {
      const p = document.createElement('p');
      p.textContent = 'Server: ' + msg.data;
      messagesDiv.appendChild(p);
    };
  }
}

customElements.define('chat-page', Chat);
