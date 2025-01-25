const WebSocket = require("ws");
const server = new WebSocket.Server({ port: 8080 });

server.on("connection", (socket) => {
  console.log("Client connected");

  // Handle incoming messages from clients
  socket.on("message", (message) => {
    console.log("Received:", message);

    // Broadcast the message to all connected clients
    server.clients.forEach((client) => {
      if (client !== socket && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  // Handle socket close event
  socket.on("close", () => {
    console.log("Client disconnected");
  });

  // Handle socket error event
  socket.on("error", (err) => {
    console.error("WebSocket error:", err);
  });
});

console.log("WebSocket server running");
