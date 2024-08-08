// ChatMessage.tsx
import { Message } from "types/Message";
import { useRoom } from "../../context/RoomContext";
import { useAuth } from "../../hooks/useAuth";

const ChatMessage = ({ message }: { message: Message }) => {
  const { room } = useRoom();
  const { playerAccount } = useAuth();
  const player = room?.players.find((player) => player.id === message.uid);

  const textColorLookup = {
    0: "text-rose-400",
    1: "text-amber-500",
    2: "text-fuchsia-400",
    3: "text-yellow-200",
  };

  const isYou = playerAccount?.id === message.uid;
  const chatAuthor = `${isYou ? "You" : player?.displayName} ${player?.position ? `[P${player?.position}]` : ""}: `;

  if (message.uid === "system") {
    return (
      <div className="text-center bg-gray-800 bg-opacity-30 mb-1 rounded p-2 break-words text-3xs md:text-xs">
        <span>{message.text}</span>
      </div>
    );
  }

  return (
    <div className="mb-1 rounded p-1 md:py-3 break-words hover:bg-black/5 text-3xs md:text-xs">
      <span className={textColorLookup[player?.position!]}>{chatAuthor}</span>
      <span>{message.text}</span>
    </div>
  );
};

export default ChatMessage;
