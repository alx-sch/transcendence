import { Component } from '../core/Component.js';

export class TicTacToe extends Component {
  render(): string {
    return `
      <section class="p-8">
        <h1 class="text-2xl font-bold mb-4">Tic Tac Toe</h1>
        <div>Numbers of players <span id="playerCount">0</span></div>
        <div id="tic-tac-toe" class="grid grid-cols-3 gap-2 w-50">
          <div class="cell border p-4 text-center size-15 cursor-pointer"></div>
          <div class="cell border p-4 text-center size-15 cursor-pointer"></div>
          <div class="cell border p-4 text-center size-15 cursor-pointer"></div>
          <div class="cell border p-4 text-center size-15 cursor-pointer"></div>
          <div class="cell border p-4 text-center size-15 cursor-pointer"></div>
          <div class="cell border p-4 text-center size-15 cursor-pointer"></div>
          <div class="cell border p-4 text-center size-15 cursor-pointer"></div>
          <div class="cell border p-4 text-center size-15 cursor-pointer"></div>
          <div class="cell border p-4 text-center size-15 cursor-pointer"></div>
        </div>
        <p id="winner"></p>
      </section>
    `;
  }

  connectedCallback() {
    super.connectedCallback(); // this runs render()
    this.initGame();
  }

  gameUpdate(update: any) {
    const playerCount = document.getElementById('playerCount');
    if (playerCount) playerCount.innerText = update.payload.players;
  }

  initGame() {
    const ws = new WebSocket('ws://localhost:3002/tictactoe');
    ws.onerror = (error) => {
      console.error(error);
    };
    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: 'newUser',
        })
      );
    };
    ws.onmessage = (message) => {
      const messageJson = JSON.parse(message.data.toString());
      console.log(messageJson);
      if (messageJson.type === 'gameUpdate') this.gameUpdate(messageJson);
    };

    // const cells = this.querySelectorAll('.cell');
    // let currentPlayer = 'X';
    // let winner: string | null = null;

    // const checkWinner = () => {
    //   const patterns = [
    //     [0, 1, 2],
    //     [0, 3, 6],
    //     [0, 4, 8],
    //     [1, 4, 7],
    //     [2, 5, 8],
    //     [2, 4, 6],
    //     [3, 4, 5],
    //     [6, 7, 8],
    //   ];
    //   patterns.forEach((p) => {
    //     if (cells[p[0]].textContent !== '' && cells[p[0]].textContent === cells[p[1]].textContent && cells[p[0]].textContent === cells[p[2]].textContent) {
    //       winner = cells[p[0]].textContent;
    //       this.querySelector('#winner')!.textContent = `${winner} wins!`;
    //     }
    //   });
    // };

    // cells.forEach((cell) => {
    //   cell.addEventListener('click', () => {
    //     if (winner) return;
    //     if (cell.textContent !== '') return;

    //     cell.textContent = currentPlayer;
    //     currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    //     checkWinner();
    //   });
    // });
  }
}

customElements.define('tictactoe-page', TicTacToe);
