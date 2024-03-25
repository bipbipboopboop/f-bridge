import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useRestrictedPlayerData } from "../../context/RestrictedPlayerContext";
import { useRoom } from "../../context/RoomContext";

import MatchAvatar from "./MatchAvatar";
import PlayerHand from "./PlayerHand";
import OpponentHand from "./OpponentHand";
import Modal from "react-modal";
import Chatbox from "../chat/Chatbox";

import { useMediaQuery } from "react-responsive";

const MatchPeripheral: React.FC = () => {
  const isDesktop = useMediaQuery({ minWidth: 930 });
  const isLandscape = useMediaQuery({ orientation: "landscape" }) && !isDesktop;

  if (isDesktop) return <MatchPeripheralWeb />;
  if (isLandscape) return <MatchPeripheralLandscape />;
  return <></>;
};

const MatchPeripheralWeb: React.FC = () => {
  const { playerAccount } = useAuth();
  const { room } = useRoom();
  const { restrictedPlayer } = useRestrictedPlayerData();

  if (!playerAccount || !room || !restrictedPlayer) {
    return null;
  }

  const southPlayerPosition = room.players.find((player) => player.id === playerAccount.id)!.position as number;
  const westPlayerPosition = (southPlayerPosition + 3) % 4;
  const northPlayerPosition = (southPlayerPosition + 2) % 4;
  const eastPlayerPosition = (southPlayerPosition + 1) % 4;

  return (
    <div className="top-0 left-0 w-full h-full">
      <PlayerHand />

      <MatchAvatar position={westPlayerPosition} className="absolute top-[23%] left-5" />
      <MatchAvatar position={eastPlayerPosition} className="absolute top-[23%] right-5" />
      <MatchAvatar position={northPlayerPosition} className="absolute top-5 left-[5%]" />
      <MatchAvatar position={southPlayerPosition} className="absolute bottom-[16%] right-10" />

      <OpponentHand direction="west" className="absolute top-1/3 left-[22%]" />
      <OpponentHand direction="north" className="absolute top-5 left-1/2 transform -translate-x-1/2" />
      <OpponentHand direction="east" className="absolute top-1/3 right-[22%]" />
    </div>
  );
};

const MatchPeripheralLandscape = () => {
  const { playerAccount } = useAuth();
  const { room } = useRoom();
  const { restrictedPlayer } = useRestrictedPlayerData();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  if (!playerAccount || !room || !restrictedPlayer) {
    return null;
  }

  const southPlayerPosition = room.players.find((player) => player.id === playerAccount.id)!.position as number;
  const westPlayerPosition = (southPlayerPosition + 3) % 4;
  const northPlayerPosition = (southPlayerPosition + 2) % 4;
  const eastPlayerPosition = (southPlayerPosition + 1) % 4;

  return (
    <div className="top-0 left-0 w-full h-full">
      <PlayerHand />
      <MatchAvatar position={westPlayerPosition} className="absolute top-[23%] left-5" />
      <MatchAvatar position={eastPlayerPosition} className="absolute top-[23%] right-5" />
      <MatchAvatar position={northPlayerPosition} className="absolute top-5 left-[5%]" />
      <MatchAvatar position={southPlayerPosition} className="absolute bottom-[16%] left-14" />
      <OpponentHand direction="west" className="absolute top-[36%] left-[18%]" />
      <OpponentHand direction="north" className="absolute top-1 left-1/2 transform -translate-x-1/2" />
      <OpponentHand direction="east" className="absolute top-[36%] right-[18%]" />
      <button
        className="bg-black/20 hover:bg-[#006cb1] p-2 rounded-md absolute bottom-[5%] left-4"
        onClick={openModal}
        style={{ zIndex: 1 }}
      >
        Chat
      </button>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Chat Modal"
        style={{ overlay: { zIndex: 1 } }}
        className="bg-white rounded shadow p-6 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 z-10"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <Chatbox />
      </Modal>
    </div>
  );
};

export default MatchPeripheral;
