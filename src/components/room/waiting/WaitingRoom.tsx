import { GameRoom } from "types/Room";
import WaitingPanel from "./WaitingPanel";
import Chatbox from "../../chat/Chatbox";
import Navbar from "../../navbar";
import Modal from "react-modal";
import { useState } from "react";
import { useMediaQuery } from "react-responsive";
import PlayerBox from "./PlayerBox";
import Button from "../../buttons/button";
import PlayerPanel from "./PlayerPanel";
import RoomSettings from "./RoomSettings";

const WaitingRoom = ({ room }: { room: GameRoom }) => {
  const isDesktop = useMediaQuery({ minWidth: 768 }); // Adjust the breakpoint as needed
  const isLandscape = useMediaQuery({ orientation: "landscape" });

  if (isDesktop) return <WaitingRoomWeb room={room} />;
  if (isLandscape) return <WaitingRoomLandscape room={room} />;
  return <WaitingRoomPortrait room={room} />;
};

const WaitingRoomWeb = ({ room }: { room: GameRoom }) => {
  return (
    <div className="h-full w-full">
      <div className="h-[5%] w-full">
        <Navbar />
      </div>
      <div className="flex w-full h-[95%] px-[2%]">
        <div className="h-full w-2/3 p-4">
          <WaitingPanel room={room} />
        </div>
        <div className="h-full w-1/3 p-4">
          <Chatbox />
        </div>
      </div>
    </div>
  );
};

const WaitingRoomLandscape = ({ room }: { room: GameRoom }) => {
  return (
    <div className="h-full w-full">
      <div className="h-[5%] w-full">
        <Navbar />
      </div>
      <div className="flex w-full h-[95%] px-[2%]">
        <div className="h-full w-2/3 p-4">
          <WaitingPanel room={room} />
        </div>
        <div className="h-full w-1/3 p-4">
          <Chatbox />
        </div>
      </div>
    </div>
  );
};
const WaitingRoomPortrait = ({ room }: { room: GameRoom }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="h-full w-full flex flex-col relative">
      <div className="h-[5%] w-full flex justify-end items-center">
        <Navbar />
        <button className="bg-black/20 hover:bg-[#006cb1] p-2 rounded-md mr-4" onClick={openModal}>
          Chat
        </button>
      </div>
      <div className="h-full w-full flex flex-col justify-center items-center">
        <div className="w-[90%] h-3/5">
          <PlayerPanel room={room} />
        </div>
        <div className="h-2/5 w-[70%]">
          <RoomSettings room={room} />
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
    </div>
  );
};

export default WaitingRoom;
