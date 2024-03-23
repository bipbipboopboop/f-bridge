import React, { useState } from "react";
import Modal from "react-modal";
import Chatbox from "../../chat/Chatbox";
import Auction from "./Auction";
import { RestrictedPlayerProvider } from "../../../context/RestrictedPlayerContext";
import { useAuth } from "../../../hooks/useAuth";
import MatchPeripheral from "../MatchPeripheral";
import { useMediaQuery } from "react-responsive";

const BiddingRoom: React.FC = () => {
  const { playerAccount } = useAuth();
  const currentPlayerId = playerAccount?.id;
  const roomId = playerAccount?.roomID;
  const isDesktop = useMediaQuery({ minWidth: 768 });
  const isLandscape = useMediaQuery({ orientation: "landscape" }) && !isDesktop;

  if (!roomId || !currentPlayerId) {
    return null;
  }

  return (
    <RestrictedPlayerProvider roomID={roomId} playerID={currentPlayerId}>
      {isDesktop && <BiddingRoomWeb />}
      {isLandscape && <BiddingRoomLandscape />}
      {!isDesktop && !isLandscape && <BiddingRoomPortrait />}
    </RestrictedPlayerProvider>
  );
};

const BiddingRoomWeb: React.FC = () => {
  return (
    <div className="flex w-full h-full">
      <div className="relative h-full w-3/4 pt-4">
        <Auction />
        <MatchPeripheral />
      </div>
      <div className="h-full w-1/4 p-4">
        <Chatbox />
      </div>
    </div>
  );
};

const BiddingRoomLandscape: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="flex w-full h-full">
      <div className="relative h-full w-full">
        <button
          className="bg-black/20 hover:bg-[#006cb1] p-2 rounded-md absolute bottom-[5%] left-4"
          onClick={openModal}
          style={{ zIndex: 1 }}
        >
          Chat
        </button>
        <div className="w-full h-[95%] pt-4">
          <Auction />
          <MatchPeripheral />
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
    </div>
  );
};

const BiddingRoomPortrait: React.FC = () => {
  return (
    <div className="h-full w-full flex flex-col justify-center text-center text-xl">
      Flip your phone man, who plays card game in portrait mode? :/
    </div>
  );
};

export default BiddingRoom;
