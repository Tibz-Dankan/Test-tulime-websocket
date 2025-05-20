import React, { useEffect, useState } from "react";

export const TulimeWebSocketClient: React.FC = () => {
  const [connectionStatus, setConnectionStatus] =
    useState<string>("Connecting...");
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    // Create WebSocket connection
    const socket = new WebSocket("ws://127.0.0.1:5000/ws");
    console.log("Attempting Connection...");

    // Connection opened
    socket.onopen = () => {
      console.log("Successfully Connected");
      setConnectionStatus("Connected");
      socket.send("Hi From the Tuliime web Client!");
      setMessages((prev) => [...prev, "Sent: Hi From the Tuliime web Client!"]);
    };

    // Listen for messages
    socket.onmessage = (event) => {
      console.log("Message from server:", event.data);
      setMessages((prev) => [...prev, `Received: ${event.data}`]);
    };

    // Connection closed
    socket.onclose = (event) => {
      console.log("Socket Closed Connection: ", event);
      setConnectionStatus("Disconnected");
      socket.send("Client Closed!");
    };

    // Connection error
    socket.onerror = (error) => {
      console.log("Socket Error: ", error);
      setConnectionStatus("Error connecting");
    };

    // Clean up the websocket connection on component unmount
    return () => {
      socket.close();
    };
  }, []); // Empty dependency array means this effect runs once on mount

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Hello from Tulime</h2>
      <div className="mb-4">
        <p className="font-semibold">
          Status:{" "}
          <span
            className={
              connectionStatus === "Connected"
                ? "text-green-600"
                : "text-red-600"
            }
          >
            {connectionStatus}
          </span>
        </p>
      </div>
      <div className="border rounded p-2">
        <h3 className="font-semibold mb-2">WebSocket Messages:</h3>
        {messages.length === 0 ? (
          <p className="text-gray-500">No messages yet</p>
        ) : (
          <ul className="space-y-1">
            {messages.map((message, index) => (
              <li key={index} className="border-b pb-1">
                {message}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
