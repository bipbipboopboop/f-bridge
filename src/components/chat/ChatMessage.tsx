// ChatMessage.tsx
import { Message } from "types/Message";
import { useRoom } from "../../context/RoomContext";
import { useAuth } from "../../hooks/useAuth";
import { Card } from "types/Card";
import { PublicPlayer } from "types/Player";
import PlayingCard from "../PlayingCard";

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

  if (message.type === "system") {
    return (
      <div className="text-center bg-gray-800 bg-opacity-30 mb-1 rounded p-2 break-words text-3xs md:text-xs">
        <span>{message.text}</span>
      </div>
    );
  }

  if (message.type === "teammate chosen") {
    const { bidWinner, chosenCard } = message.content as { bidWinner: PublicPlayer; chosenCard: Card };
    return (
      <div className="bg-lime-300 md:bg-black/20 mb-1 rounded p-2 break-words text-3xs md:text-xs flex flex-col items-center">
        <span>
          {bidWinner.displayName}[P{bidWinner.position}] has chosen
        </span>
        <PlayingCard card={chosenCard} />
        <span>as their teammate</span>
      </div>
    );
  }

  if (message.type === "playing trick") {
    const { player, chosenCard } = message.content as { player: PublicPlayer; chosenCard: Card };
    return (
      <div className="bg-gray-800 bg-opacity-30 mb-1 rounded p-2 break-words text-3xs md:text-xs flex flex-col items-center">
        <span>
          {player.displayName}[P{player.position}] has played
        </span>
        <PlayingCard card={chosenCard} />
      </div>
    );
  }

  return (
    <div className="mb-1 rounded p-1 md:py-3 break-words hover:bg-black/5 text-2xs md:text-xs">
      <span className={textColorLookup[player?.position!]}>{chatAuthor}</span>
      <span>{message.text}</span>
    </div>
  );
};

export default ChatMessage;
