// LobbyContext.tsx
import React, { ReactNode, createContext, useContext } from "react";
import { toast } from "react-toastify";
import { useCollectionData } from "react-firebase-hooks/firestore";

import { collection, query, orderBy, CollectionReference } from "firebase/firestore";

import { firestore } from "../firebase";
import { GameRoom } from "types/Room";

import Loading from "../components/Loading";

interface LobbyContextProps {
  roomList: GameRoom[];
}

const LobbyContext = createContext<LobbyContextProps>({
  roomList: [],
});

export const LobbyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const roomsCollection = collection(firestore, "gameRooms") as CollectionReference<GameRoom>;
  const roomsQuery = query(roomsCollection, orderBy("createdAt", "desc"));
  const [roomList, isRoomListLoading, error] = useCollectionData(roomsQuery);

  if (error) {
    toast.error(error.message);
  }

  if (isRoomListLoading) {
    return <Loading text="Loading Rooms" />;
  }

  return <LobbyContext.Provider value={{ roomList: roomList || [] }}>{children}</LobbyContext.Provider>;
};

export const useRoomList = () => {
  return useContext(LobbyContext);
};
