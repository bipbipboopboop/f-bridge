// BiddingRoom.tsx
import React, { useState } from "react";
import Modal from "react-modal";

import { useMediaQuery } from "react-responsive";
import { useAuth } from "../../../hooks/useAuth";

import { RestrictedPlayerProvider } from "../../../context/RestrictedPlayerContext";

import Chatbox from "../../chat/Chatbox";
import MatchPeripheral from "../MatchPeripheral";
import TeammatePanel from "./TeammatePanel";

const TeammateChoosingRoom: React.FC = () => {
  const isDesktop = useMediaQuery({ minWidth: 915 });
  const isLandscape = useMediaQuery({ orientation: "landscape" });

  const { playerAccount } = useAuth();
  const currentPlayerId = playerAccount?.id;
  const roomId = playerAccount?.roomID;

  if (!roomId || !currentPlayerId) {
    return null;
  }

  return (
    <RestrictedPlayerProvider roomID={roomId} playerID={currentPlayerId}>
      {isDesktop && <TeammateChoosingRoomWeb />}
      {!isDesktop && isLandscape && <TeammateChoosingRoomLandscape />}
      {!isDesktop && !isLandscape && <TeammateChoosingRoomPortrait />}
    </RestrictedPlayerProvider>
  );
};
const TeammateChoosingRoomWeb: React.FC = () => {
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
          <TeammatePanel />
          <MatchPeripheral />
        </div>
        <div className="h-full w-1/4 p-4">
          <Chatbox />
        </div>
      </div>
    </RestrictedPlayerProvider>
  );
};

const TeammateChoosingRoomLandscape = () => {
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
            className="bg-black/20 hover:bg-[#006cb1] p-2 rounded-md absolute bottom-[5%] left-4"
            onClick={openModal}
            style={{ zIndex: 1 }} // Ensure this is appropriately layered
          >
            Chat
          </button>
          <div className="w-full h-[95%] pt-4">
            <TeammatePanel />
            <MatchPeripheral />
          </div>
        </div>
      </div>
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
    </RestrictedPlayerProvider>
  );
};

const TeammateChoosingRoomPortrait = () => {
  return (
    <div className="h-full w-full flex flex-col justify-center text-center text-xl">
      Flip your phone man, who plays card game in portrait mode? :/
    </div>
  );
};

export default TeammateChoosingRoom;
