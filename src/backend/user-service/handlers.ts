import bcrypt from 'bcryptjs';
import { info, warn, error, debug } from '../logger.js';

export function createHandlers(db: any) { // Creates and returns user-related route handlers
  const userHandler = async (request: any, reply: any) => { // Retrieves all users
    const rows = db.prepare('SELECT id, username, email FROM users').all();
    return rows;
  };

  const loginHandler = async (request: any, reply: any) => { // Handles user login
      try {
      const body = (request.body as any) ?? {};
      const { username, password } = body;

      if (!username || !password) {
        return reply.status(400).send({ error: 'Invalid input: username, email and password(>=8) required' });
      }

      const existingUsername = db.prepare('SELECT id FROM users WHERE username = ?').get(username);
      if (!existingUsername) {
        return reply.status(409).send({ error: 'Username does not exist' });
      }

      // Fetch stored user
      const user = db.prepare('SELECT id, username, passwordHash FROM users WHERE username = ?')
                   .get(username);

      if (!user) {
      return reply.status(409).send({ error: 'Username does not exist' });
      }

      // Compare password with stored hash
      const passwordIsValid = await bcrypt.compare(password, user.passwordHash);
      if (!passwordIsValid) {
      return reply.status(401).send({ error: 'Invalid password' });
      }

      request.session.user = { id: user.id, username: user.username };
      
      // Logged in successfully
      return reply.status(200).send({
        id: user.id,
        username: user.username,
      });
      }
      catch (err) {
      return reply.status(500).send({ error: 'Server error' });
      }
  };

  const registerHandler = async (request: any, reply: any) => { // Handles user registration
    try {
      const body = (request.body as any) ?? {};
      const { username, email, password } = body;

      if (!username || !email || !password || password.length < 8) {
        return reply.status(400).send({ error: 'Invalid input: username, email and password(>=8) required' });
      }

        const existingUsername = db.prepare('SELECT id FROM users WHERE username = ?').get(username);
        if (existingUsername) {
          return reply.status(409).send({ error: 'Username already in use' });
        }

        const existingEmail = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
        if (existingEmail) {
          return reply.status(409).send({ error: 'Email already registered' });
        }

      const passwordHash = bcrypt.hashSync(password, 12);

      const insert = db.prepare('INSERT INTO users (username, email, passwordHash) VALUES (?, ?, ?)');
      const runResult = insert.run(username, email, passwordHash);
      const id = runResult.lastInsertRowid;

      return reply.status(201).send({ id, username, email });
    } 
    catch (err) {
      const payload = err instanceof Error ? { message: err.message, stack: err.stack } : { value: String(err) };
      error('register error', payload);
      return reply.status(500).send({ error:   'Server error' });
    }
  };

  const sessionHandler = async (request: any, reply: any) => { // Retrieves session info (login status)
    if (!request.session.user) {
      return reply.status(200).send({ loggedIn: false, user: null });
    }
    return reply.status(200).send({
      loggedIn: true,
      user: request.session.user
    })

  };

  const logoutHandler = async (request: any, reply: any) => { // Handles user logout
  request.session.destroy();
  reply.send({ ok: true });
  }

  return { registerHandler, userHandler, loginHandler, sessionHandler, logoutHandler }; 
}
