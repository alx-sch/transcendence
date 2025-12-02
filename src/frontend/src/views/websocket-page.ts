import { Component } from '../core/Component.js';

export class Websocket extends Component {
  render(): string {
    return `
      <section class="p-8">
        <h1 class="text-2xl font-bold mb-4">Websocket page</h1>
        <p>
          Open the console in the dev tools
        </p>
      </section>
    `;
  }

  connectedCallback() {
    super.connectedCallback(); // this runs render()
    this.initWebsocket();
  }

  initWebsocket() {
    const ws = new WebSocket('ws://localhost:3000/');

    ws.onopen = () => {
      ws.send('hi from client');
    };

    ws.onmessage = (msg) => {
      console.log('server says:', msg.data);
    };
  }
}

customElements.define('websocket-page', Websocket);
