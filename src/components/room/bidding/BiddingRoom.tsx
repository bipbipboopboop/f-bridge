// BiddingRoom.tsx
import React, { useState } from "react";
import Modal from "react-modal";
import Chatbox from "../../chat/Chatbox";
import Auction from "./Auction";

import { RestrictedPlayerProvider } from "../../../context/RestrictedPlayerContext";

import { useAuth } from "../../../hooks/useAuth";
import MatchPeripheral from "../MatchPeripheral";
import { useMediaQuery } from "react-responsive";

const BiddingRoom: React.FC = () => {
  const isDesktop = useMediaQuery({ minWidth: 768 });
  const isLandscape = useMediaQuery({ orientation: "landscape" });

  if (isDesktop) return <BiddingRoomWeb />;
  if (isLandscape) return <BiddingRoomLandscape />;
  return <></>;
};

const BiddingRoomWeb: React.FC = () => {
  const { playerAccount } = useAuth();
  const currentPlayerId = playerAccount?.id;
  const roomId = playerAccount?.roomID;

  if (!roomId || !currentPlayerId) {
    return null;
  }

  return (
    <RestrictedPlayerProvider roomID={roomId} playerID={currentPlayerId}>
      <div className="flex w-full h-full">
        <div className="relative h-full w-3/4 pt-4">
          <Auction />
          <MatchPeripheral />
        </div>
        <div className="h-full w-1/4 p-4">
          <Chatbox />
        </div>
      </div>
    </RestrictedPlayerProvider>
  );
};

const BiddingRoomLandscape = () => {
  const { playerAccount } = useAuth();
  const currentPlayerId = playerAccount?.id;
  const roomId = playerAccount?.roomID;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  if (!roomId || !currentPlayerId) {
    return null;
  }

  return (
    <RestrictedPlayerProvider roomID={roomId} playerID={currentPlayerId}>
      <div className="flex w-full h-full">
        <div className="relative h-full w-full">
          <button
            className="bg-black/20 hover:bg-[#006cb1] p-2 rounded-md absolute top-[5%] right-4"
            onClick={openModal}
          >
            Chat
          </button>
          <div className="w-full h-[95%] pt-4">
            <Auction />
            <MatchPeripheral />
          </div>
        </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Chat Modal"
        className="bg-white rounded shadow p-6 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <Chatbox />
      </Modal>
    </RestrictedPlayerProvider>
  );
};

export default BiddingRoom;
