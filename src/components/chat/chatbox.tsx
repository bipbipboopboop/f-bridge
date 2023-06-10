import {Message} from "types/Chat";
import GreenButton from "../buttons/button.green";
import "./chat.css";
import ChatMessage from "./chat.message";

const Chatbox = () => {
  const messageList: Message[] = [
    {
      playerName: "Player 1",
      text: "Hi",
      createdAt: new Date(),
      uid: "2",
    },
    {
      playerName: "Player 2",
      text: "Hi",
      createdAt: new Date(),
      uid: "2",
    },
    {
      playerName: "Player 1",
      text: "Wassup",
      createdAt: new Date(),
      uid: "2",
    },
  ];
  return (
    <div className="chatbox">
      <h4>Chat</h4>
      <div className="message-list">
        {messageList.map((message, index) => (
          <ChatMessage message={message} key={index} />
        ))}
      </div>
      <div className="chatbox-bottom">
        <input type="text" className="textbox" />
        <GreenButton>Send</GreenButton>
      </div>
    </div>
  );
};

export default Chatbox;
