import bcrypt from 'bcryptjs';
import type { FastifyInstance } from 'fastify';

/**
 *
 * NOTE!!
 * Ideally there should be a service layer between the handlers and the database access.
 * This will be implemented later.
 */

// Creates and returns user-related route handlers
// Caddy sends e.g.: /api/users -> Backend receives: /
export function createHandlers(db: any, fastify: FastifyInstance) {
  // Only for testing!
  const testHandler = (request: any, reply: any) => {
    return { hello: 'world', service: 'user-service' };
  };

  // Retrieves all users
  const userHandler = async (request: any, reply: any) => {
    // Retrieves all users
    try {
      const users = db.prepare('SELECT * FROM users').all();
      return users;
    } catch (e) {
      fastify.log.error(e, 'Error fetching users:');
      return reply.status(500).send({ error: 'Database error' });
    }
  };

  // Handles user login
  const loginHandler = async (request: any, reply: any) => {
    // Handles user login
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
      const user = db.prepare('SELECT id, username, passwordHash FROM users WHERE username = ?').get(username);

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
    } catch (err) {
      return reply.status(500).send({ error: 'Server error' });
    }
  };

  // Handles user registration
  const registerHandler = async (request: any, reply: any) => {
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
    } catch (err) {
      const payload = err instanceof Error ? { message: err.message, stack: err.stack } : { value: String(err) };
      fastify.log.error(payload, 'Error during user registration:');
      return reply.status(500).send({ error: 'Server error' });
    }
  };

  // Retrieves session info (login status)
  const sessionHandler = async (request: any, reply: any) => {
    if (!request.session.user) {
      return reply.status(200).send({ loggedIn: false, user: null });
    }
    return reply.status(200).send({
      loggedIn: true,
      user: request.session.user,
    });
  };

  // Handles user logout
  const logoutHandler = async (request: any, reply: any) => {
    request.session.destroy();
    reply.send({ ok: true });
  };

  return { testHandler, registerHandler, userHandler, loginHandler, sessionHandler, logoutHandler };
}
