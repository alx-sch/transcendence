import { Component } from '../core/Component.js';

export class SessionPage extends Component {
  private loginIdEl!: HTMLElement;
  private loginStatusEl!: HTMLElement;

  render(): string {
    return `
      <main class="p-8">
        <section class="session-page max-w-md mx-auto flex flex-col gap-3">
          <h1 class="text-2xl font-bold mb-2">Is there a session?</h1>
          <p id="login-id" class="text-sm"></p>
          <p id="login-status" class="text-sm mt-2"></p>
        </section>
      </main>
    `;
  }

  connectedCallback(): void {
    this.innerHTML = this.render();

    // Save references in class properties
    this.loginIdEl = this.querySelector<HTMLElement>('#login-id')!;
    this.loginStatusEl = this.querySelector<HTMLElement>('#login-status')!;

    // Call function to fetch session status
    this.updateLoginStatus();
  }

  async updateLoginStatus() {
    if (!this.loginIdEl || !this.loginStatusEl) return;

    try {
      const res = await fetch('/api-user/session'); // GET session route on backend
      const data = await res.json();

      if (data.loggedIn) {
        this.loginIdEl.textContent = `User ID: ${data.user.id}`;
        this.loginStatusEl.textContent = `Logged in as: ${data.user.username}`;
        this.loginStatusEl.style.color = 'green';
        console.log('Session data:', data);
      } else {
        this.loginIdEl.textContent = '';
        this.loginStatusEl.textContent = 'Not logged in';
        this.loginStatusEl.style.color = 'gray';
      }
    } catch (err) {
      this.loginStatusEl.textContent = 'Cannot fetch login status';
      this.loginStatusEl.style.color = 'red';
      console.error(err);
    }
  }
}
customElements.define('session-page', SessionPage);
