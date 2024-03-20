// BiddingContext.tsx

import React, { ReactNode, createContext, useContext } from "react";
import { toast } from "react-toastify";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { doc, DocumentReference } from "firebase/firestore";
import { firestore } from "../firebase";
import { PublicBiddingPhase } from "types/GameState";
import Loading from "../components/Loading";

interface BiddingContextProps {
  biddingPhase: PublicBiddingPhase | undefined;
}

const BiddingContext = createContext<BiddingContextProps>({
  biddingPhase: undefined,
});

export const BiddingProvider: React.FC<{ roomID: string; children: ReactNode }> = ({ roomID, children }) => {
  const biddingPhaseRef = doc(
    firestore,
    "gameRooms",
    roomID,
    "publicGameState",
    "biddingPhase"
  ) as DocumentReference<PublicBiddingPhase>;

  const [biddingPhase, isBiddingPhaseLoading, error] = useDocumentData(biddingPhaseRef);

  if (error) {
    toast.error(error.message);
  }

  if (isBiddingPhaseLoading) {
    return <Loading text="Loading Bidding Phase" />;
  }

  return <BiddingContext.Provider value={{ biddingPhase }}>{children}</BiddingContext.Provider>;
};

export const useBiddingPhase = () => {
  return useContext(BiddingContext);
};
