// ChatMessage.tsx
import { Message } from "types/Message";

const ChatMessage = ({ message }: { message: Message }) => {
  if (message.playerName === "system") {
    return (
      <div className="text-center bg-gray-800 bg-opacity-30 mb-1 rounded p-2 break-words text-2xs md:text-xs md:p-3">
        <span>{message.text}</span>
      </div>
    );
  }

  return (
    <div className="mb-1 rounded p-1 md:py-3 break-words hover:bg-black/5 text-2xs md:text-xs">
      <span className="font-bold">{message.playerName}: </span>
      <span>{message.text}</span>
    </div>
  );
};

export default ChatMessage;
