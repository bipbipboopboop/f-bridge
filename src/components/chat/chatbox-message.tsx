import {Message} from "types/Chat";
import "./chat.css";

const ChatMessage = (props: {message: Message}) => {
  const {message} = props;

  if (message.playerName === "system") {
    return (
      <div className="system-message">
        <span>{message.text}</span>
      </div>
    );
  }
  return (
    <div className="message">
      <span className="message-sender">{`${message.playerName}: `}</span>
      <span>{`${message.text}`}</span>
    </div>
  );
};

export default ChatMessage;
