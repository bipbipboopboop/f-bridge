import { useState } from "react";
import { toast } from "react-toastify";
import Modal from "react-modal";

import { useNavigate } from "react-router-dom";
import { useFunctions } from "../../hooks/useFunctions";
import { useAuth } from "../../hooks/useAuth";

import Button from "../buttons/button";

const LobbyButtons = () => {
  const { createGameRoom, joinGameRoom } = useFunctions();
  const navigate = useNavigate();
  const { playerAccount } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roomIdInput, setRoomIdInput] = useState("");

  const handleCreateRoom = async () => {
    const gameRoom = (await createGameRoom())?.data;
    if (gameRoom) {
      toast.success("Room created!");
      navigate(`/rooms/${gameRoom.roomID}`);
    }
  };

  const handleJoinRoom = async () => {
    if (roomIdInput.trim() !== "") {
      const success = await joinGameRoom(roomIdInput);
      if (success) {
        toast.success("Successfully joined room");
        navigate(`/rooms/${roomIdInput}`);
      }
      if (!success) {
        toast.error("Opps, your room dissapeared :(");
      }
      closeModal();
      return;
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setRoomIdInput("");
  };

  const renderRoomButton = () => {
    if (playerAccount?.roomID) {
      return (
        <Button theme="orange" className="mb-4" onClick={() => navigate(`/rooms/${playerAccount.roomID}`)}>
          Return to Room
        </Button>
      );
    } else {
      return (
        <Button theme="orange" className="mb-4" onClick={handleCreateRoom}>
          Create Room
        </Button>
      );
    }
  };

  return (
    <div className="h-full flex flex-col justify-end">
      {renderRoomButton()}
      <Button theme="green" onClick={openModal}>
        Join Room
      </Button>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Join Room Modal"
        className="bg-white rounded shadow p-6 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <h2 className="text-2xl mb-4">Join Room</h2>
        <input
          type="text"
          placeholder="Enter Room ID"
          value={roomIdInput}
          onChange={(e) => setRoomIdInput(e.target.value)}
          className="border border-gray-300 rounded px-4 py-2 mb-4 w-full"
        />
        <div className="flex justify-end">
          <Button theme="green" size={1} onClick={handleJoinRoom}>
            Join
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default LobbyButtons;
