import { Component } from "../core/Component.js";
import { logoutBtnHandler, updateLoginStatus } from '../utils/login-status.js';

export class TicTacToe extends Component {
  render(): string {
    return `
      <section class="p-8">
        <div class="fixed top-4 right-4 flex items-center gap-2 z-50">
        <p id="login-status" class="p-2 bg-gray-800 text-white rounded shadow-md"></p>
        <button id="logout-btn" class="p-2 bg-red-500 hover:bg-red-600 text-white px-3 py-3 rounded text-sm">
          Logout
        </button>
        </div>
        <h1 class="text-2xl font-bold mb-4">Tic Tac Toe</h1>
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
        
    // Update login status and add logout button handler
    const status = this.querySelector<HTMLElement>('#login-status'); // Stores an element (<p id="login-status" class="text-sm mt-2">).
    const logoutBtn = this.querySelector<HTMLButtonElement>('#logout-btn'); // Target logout button element
    if (!status || !logoutBtn) return;
    updateLoginStatus(status);
    logoutBtn.addEventListener('click', logoutBtnHandler.bind(null, status));
    
    this.initGame();
  }

  initGame() {
    const cells = this.querySelectorAll('.cell');
    let currentPlayer = 'X';
    let winner: string | null = null;

    const checkWinner = () => {
      const patterns = [
        [0, 1, 2],
        [0, 3, 6],
        [0, 4, 8],
        [1, 4, 7],
        [2, 5, 8],
        [2, 4, 6],
        [3, 4, 5],
        [6, 7, 8],
      ];
      patterns.forEach((p) => {
        if (cells[p[0]].textContent !== '' && cells[p[0]].textContent === cells[p[1]].textContent && cells[p[0]].textContent === cells[p[2]].textContent) {
          winner = cells[p[0]].textContent;
          this.querySelector('#winner')!.textContent = `${winner} wins!`;
        }
      });
    };

    cells.forEach((cell) => {
      cell.addEventListener('click', () => {
        if (winner) return;
        if (cell.textContent !== '') return;

        cell.textContent = currentPlayer;
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        checkWinner();
      });
    });
  }
}

customElements.define('tictactoe-page', TicTacToe);
