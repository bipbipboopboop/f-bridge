import { createContext, ReactNode, useContext } from "react";
import { useDocumentData } from "react-firebase-hooks/firestore";

import { firestore } from "../firebase";
import { User } from "firebase/auth";
import { doc, DocumentReference } from "firebase/firestore";

import { GamePlayer, PlayerProfile } from "types/PlayerProfile";

import Loading from "../components/Loading";

import ProfileContext from "./ProfileProvider";

export const GamePlayerContext = createContext<GamePlayerContextValue>({
  user: null,
  playerProfile: null,
  gamePlayer: null,
});

export const GamePlayerProvider = ({ children }: { children: ReactNode }) => {
  /**
   * HOOKS
   */
  const { user: firebaseUser, playerProfile } = useContext(ProfileContext);

  const gamePlayerRef =
    (playerProfile &&
      playerProfile.roomID &&
      doc(firestore, `gameRooms/${playerProfile.roomID}/players/${playerProfile.id}`)) ||
    null;
  const [gamePlayer, isLoadingGamePlayer] = useDocumentData<GamePlayer>(gamePlayerRef as DocumentReference<GamePlayer>);

  if (isLoadingGamePlayer) return <Loading />;

  const gamePlayerContextValue: GamePlayerContextValue = {
    user: firebaseUser || null,
    playerProfile: playerProfile || null,
    gamePlayer: gamePlayer || null,
  };

  return <GamePlayerContext.Provider value={gamePlayerContextValue}>{children}</GamePlayerContext.Provider>;
};

interface GamePlayerContextValue {
  user: User | null;
  playerProfile: PlayerProfile | null;
  gamePlayer: GamePlayer | null;
}

export default GamePlayerContext;
