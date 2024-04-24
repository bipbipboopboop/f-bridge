// BiddingContext.tsx
import React, { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Navigate, useParams } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { useFunctions } from "../hooks/useFunctions";

import { Announcement } from "types/Annoucement";
import { GameRoom } from "types/Room";

import { DatabaseAdapter } from "../utils/database-adapter";

import AnnouncementModal from "../components/AnnouncementModal";
import Loading from "../components/Loading";
interface RoomContextProps {
  room: GameRoom | undefined;
}

const RoomContext = createContext<RoomContextProps>({
  room: undefined,
});

export const RoomProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { roomID } = useParams<{ roomID: string }>();
  const { playerAccount } = useAuth();
  const { joinGameRoom } = useFunctions();

  const gameRoomRef = DatabaseAdapter.getInstance().getGameRoomRef(roomID);

  const [room, isRoomLoading, error] = useDocumentData(gameRoomRef);
  const [showModal, setShowModal] = useState(false);
  const [latestAnnouncement, setLatestAnnouncement] = useState<Announcement | null>(null);

  useEffect(() => {
    if (room && room.announcements.length > 0) {
      const lastAnnouncement = room.announcements[room.announcements.length - 1];
      const lastDisplayedAnnouncementId = localStorage.getItem("lastDisplayedAnnouncementId");

      if (lastAnnouncement.id !== lastDisplayedAnnouncementId) {
        setLatestAnnouncement(lastAnnouncement);
        setShowModal(true);
        localStorage.setItem("lastDisplayedAnnouncementId", lastAnnouncement.id);
      }
    }
  }, [room]);

  const closeModal = () => {
    setShowModal(false);
    setLatestAnnouncement(null);
  };

  if (error) {
    toast.error(error.message);
  }

  if (isRoomLoading) {
    return <Loading text="Loading Room Data" />;
  }

  if (!room) {
    toast.error("Your room is not found");
    return <Navigate to="/lobby" />;
  }

  const isPlayerInRoom = room.players.some((player) => player.id === playerAccount?.id);
  if (!isPlayerInRoom) {
    const success = joinGameRoom(roomID);
    if (!success) {
      return <Navigate to="/lobby" />;
    }
  }

  return (
    <RoomContext.Provider value={{ room }}>
      {children}
      {showModal && latestAnnouncement && <AnnouncementModal announcement={latestAnnouncement} onClose={closeModal} />}
    </RoomContext.Provider>
  );
};

export const useRoom = () => {
  return useContext(RoomContext);
};
