import { Component } from '../core/Component.js';
import { logoutBtnHandler, updateLoginStatus } from '../utils/login-status.js';

export class HomePage extends Component {
  render(): string {
    return `
	  <main class="p-8">
      <section class="home-page max-w-md mx-auto flex flex-col gap-3">
        <h1 class="text-2xl font-bold mb-2">Log in</h1>
        <form id="login-form" class="flex flex-col gap-3" action="/api/login" method="post">
          <label for="username"><b>Username</b></label>
          <input type="text" autofocus class="text-sm p-2 border border-gray-300 rounded" placeholder="Enter Username" name="username" required>
          <label for="password"><b>Password</b></label>
          <input type="password" class="text-sm p-2 border border-gray-300 rounded" placeholder="Enter Password" name="password" required>
          <button type="submit" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Log in</button>
          <label>
            <input type="checkbox" checked="checked" name="remember"> Remember me
          </label>
          <div class="flex justify-center">
            <a href="/register" class="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">Not registered?</a>
          </div>
          <p id="login-msg" class="text-sm"></p>
          <div class="fixed top-4 right-4 flex items-center gap-2 z-50">
          <p id="login-status" class="p-2 bg-gray-800 text-white rounded shadow-md"></p>
          <button id="logout-btn" class="p-2 bg-red-500 hover:bg-red-600 text-white px-3 py-3 rounded text-sm">
            Logout
          </button>
          </div>
        </form>
      </section>
	  </main>
	`;
  }
  connectedCallback(): void {
    // The connectedCallback() lifecycle hook fires when a component is inserted into the DOM.

    // 1. Call the render() method to generate the predefined HTML content for the component.
    this.innerHTML = this.render(); // The render() method is typically responsible for generating the HTML markup that represents the current state or content of the component.
    // When called, it returns a string of HTML.

    // 2. Stores the HTML "login form" element properties in a JavaScript class variable, and the HTML <p id="reg-msg">, used for outputting messages to the user.
    const form = this.querySelector<HTMLFormElement>('#login-form');
    const msg = this.querySelector<HTMLElement>('#login-msg');
    const status = this.querySelector<HTMLElement>('#login-status');
    const logoutBtn = this.querySelector<HTMLButtonElement>('#logout-btn');
    if (!form || !msg || !status || !logoutBtn) return;

    // Gets called initially to display current login state
    updateLoginStatus(status);

    // Logout button handler
    logoutBtn.addEventListener('click', logoutBtnHandler.bind(null, status));

    // 3. Defines an asynchronous function onSubmit to handle the form submission event (will not be called immediately, but when the user hits "enter" or clicks "log in").

    // 3.1. Sets up initial settings.
    const onSubmit = async (ev: Event) => {
      // Since JavaScript is single-threaded, it uses an event-driven, non-blocking I/O model to handle operations like network requests asynchronously.
      ev.preventDefault(); // Prevents the default form submission behavior (which would reload the page, which we don't want).
      msg.textContent = '';
      msg.style.color = 'red';

      // 3.2. Retrieves form data input by the user.
      const fd = new FormData(form);
      const username = String(fd.get('username') || '');
      const password = String(fd.get('password') || '');

      // 3.3 Validates the input and sends an error message if the input is invalid.
      if (!username || !password) {
        msg.textContent = 'Please fill out username and password fields.';
        return;
      }

      // 3.4 Sends the login request to the server.
      try {
        const res = await fetch('/api-user/login', {
          // Sends a POST request to the server at the endpoint '/api/login' using the Fetch API.
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
        });

        if (res.status === 200) {
          // If the server responds with a status code of 200 (OK), it indicates that the login was successful.
          msg.style.color = 'green';
          msg.textContent = 'You are now logged in.';
          updateLoginStatus(status);
          form.reset();
          return;
        }

        const data = await res.json().catch(() => ({})); // If the response status is not 200, it attempts to parse the response body as JSON to extract any error message sent by the server.
        msg.textContent = data?.error || `Login failed (${res.status})`;
      } catch (err) {
        msg.textContent = 'Network error';
        console.error(err);
      }
    };

    // 4. Attaches the onSubmit function as an event listener to the form's 'submit' event. So now when the user hits enter or clicks "log in", the onSubmit function will be called.
    form.addEventListener('submit', onSubmit); // Attaches the onSubmit function as an event listener to the form's 'submit' event.

    // 5. Stores a cleanup function in the component instance to remove the event listener when the component is disconnected from the DOM.
    (this as any).__cleanup = () => form.removeEventListener('submit', onSubmit);
  }

  disconnectedCallback(): void {
    // The disconnectedCallback() lifecycle hook fires when a component is removed or hidden from the DOM.
    const c = (this as any).__cleanup; // Retrieves the cleanup function stored in the component instance during connectedCallback.
    if (typeof c === 'function') c(); // If the cleanup function exists and is a function, it calls it to remove any event listeners or perform other cleanup tasks to prevent memory leaks.
  }
}

// Registers the class with the browser under the tag name <home-page>.
customElements.define('home-page', HomePage);

/**
 * 
 * Login Process

User submits credentials

Server verifies

Server generates session ID

Stores session on server

Sends session ID to browser in secure cookie

Browser sends cookie on every request

Server uses session to identify user

Logout Process

Server deletes session

Server clears the cookie

User is no longer authenticated
 */
