// TakingTrickContext.tsx

import React, { ReactNode, createContext, useContext } from "react";
import { toast } from "react-toastify";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { doc, DocumentReference } from "firebase/firestore";
import { firestore } from "../firebase";
import { PublicTrickTakingPhase } from "types/GameState";
import Loading from "../components/Loading";

interface TakingTrickContextProps {
  takingTrickPhase: PublicTrickTakingPhase | undefined;
}

const TakingTrickContext = createContext<TakingTrickContextProps>({
  takingTrickPhase: undefined,
});

export const BiddingProvider: React.FC<{ roomID: string; children: ReactNode }> = ({ roomID, children }) => {
  const takingTrickPhaseRef = doc(
    firestore,
    "gameRooms",
    roomID,
    "publicGameState",
    "trickTakingPhase"
  ) as DocumentReference<PublicTrickTakingPhase>;

  const [takingTrickPhase, isTakingTrickPhaseLoading, error] = useDocumentData(takingTrickPhaseRef);

  if (error) {
    toast.error(error.message);
  }

  if (isTakingTrickPhaseLoading) {
    return <Loading text="Loading Taking Trick Phase" />;
  }

  return <TakingTrickContext.Provider value={{ takingTrickPhase }}>{children}</TakingTrickContext.Provider>;
};

export const useTakingTrickPhase = () => {
  return useContext(TakingTrickContext);
};
