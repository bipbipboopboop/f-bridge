// GameStateContext.tsx

import React, { ReactNode, createContext, useContext } from "react";
import { toast } from "react-toastify";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { doc, DocumentReference } from "firebase/firestore";
import { firestore } from "../firebase";
import { PublicBiddingPhase, PublicTrickTakingPhase } from "types/GameState";
import Loading from "../components/Loading";
import { useRoom } from "./RoomContext";

interface GameStateContextProps {
  biddingPhase: PublicBiddingPhase | undefined;
  trickTakingPhase: PublicTrickTakingPhase | undefined;
}

const GameStateContext = createContext<GameStateContextProps>({
  biddingPhase: undefined,
  trickTakingPhase: undefined,
});

export const GameStateProvider: React.FC<{ roomID: string; children: ReactNode }> = ({ roomID, children }) => {
  const { room } = useRoom();

  const biddingPhaseRef = doc(
    firestore,
    "gameRooms",
    roomID,
    "publicGameState",
    "biddingPhase"
  ) as DocumentReference<PublicBiddingPhase>;

  const trickTakingPhaseRef = doc(
    firestore,
    "gameRooms",
    roomID,
    "publicGameState",
    "takingTrickPhase"
  ) as DocumentReference<PublicTrickTakingPhase>;

  const [biddingPhase, isBiddingPhaseLoading, biddingPhaseError] = useDocumentData(
    room?.status === "Bidding" ? biddingPhaseRef : null
  );

  const [trickTakingPhase, isTrickTakingPhaseLoading, trickTakingPhaseError] = useDocumentData(
    room?.status === "Taking Trick" ? trickTakingPhaseRef : null
  );

  if (biddingPhaseError || trickTakingPhaseError) {
    toast.error(biddingPhaseError?.message || trickTakingPhaseError?.message);
  }

  if (isBiddingPhaseLoading || isTrickTakingPhaseLoading) {
    return <Loading text="Loading Game State" />;
  }

  return <GameStateContext.Provider value={{ biddingPhase, trickTakingPhase }}>{children}</GameStateContext.Provider>;
};

export const useGameState = () => {
  return useContext(GameStateContext);
};
