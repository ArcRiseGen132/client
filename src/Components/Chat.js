import React, { useEffect, useRef, useState } from "react";
import ReactScrollableFeed from "react-scrollable-feed";
const Chat = ({ socket, username, room }) => {
  const [currentMessage, setCurrentMessage] = useState();
  const [messageList, setMessageList] = useState([]);
  const messagesEndRef = useRef(null);

  const sendMessage = async () => {
    if (currentMessage !== "") {
      // If the currentMessage is a string, applies these properties
      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };
      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      // Displays the host's message on their side as well
      setCurrentMessage("");
      //message goes back to the index.js
    }
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
      // Displays the host's message to the other person
      messagesEndRef.current?.scrollIntoView();
      console.log(data);
    });
  }, [socket]);

  //Updates every time the socket changes

  return (
    <div>
      <div className="chat-header">
        <p>Live Chat</p>
      </div>
      <ReactScrollableFeed className="chat-body">
        {messageList.map((messageContent) => {
          return (
            <div
              className="message"
              id={username === messageContent.author ? "other" : "you"}
            >
              <div>
                <div className="message-content">
                  <p> {messageContent.message}</p>
                </div>
                <div className="message-meta">
                  <p id="time"> {messageContent.time}</p>
                  <p id="author"> {messageContent.author}</p>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef}></div>
      </ReactScrollableFeed>
      <div className="chat-footer">
        <input
          type="text"
          placeholder="Type here..."
          onChange={(e) => setCurrentMessage(e.target.value)}
          onKeyPress={(e) => {
            e.key === "Enter" && sendMessage();
          }}
        />
        <button onClick={sendMessage}>➡</button>
      </div>
    </div>
  );
};

export default Chat;
