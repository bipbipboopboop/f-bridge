// TrickTakingRoom.tsx
import React from "react";
import Modal from "react-modal";

import { RestrictedPlayerProvider } from "../../../context/RestrictedPlayerContext";

import { useAuth } from "../../../hooks/useAuth";
import { useMediaQuery } from "react-responsive";

import Chatbox from "../../chat/Chatbox";
import MatchPeripheral from "../MatchPeripheral";
import TrickArea from "./TrickArea";
import TrickMonitor from "./TrickMonitor";

const TrickTakingRoom: React.FC = () => {
  const { playerAccount } = useAuth();
  const currentPlayerId = playerAccount?.id;
  const roomId = playerAccount?.roomID;
  const isDesktop = useMediaQuery({ minWidth: 768 });
  const isLandscape = useMediaQuery({ orientation: "landscape" });

  if (!roomId || !currentPlayerId) {
    return null;
  }

  return (
    <RestrictedPlayerProvider roomID={roomId} playerID={currentPlayerId}>
      {isDesktop && <TrickTakingRoomWeb />}
      {!isDesktop && isLandscape && <TrickTakingRoomLandscape />}
      {!isDesktop && !isLandscape && <TrickTakingRoomPortrait />}
    </RestrictedPlayerProvider>
  );
};

const TrickTakingRoomWeb: React.FC = () => {
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
          <TrickArea />
          <MatchPeripheral />
        </div>
        <div className="h-full w-1/4 p-4 flex flex-col">
          <div className="h-2/5">
            <TrickMonitor />
          </div>
          <div className="h-3/5">
            <Chatbox />
          </div>
        </div>
      </div>
    </RestrictedPlayerProvider>
  );
};

const TrickTakingRoomLandscape = () => {
  const { playerAccount } = useAuth();
  const currentPlayerId = playerAccount?.id;
  const roomId = playerAccount?.roomID;
  // Use separate state variables for each modal
  const [isChatModalOpen, setIsChatModalOpen] = React.useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = React.useState(false);

  // Separate functions to open each modal
  const openChatModal = () => {
    setIsChatModalOpen(true);
    setIsInfoModalOpen(false); // Ensure Info modal is closed when Chat opens
  };
  const openInfoModal = () => {
    setIsInfoModalOpen(true);
    setIsChatModalOpen(false); // Ensure Chat modal is closed when Info opens
  };

  // Function to close any open modal
  const closeModal = () => {
    setIsChatModalOpen(false);
    setIsInfoModalOpen(false);
  };

  if (!roomId || !currentPlayerId) {
    return null;
  }

  return (
    <RestrictedPlayerProvider roomID={roomId} playerID={currentPlayerId}>
      <div className="flex w-full h-full">
        <div className="relative h-full w-full">
          <button
            className="bg-black/20 hover:bg-[#006cb1] p-2 rounded-md absolute bottom-[5%] left-4"
            onClick={openChatModal}
            style={{ zIndex: 1 }}
          >
            Chat
          </button>
          <button
            className="bg-black/20 hover:bg-[#006cb1] p-2 rounded-md absolute bottom-[5%] left-20"
            onClick={openInfoModal}
            style={{ zIndex: 1 }}
          >
            Info
          </button>
          <div className="w-full h-[95%] pt-4">
            <TrickArea />
            <MatchPeripheral />
          </div>
        </div>
      </div>
      <Modal
        isOpen={isChatModalOpen}
        onRequestClose={closeModal}
        contentLabel="Chat Modal"
        style={{ overlay: { zIndex: 10 } }}
        className="bg-white rounded shadow p-6 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 z-20"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <Chatbox />
      </Modal>
      <Modal
        isOpen={isInfoModalOpen}
        onRequestClose={closeModal}
        contentLabel="Info Modal"
        style={{ overlay: { zIndex: 10 } }}
        className="bg-black/5 rounded shadow p-6 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 z-20"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <TrickMonitor />
      </Modal>
    </RestrictedPlayerProvider>
  );
};

const TrickTakingRoomPortrait = () => {
  return (
    <div className="h-full w-full flex flex-col justify-center text-center text-xl">
      Flip your phone man, who plays card game in portrait mode? :/
    </div>
  );
};
export default TrickTakingRoom;
