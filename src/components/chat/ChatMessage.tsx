// ChatMessage.tsx
import { Message } from "types/Message";

const ChatMessage = ({ message }: { message: Message }) => {
  if (message.playerName === "system") {
    return (
      <div className="text-center bg-gray-800 bg-opacity-30 mb-1 rounded p-4 break-words">
        <span>{message.text}</span>
      </div>
    );
  }

  return (
    <div className="mb-1 rounded p-4 break-words hover:bg-gray-100">
      <span className="font-bold">{message.playerName}: </span>
      <span>{message.text}</span>
    </div>
  );
};

export default ChatMessage;
