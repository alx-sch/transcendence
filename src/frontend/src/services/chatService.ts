class ChatService {
  ws: WebSocket | null = null;
  listeners = new Set<(msg: string) => void>();

  // Create the websocket once
  connect() {
    // If already connected, return the existing socket
    if (this.ws) return this.ws;

    // Create new websocket
    this.ws = new WebSocket('ws://localhost:3001/chat');

    // When a message arrives, forward it to all listeners
    this.ws.onmessage = (msg) => {
      for (const fn of this.listeners) {
        fn(msg.data);
      }
    };

    // Optionally: notify the server on connection (same as before)
    this.ws.onopen = () => {
      this.ws?.send('hi from client');
    };

    return this.ws;
  }

  // Send a message through the socket
  send(message: string) {
    this.ws?.send(message);
  }

  // UI components register interest in incoming messages
  onMessage(callback: (msg: string) => void) {
    this.listeners.add(callback);

    // Return a cleanup function (remove listener)
    return () => {
      this.listeners.delete(callback);
    };
  }
}

// Export *one* instance → singleton
export const chatService = new ChatService();
