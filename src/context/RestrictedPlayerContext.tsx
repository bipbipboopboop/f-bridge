// RestrictedPlayerContext.tsx

import React, { ReactNode, createContext, useContext } from "react";
import { toast } from "react-toastify";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { doc, DocumentReference } from "firebase/firestore";
import { firestore } from "../firebase";
import { RestrictedPlayerData } from "types/GameState";
import Loading from "../components/Loading";

interface RestrictedPlayerContextProps {
  restrictedPlayer: RestrictedPlayerData | undefined;
}

const RestrictedPlayerContext = createContext<RestrictedPlayerContextProps>({
  restrictedPlayer: undefined,
});

export const RestrictedPlayerProvider: React.FC<{ roomID: string; playerID: string; children: ReactNode }> = ({
  roomID,
  playerID,
  children,
}) => {
  const playerDataRef = doc(
    firestore,
    "gameRooms",
    roomID,
    "restrictedPlayerCards",
    playerID
  ) as DocumentReference<RestrictedPlayerData>;

  const [restrictedPlayer, isRestrictedPlayerLoading, error] = useDocumentData(playerDataRef);

  if (error) {
    toast.error(error.message);
  }

  if (isRestrictedPlayerLoading) {
    return <Loading text="Loading Player Data" />;
  }

  return <RestrictedPlayerContext.Provider value={{ restrictedPlayer }}>{children}</RestrictedPlayerContext.Provider>;
};

export const useRestrictedPlayerData = () => {
  return useContext(RestrictedPlayerContext);
};
