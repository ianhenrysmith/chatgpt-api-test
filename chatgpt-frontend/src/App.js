import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [userMessage, setUserMessage] = useState("");
  const [assistantMessage, setAssistantMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:3001/api/chat", {
        userMessage,
      });
      setAssistantMessage(response.data.assistantMessage);
    } catch (error) {
      setAssistantMessage("Error fetching response from the server");
    }

    setLoading(false);
  };

  return (
    <div className="App">
      <h1>ChatGPT App</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          placeholder="Enter your message"
        />
        <button type="submit" disabled={loading}>
          {loading ? "Loading..." : "Send"}
        </button>
      </form>
      {assistantMessage && (
        <div>
          <h3>Assistant's response</h3>
          <p>{assistantMessage}</p>
        </div>
      )}
    </div>
  );
}

export default App;
