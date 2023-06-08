import {Message} from "types/Chat";
import "./chat.css";

const ChatMessage = (props: {message: Message}) => {
  const {message} = props;
  return (
    <div className="message">
      <span className="message-sender">{`${message.playerName}: `}</span>
      <span>{`${message.text}`}</span>
    </div>
  );
};

export default ChatMessage;
