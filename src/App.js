import "./App.css";
import io from "socket.io-client";
import { useState } from "react";
import Chat from "./Components/Chat";

const socket = io.connect("http://localhost:3001");

function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);

  const joinRoom = (data) => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", room);
      setShowChat(true);
      console.log(`User with ID ${socket.id} join_room ${data}`);
    } else {
      console.log("Username or room not found");
    }
  };

  return (
    <div className="chat-window">
      {!showChat ? (
        <div className="joinChatContainer">
          <h3>Join Chat</h3>
          <input
            type="text"
            placeholder="Enter a username"
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
          <input
            type="text"
            placeholder="Room ID..."
            onChange={(e) => {
              setRoom(e.target.value);
            }}
          />
          <button onClick={joinRoom}>Join A Room</button>
        </div>
      ) : (
        <Chat socket={socket} username={username} room={room}></Chat>
      )}
    </div>
  );
}

export default App;
