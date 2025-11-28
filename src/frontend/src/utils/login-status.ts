export async function updateLoginStatus(status: HTMLElement) { // ✅ Updates login status display
    	if (!status) return;
    	try {
    	  const res = await fetch('/api/session');
    	  const data = await res.json();
		  if (data.loggedIn) {
  		  	let username = data.user.username;
  		  	if (username.length > 10) {
    	  	username = username.slice(0, 10) + '...';
  		  	}
		  	status.textContent = `Logged in as: ${username}`;
  		  	status.style.color = 'white';
		  }
		  else {
    		status.textContent = 'Not logged in';
        	status.style.color = 'white';
      		}
    	} catch (err) {
    		status.textContent = 'Cannot fetch login status';
      		status.style.color = 'red';
			console.error(err);
			return;
    	}
}