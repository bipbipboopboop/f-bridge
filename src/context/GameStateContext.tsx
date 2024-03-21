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
  gameState: PublicBiddingPhase | PublicTrickTakingPhase | undefined;
}

const GameStateContext = createContext<GameStateContextProps>({
  gameState: undefined,
});

export const GameStateProvider: React.FC<{ roomID: string; children: ReactNode }> = ({ roomID, children }) => {
  const { room } = useRoom();

  const getGameStateRef = () => {
    if (room?.status === "Bidding") {
      return doc(
        firestore,
        "gameRooms",
        roomID,
        "publicGameState",
        "biddingPhase"
      ) as DocumentReference<PublicBiddingPhase>;
    } else if (room?.status === "Taking Trick") {
      return doc(
        firestore,
        "gameRooms",
        roomID,
        "publicGameState",
        "takingTrickPhase"
      ) as DocumentReference<PublicTrickTakingPhase>;
    }
    return null;
  };

  const gameStateRef = getGameStateRef();

  const [gameState, isGameStateLoading, gameStateError] = useDocumentData<PublicBiddingPhase | PublicTrickTakingPhase>(
    room?.status === "Bidding"
      ? (gameStateRef as DocumentReference<PublicBiddingPhase>)
      : room?.status === "Taking Trick"
      ? (gameStateRef as DocumentReference<PublicTrickTakingPhase>)
      : null
  );

  if (gameStateError) {
    toast.error(gameStateError.message);
  }

  if (isGameStateLoading) {
    return <Loading text="Loading Game State" />;
  }

  return <GameStateContext.Provider value={{ gameState }}>{children}</GameStateContext.Provider>;
};

export const useGameState = () => {
  return useContext(GameStateContext);
};
