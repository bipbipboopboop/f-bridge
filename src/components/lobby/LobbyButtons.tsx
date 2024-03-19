import Modal from "react-modal";
import { toast } from "react-toastify";
import Button from "../buttons/button";
import { useFunctions } from "../../hooks/useFunctions";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useState } from "react";

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
      navigate(`/room/${gameRoom.roomID}`);
    }
  };

  const handleJoinRoom = async () => {
    if (roomIdInput.trim() !== "") {
      await joinGameRoom(roomIdInput);
      setIsModalOpen(false);
      setRoomIdInput("");
    }
  };

  return (
    <div className="h-full flex flex-col justify-end">
      {playerAccount?.roomID ? (
        <Button theme="orange" className="mb-4" onClick={() => navigate(`/room/${playerAccount.roomID}`)}>
          Return to Room
        </Button>
      ) : (
        <Button theme="orange" className="mb-4" onClick={handleCreateRoom}>
          Create Room
        </Button>
      )}
      <Button theme="green" onClick={() => setIsModalOpen(true)}>
        Join Room
      </Button>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
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
