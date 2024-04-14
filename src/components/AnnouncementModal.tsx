import React, { useEffect, useState } from "react";
import { Announcement } from "types/Annoucement";
import { useSpring, animated } from "react-spring";
import Button from "./buttons/Button";
import { useRoom } from "../context/RoomContext";
import { useAuth } from "../hooks/useAuth";
import TeammateCard from "./room/in-game/choosing-teammate/TeammateCard";

interface AnnouncementModalProps {
  announcement: Announcement;
  onClose: () => void;
}

const AnnouncementModal: React.FC<AnnouncementModalProps> = ({ announcement, onClose }) => {
  const { room } = useRoom();
  const { playerAccount } = useAuth();
  const [isYourTurn, setIsYourTurn] = useState(false);

  useEffect(() => {
    if (room && playerAccount) {
      const currentPlayerId = playerAccount.id;
      const currentPlayerIndex = room.phase.trickTakingPhase?.currentPlayerIndex;
      const playerIndex = room.players.findIndex((player) => player.id === currentPlayerId);
      setIsYourTurn(currentPlayerIndex === playerIndex);
    }
  }, [room, playerAccount]);

  const modalAnimation = useSpring({
    from: { top: "-50%", opacity: 1 },
    to: { top: "50%", opacity: 1 },
  });

  const renderAnnouncementContent = () => {
    switch (announcement.gameStatus) {
      case "Choosing Teammate":
        if (announcement.teammateChoosingAnnoucement) {
          const { bidWinnerName, chosenCard, bidWinnerID } = announcement.teammateChoosingAnnoucement;
          const nextPlayer = room?.players.find(
            (player) => player.position === room.phase.trickTakingPhase?.currentPlayerIndex
          );
          if (bidWinnerID === playerAccount?.id) {
            return (
              <div className="space-y-4">
                <p>
                  You have chosen the owner of {chosenCard.rank}
                  {chosenCard.suit} to be your teammate.
                </p>
                <p>
                  {nextPlayer?.displayName} (P{nextPlayer?.position}) will lead the trick.
                </p>
                <div className="flex justify-center py-4">
                  <TeammateCard suit={chosenCard.suit} rank={chosenCard.rank} />
                </div>
              </div>
            );
          }
          if (isYourTurn) {
            return (
              <div className="space-y-4">
                <p>
                  {bidWinnerName} has chosen the owner of {chosenCard.rank}
                  {chosenCard.suit} to be their teammate.
                </p>
                <div className="flex justify-center py-4">
                  <TeammateCard suit={chosenCard.suit} rank={chosenCard.rank} />
                </div>
                <p>It's your turn to play!</p>
              </div>
            );
          }
          return (
            <div className="space-y-4">
              <p>
                {bidWinnerName} has chosen the owner of {chosenCard.rank}
                {chosenCard.suit} to be their teammate.
              </p>
              <div className="flex justify-center py-4">
                <TeammateCard suit={chosenCard.suit} rank={chosenCard.rank} />
              </div>
              <p>
                {nextPlayer?.displayName} (P{nextPlayer?.position}) will lead the trick.
              </p>
            </div>
          );
        }
        break;
      case "Taking Trick":
        if (announcement.trickTakingAnnouncement) {
          const { trickWinnerName, trickWinnerID } = announcement.trickTakingAnnouncement;
          const trickWinnerPlayer = room?.players.find((player) => player.id === trickWinnerID);
          if (trickWinnerID === playerAccount?.id) {
            return (
              <div className="space-y-4">
                <p>You won the trick!</p>
                <p>It's your turn to lead the next trick.</p>
              </div>
            );
          }
          return (
            <div className="space-y-4">
              <p>
                {trickWinnerName} (P{trickWinnerPlayer?.position}) won the trick!
              </p>
              <p>
                {trickWinnerName} (P{trickWinnerPlayer?.position}) will lead the next trick.
              </p>
            </div>
          );
        }
        break;
      case "Ended":
        if (announcement.endedAnnouncement) {
          const { winningTeamName } = announcement.endedAnnouncement;
          return (
            <div>
              <p>{winningTeamName} team has won the game!</p>
            </div>
          );
        }
        break;
      default:
        return null;
    }
  };

  return (
    <div className="fixed z-50 inset-0 overflow-y-auto ">
      <div className="absolute inset-0 bg-gray-700 opacity-75"></div>
      <div className="flex items-center justify-center h-full w-full">
        <animated.div style={modalAnimation} className="rounded-lg transform transition-all">
          <div className="bg-teal-400 text-black px-4 pt-5 pb-4 sm:p-6 sm:pb-4 h-1/2">
            <div className="flex flex-col text-center">
              <h3 className="text-lg">{announcement.title}</h3>
              <div className="mt-2">{renderAnnouncementContent()}</div>
            </div>
          </div>
          <div className="bg-teal-400 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <Button theme="orange" onClick={onClose} size={1}>
              OK
            </Button>
          </div>
        </animated.div>
      </div>
    </div>
  );
};

export default AnnouncementModal;
