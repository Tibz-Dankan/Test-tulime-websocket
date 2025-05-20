import React, { useState, useEffect, useRef } from "react";
import io, { Socket } from "socket.io-client";

export const SocketIOClient: React.FC = () => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [receivedMessages, setReceivedMessages] = useState<string[]>([]);
  const socketRef = useRef<Socket | null>(null);
  const [serverUrl, setServerUrl] = useState<string>("http://localhost:5000");

  useEffect(() => {
    return () => {
      // Clean up the socket connection when component unmounts
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  const connectToServer = (): void => {
    // Disconnect previous connection if exists
    if (socketRef.current) {
      socketRef.current.disconnect();
    }

    // Connect to socket.io server (v2)
    socketRef.current = io(serverUrl, {
      transports: ["websocket", "polling"], // Prefer WebSocket, fallback to polling
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    // Connection event handlers
    socketRef.current.on("connect", () => {
      console.log("Connected to server!");
      setIsConnected(true);
      setReceivedMessages((prev) => [...prev, "Connected to server"]);
    });

    socketRef.current.on("disconnect", () => {
      console.log("Disconnected from server!");
      setIsConnected(false);
      setReceivedMessages((prev) => [...prev, "Disconnected from server"]);
    });

    // Listen for the 'reply' event from server
    socketRef.current.on("reply", (data: string) => {
      console.log("Received reply:", data);
      setReceivedMessages((prev) => [...prev, `Reply: ${data}`]);
    });

    // Error handling
    socketRef.current.on("error", (error: Error) => {
      console.error("Socket error:", error);
      setReceivedMessages((prev) => [...prev, `Error: ${error.message}`]);
    });
  };

  const disconnectFromServer = (): void => {
    if (socketRef.current) {
      socketRef.current.disconnect();
    }
  };

  const sendNotice = (): void => {
    if (socketRef.current && isConnected && message.trim()) {
      console.log("Sending notice:", message);
      socketRef.current.emit("notice", message);
      setMessage("");
    } else {
      alert("Please connect to server and enter a message");
    }
  };

  const sendByeMessage = (): void => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit("bye");
      setReceivedMessages((prev) => [...prev, 'Sent "bye" event']);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setMessage(e.target.value);
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setServerUrl(e.target.value);
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-md">
      <h1 className="text-xl font-bold mb-4">Socket.IO Client (v2)</h1>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Server URL:</label>
        <div className="flex">
          <input
            type="text"
            value={serverUrl}
            onChange={handleUrlChange}
            className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md"
            placeholder="e.g., http://localhost:8000"
          />
          <button
            onClick={connectToServer}
            className={`px-4 py-2 rounded-r-md ${
              isConnected ? "bg-green-500" : "bg-blue-500"
            } text-white`}
            disabled={isConnected}
          >
            {isConnected ? "Connected" : "Connect"}
          </button>
        </div>
      </div>

      {isConnected && (
        <div className="mb-4">
          <div className="flex items-center mb-2">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span>Connected to server</span>
            <button
              onClick={disconnectFromServer}
              className="ml-auto px-3 py-1 bg-red-500 text-white rounded-md text-sm"
            >
              Disconnect
            </button>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">
              Send "notice" event:
            </label>
            <div className="flex">
              <input
                type="text"
                value={message}
                onChange={handleInputChange}
                className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md"
                placeholder="Enter your message"
              />
              <button
                onClick={sendNotice}
                className="px-4 py-2 bg-blue-500 text-white rounded-r-md"
              >
                Send
              </button>
            </div>
          </div>

          <button
            onClick={sendByeMessage}
            className="px-4 py-2 bg-yellow-500 text-white rounded-md mb-4"
          >
            Send "bye" event
          </button>
        </div>
      )}

      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Received Messages:</h2>
        <div className="border border-gray-300 rounded-md p-3 h-64 overflow-y-auto bg-gray-50">
          {receivedMessages.length > 0 ? (
            <ul className="list-none">
              {receivedMessages.map((msg, index) => (
                <li key={index} className="mb-1 pb-1 border-b border-gray-200">
                  {msg}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-center mt-6">No messages yet</p>
          )}
        </div>
      </div>
    </div>
  );
};
