import React, { useState } from "react";
import axios from "axios";
import botAvatar from "./1.png"; // Add a small avatar image to src folder
import userAvatar from "./2.png"; // Optional, for user

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input) return;
    const userMsg = input;
    setMessages(msgs => [...msgs, { sender: "user", text: userMsg }]);
    setInput("");
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL;
      const res = await axios.post(`${backendUrl}/chat`, { question: userMsg });
      setMessages(msgs => [...msgs, { sender: "user", text: userMsg }, { sender: "bot", text: res.data.answer }]);
    } catch {
      setMessages(msgs => [...msgs, { sender: "bot", text: "Error: Could not reach backend." }]);
    }
  };

  return (
    <div style={{
      width: 400,
      margin: "40px auto",
      borderRadius: 12,
      overflow: "hidden",
      boxShadow: "0 2px 16px #0001",
      background: "#f9fbfc",
      fontFamily: "Segoe UI, sans-serif"
    }}>
      {/* Header */}
      <div style={{
        background: "#06a2ea",
        color: "#fff",
        padding: "14px 20px",
        fontSize: 20,
        fontWeight: "bold",
        letterSpacing: 1,
      }}>
        Varmodel Bot
      </div>
      {/* Avatars/online (optional, for fun) */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 12,
        background: "#f2f5f7",
        borderBottom: "1px solid #eee",
      }}>
        <img src={botAvatar} alt="Bot" style={{ width: 38, height: 38, borderRadius: "50%", marginRight: 10, border: "2px solid #06a2ea" }} />
        <span style={{ fontWeight: 500, color: "#444" }}>We are online and ready to help!</span>
      </div>
      {/* Messages */}
      <div style={{
        minHeight: 250,
        maxHeight: 320,
        overflowY: "auto",
        padding: "16px 10px",
        background: "#fff"
      }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            display: "flex",
            flexDirection: msg.sender === "user" ? "row-reverse" : "row",
            alignItems: "center",
            marginBottom: 12
          }}>
            <img
              src={msg.sender === "user" ? userAvatar : botAvatar}
              alt=""
              style={{
                width: 30, height: 30, borderRadius: "50%",
                margin: msg.sender === "user" ? "0 0 0 8px" : "0 8px 0 0",
                border: msg.sender === "user" ? "2px solid #36d" : "2px solid #06a2ea"
              }}
            />
            <div style={{
              background: msg.sender === "user" ? "#e4f0fe" : "#f2f5f7",
              color: "#222",
              padding: "10px 16px",
              borderRadius: 16,
              maxWidth: 210,
              fontSize: 16,
              marginLeft: msg.sender === "user" ? 0 : 6,
              marginRight: msg.sender === "user" ? 6 : 0
            }}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>
      {/* Input */}
      <div style={{
        padding: 12,
        borderTop: "1px solid #eee",
        background: "#fafcfd",
        display: "flex"
      }}>
        <input
          style={{
            flex: 1, border: "1px solid #ccc", borderRadius: 8, padding: 10, fontSize: 16
          }}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") sendMessage(); }}
          placeholder="Enter message..."
        />
        <button
          style={{
            marginLeft: 10, padding: "10px 18px", borderRadius: 8, border: "none",
            background: "#06a2ea", color: "#fff", fontWeight: "bold", cursor: "pointer"
          }}
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default App;
