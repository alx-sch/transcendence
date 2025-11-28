import { Component } from '../core/Component.js';
import { updateLoginStatus } from '../utils/login-status.js';

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
  connectedCallback(): void { // The connectedCallback() lifecycle hook fires when a component is inserted into the DOM.
    
    // 1. Call the render() method to generate the predefined HTML content for the component.
    this.innerHTML = this.render(); // The render() method is typically responsible for generating the HTML markup that represents the current state or content of the component. 
    // When called, it returns a string of HTML.
  
    // 2. Stores the HTML "register form" element properties in a JavaScript class variable, and the HTML <p id="reg-msg">, used for outputting messages to the user.
    const form = this.querySelector<HTMLFormElement>('#login-form'); // The form element itself (with already existing subelements - username, password, email).
    const msg = this.querySelector<HTMLElement>('#login-msg'); // Stores an (<p id="reg-msg" class="text-sm">).
	  const status = this.querySelector<HTMLElement>('#login-status'); // Stores an element (<p id="login-status" class="text-sm mt-2">).
    const logoutBtn = this.querySelector<HTMLButtonElement>('#logout-btn');
    if (!form || !msg || !status) return;

  	// Gets called initially to display current login state
  	updateLoginStatus(status);
  
    if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
    try {
      const res = await fetch('/api/logout', { method: 'POST' });
      if (res.ok) {
        status.textContent = 'Not logged in';
        updateLoginStatus(status); // refresh display
      }
    } catch (err) {
      console.error('Logout failed', err);
    }
  });
}

    // 3. Defines an asynchronous function onSubmit to handle the form submission event (will not be called immediately, but when the user clicks "Register").
  
    // 3.1. Sets up initial settings.
    const onSubmit = async (ev: Event) => { // Since JavaScript is single-threaded, it uses an event-driven, non-blocking I/O model to handle operations like network requests asynchronously.
      ev.preventDefault(); // Prevents the default form submission behavior (which would reload the page, which we don't want).
      msg.textContent = ''; // Clear previous messages
      msg.style.color = 'red'; // Default to red for error messages
    
    // 3.2. Retrieves form data input by the user.
      const fd = new FormData(form); // Creates an instance of FormData, which provides a way to easily construct a set of key/value pairs representing form fields and their values.
      const username = String(fd.get('username') || '').trim(); // Retrieves the value of the form field with the name 'username', converts it to a string, and trims any leading or trailing whitespace.
      const password = String(fd.get('password') || ''); // Retrieves the value of the form field with the name 'password' and converts it to a string.
    
    // 3.3 Validates the input and sends an error message if the input is invalid.
      if (!username || !password) { // Simple client-side validation to check if username and email are not empty and password is at least 8 characters long.
        msg.textContent = 'Please fill out username and password fields.';
        return;
      }
    
    // 3.4 Sends the registration data to the server using the Fetch API, and handles the server's response.
      try { // Tries to execute the code inside the block. If an error occurs, it jumps to the catch block.
        const res = await fetch('/api/login', { // Sends a POST request to the server at the endpoint '/api/register' using the Fetch API.
          method: 'POST', // Specifies that the request method is POST, which is typically used to submit data to be processed to a specified resource.
          headers: { 'Content-Type': 'application/json' }, // Sets the Content-Type header to 'application/json', indicating that the request body contains JSON data.
          body: JSON.stringify({ username, password }), // Converts the JavaScript object containing username, email, and password into a JSON string to be sent in the request body.
        });

        if (res.status === 200) { // If the server responds with a status code of 201 (Created), it indicates that the registration was successful.
          msg.style.color = 'green'; // Change message color to green for success.
          msg.textContent = 'You are now logged in.'; // Displays a success message to the user.
		      updateLoginStatus(status); // Refresh the status display
		      form.reset(); // Resets the form fields to their initial values.
          return; // Exit the function early since registration was successful.
        }

        const data = await res.json().catch(() => ({})); // If the response status is not 201, it attempts to parse the response body as JSON to extract any error message sent by the server.
        msg.textContent = data?.error || `Login failed (${res.status})`; // Displays the error message from the server or a generic failure message with the status code.
      } catch (err) { // Catches any network errors or exceptions that occur during the fetch operation.
        msg.textContent = 'Network error'; // Displays a network error message to the user.
        console.error(err); // Logs the error to the console for debugging purposes.
      }
    };

    // 4. Attaches the onSubmit function as an event listener to the form's 'submit' event. So now when the user clicks "Register", the onSubmit function will be called.
    form.addEventListener('submit', onSubmit); // Attaches the onSubmit function as an event listener to the form's 'submit' event.

    // 5. Stores a cleanup function in the component instance to remove the event listener when the component is disconnected from the DOM.
    (this as any).__cleanup = () => form.removeEventListener('submit', onSubmit);
  }

  disconnectedCallback(): void { // The disconnectedCallback() lifecycle hook fires when a component is removed or hidden from the DOM.
    const c = (this as any).__cleanup; // Retrieves the cleanup function stored in the component instance during connectedCallback.
    if (typeof c === 'function') c(); // If the cleanup function exists and is a function, it calls it to remove any event listeners or perform other cleanup tasks to prevent memory leaks.
  }
}

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