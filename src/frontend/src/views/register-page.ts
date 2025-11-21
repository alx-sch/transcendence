import { Component } from '../core/Component.js';

export class RegisterPage extends Component {
  render(): string {
    return `
      <main class="p-8">
        <section class="register-page max-w-md mx-auto flex flex-col gap-3">
          <h1 class="text-2xl font-bold mb-2">User registration</h1>

          <form id="register-form" class="flex flex-col gap-3" action="/api/register" method="post" novalidate>
            <input name="username" type="text" class="text-sm p-2 border border-gray-300 rounded" placeholder="Username" required />
            <input name="email" type="email" class="text-sm p-2 border border-gray-300 rounded" placeholder="Email" required />
            <input name="password" type="password" class="text-sm p-2 border border-gray-300 rounded" placeholder="Password" minlength="8" required />
            <button type="submit" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Register</button>
            <p id="reg-msg" class="text-sm"></p>
          </form>

        </section>
      </main>
    `;
  }

  connectedCallback(): void {
    this.innerHTML = this.render();

    const form = this.querySelector<HTMLFormElement>('#register-form');
    const msg = this.querySelector<HTMLElement>('#reg-msg');
    if (!form || !msg) return;

    const onSubmit = async (ev: Event) => {
      ev.preventDefault(); // stop default /register POST
      msg.textContent = '';
      msg.style.color = 'red';

      const fd = new FormData(form);
      const username = String(fd.get('username') || '').trim();
      const email = String(fd.get('email') || '').trim();
      const password = String(fd.get('password') || '');

      if (!username || !email || password.length < 8) {
        msg.textContent = 'Please fill all fields and use a password >= 8 chars.';
        return;
      }

      try {
        const res = await fetch('/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, email, password }),
        });

        if (res.status === 201) {
          msg.style.color = 'green';
          msg.textContent = 'Account created. You can now log in.';
          form.reset();
          return;
        }

        const data = await res.json().catch(() => ({}));
        msg.textContent = data?.error || `Registration failed (${res.status})`;
      } catch (err) {
        msg.textContent = 'Network error';
        console.error(err);
      }
    };

    form.addEventListener('submit', onSubmit);
    (this as any).__cleanup = () => form.removeEventListener('submit', onSubmit);
  }

  disconnectedCallback(): void {
    const c = (this as any).__cleanup;
    if (typeof c === 'function') c();
  }
}

customElements.define('register-page', RegisterPage);
