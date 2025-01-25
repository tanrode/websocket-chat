import React, { useState, useEffect, useRef } from "react";
import "./App.css";

const socket = new WebSocket("ws://localhost:8080");
// const socket = new WebSocket("tanapp.freewebhostmost.com");

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null); // Reference to the end of the message list

  const userId = "You"; // This is the current user (could be dynamic if needed)
  const otherUserId = "Them"; // This would be the other user

  useEffect(() => {
    // Log WebSocket connection status
    socket.onopen = () => {
      console.log("WebSocket connected.");
    };

    socket.onmessage = (event) => {
      console.log("Message received:", event.data);

      // Check if the received data is a Blob
      if (event.data instanceof Blob) {
        const reader = new FileReader();

        reader.onloadend = () => {
          // Convert the Blob to a string and add it to the messages state
          setMessages((prevMessages) => [
            ...prevMessages,
            { sender: otherUserId, text: reader.result }, // Add sender info as User 2
          ]);
        };

        reader.readAsText(event.data); // Read the Blob as text
      } else {
        // Handle other types of messages (e.g., strings)
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: otherUserId, text: event.data }, // Add sender info as User 2
        ]);
      }
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socket.onclose = (event) => {
      if (event.wasClean) {
        console.log(
          `Closed cleanly, code=${event.code}, reason=${event.reason}`
        );
      } else {
        console.error(`Connection died, code=${event.code}`);
      }
    };

    // Cleanup on unmount
    return () => {
      // socket.close();
    };
  }, []);

  const sendMessage = () => {
    if (input.trim()) {
      console.log("Sending message:", input);
      // Add sender info as "You"
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: userId, text: input },
      ]);
      socket.send(input); // Send the message to the server
      setInput(""); // Clear the input field
    } else {
      console.log("Input is empty, not sending message.");
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">WebSocket Chat</h1>
      <div className="border p-4 rounded h-64 overflow-y-auto mb-4 bg-gray-100">
        {messages.map((msg, index) => (
          <div key={index} className="mb-2">
            {/* Display sender prefix */}
            <strong>{msg.sender}: </strong>
            {/* Render message text */}
            <span>{msg.text}</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-grow border p-2 rounded"
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default App;
