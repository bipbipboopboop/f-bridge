import { useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { useRestrictedPlayerData } from "../context/RestrictedPlayerContext";
import { useRoom } from "../../../context/RoomContext";
import { useScreenSize } from "../../../hooks/useScreenSize";

import Modal from "react-modal";

import MatchAvatar from "./components/MatchAvatar";
import PlayerHand from "./components/PlayerHand";
import OpponentHand from "./components/OpponentHand";
import Chatbox from "../../../components/chat/Chatbox";
import Button from "../../../components/buttons/Button";
import TrickMonitor from "../stages/taking-tricks/components/TrickMonitor";

const MatchPeripheral: React.FC = () => {
  const { isDesktop, isLandscape } = useScreenSize();

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

enum ModalType {
  CHAT = "chat",
  INFO = "info",
}

interface ModalState {
  isOpen: boolean;
  type: ModalType | null;
}

const MatchPeripheralLandscape: React.FC = () => {
  const { playerAccount } = useAuth();
  const { room } = useRoom();
  const { restrictedPlayer } = useRestrictedPlayerData();

  const [modalState, setModalState] = useState<ModalState>({ isOpen: false, type: null });

  const openModal = (type: ModalType) => setModalState({ isOpen: true, type });
  const closeModal = () => setModalState({ isOpen: false, type: null });

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

      <div className="absolute bottom-4 left-4">
        <Button theme="green" size={1} onClick={() => openModal(ModalType.CHAT)} style={{ zIndex: 1 }}>
          Chat
        </Button>
        <Button theme="yellow" size={1} onClick={() => openModal(ModalType.INFO)}>
          Info
        </Button>
      </div>

      <Modal
        isOpen={modalState.isOpen}
        onRequestClose={closeModal}
        contentLabel={`${modalState.type} Modal`}
        style={{ overlay: { zIndex: 1 } }}
        className="bg-teal-300 rounded shadow p-1 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/2 h-[90%] z-50"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        {modalState.type === ModalType.CHAT ? (
          <Chatbox className="h-full z-50" />
        ) : modalState.type === ModalType.INFO ? (
          <TrickMonitor className="h-full" />
        ) : null}
      </Modal>
    </div>
  );
};

export default MatchPeripheral;
