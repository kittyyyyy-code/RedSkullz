// App.js
import React, { useEffect, useState } from "react";
import { db } from "./firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";
import "./styles.css";

export default function App() {
  const [username, setUsername] = useState("");
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");

  useEffect(() => {
    const q = query(collection(db, "rooms/Hexagon Lounge/messages"), orderBy("createdAt"));
    const unsub = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return unsub;
  }, []);

  const sendMessage = async () => {
    if (!newMsg.trim()) return;
    await addDoc(collection(db, "rooms/Hexagon Lounge/messages"), {
      text: newMsg,
      user: username || "Anonymous Cat 😺",
      createdAt: serverTimestamp(),
    });
    setNewMsg("");
  };

  if (!username) {
    return (
      <div className="login">
        <h1>🐱 Welcome to Hexagon 🧩</h1>
        <input
          placeholder="Enter your cat name..."
          onChange={(e) => setUsername(e.target.value)}
        />
        <button onClick={() => username && setUsername(username)}>Join 🐾</button>
      </div>
    );
  }

  return (
    <div className="chatroom">
      <h2>🧩 {username}’s Chat Room</h2>

      <div className="messages">
        {messages.map((msg) => (
          <div key={msg.id} className="message">
            <strong>{msg.user}:</strong> {msg.text}
          </div>
        ))}
      </div>

      <div className="input-area">
        <input
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
          placeholder="Type your meow..."
        />
        <button onClick={sendMessage}>Send 💌</button>
      </div>
    </div>
  );
}
