'use client';

import { useState, useRef } from 'react';

export default function TugOfWar() {
  const [sessionCode, setSessionCode] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [connected, setConnected] = useState(false);
  const [team, setTeam] = useState(null); // "A" or "B"
  const logRef = useRef(null);
  const wsRef = useRef(null);

  const awsEndpoint = "ws://3.26.3.22:8080";

  const appendLog = (message) => {
    if (logRef.current) {
      logRef.current.textContent += message + "\n";
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  };

  const handleJoin = () => {
    if (!sessionCode || !playerName) {
      alert("Please enter both a session code and your player name.");
      return;
    }

    const ws = new WebSocket(`${awsEndpoint}/click`);
    wsRef.current = ws;

    ws.onopen = () => {
      appendLog("Connected to server.");
      setConnected(true);
      const joinMessage = {
        action: "joinGame",
        sessionCode,
        playerName,
      };
      ws.send(JSON.stringify(joinMessage));
      appendLog("Sent join message: " + JSON.stringify(joinMessage));
    };

    ws.onmessage = (event) => appendLog("Message received: " + event.data);
    ws.onerror = (error) => appendLog("WebSocket error: " + error);
    ws.onclose = () => {
      appendLog("Disconnected from server.");
      setConnected(false);
    };
  };

  const handleClick = () => {
    if (wsRef.current?.readyState === WebSocket.OPEN && team) {
      const clickMessage = {
        action: "addPoints",
        sessionCode,
        team: team,
        points: 1,
      };
      wsRef.current.send(JSON.stringify(clickMessage));
      appendLog("Sent click message: " + JSON.stringify(clickMessage));
    } else {
      alert("WebSocket is not connected or team not selected.");
    }
  };

  return (
    <div className="container">
      <h1>Tug of War Game</h1>

      <div className="form-group">
        <label htmlFor="sessionInput">Session Code:</label>
        <input
          type="text"
          id="sessionInput"
          value={sessionCode}
          onChange={(e) => setSessionCode(e.target.value)}
          placeholder="Enter session code"
        />
      </div>

      <div className="form-group">
        <label htmlFor="playerNameInput">Player Name:</label>
        <input
          type="text"
          id="playerNameInput"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          placeholder="Enter your name"
        />
      </div>

      <button onClick={handleJoin}>Join Session</button>

      {connected && !team && (
        <div className="form-group">
          <label>Select Your Team:</label>
          <button onClick={() => setTeam("A")}>Join Team A</button>
          <button onClick={() => setTeam("B")}>Join Team B</button>
        </div>
      )}

      {connected && team && (
        <div className="form-group">
          <p>You are on <strong>Team {team}</strong></p>
          <button onClick={handleClick}>Click for Team {team}!</button>
        </div>
      )}

      <h2>Log</h2>
      <div id="log" ref={logRef}></div>
    </div>
  );
}
