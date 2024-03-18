import {
  useCreateUserWithEmailAndPassword,
  useSignInWithEmailAndPassword,
  useSignOut,
} from "react-firebase-hooks/auth";
import { useHttpsCallable } from "react-firebase-hooks/functions";
import { auth, functions } from "../firebase";

import { GameRoom } from "types/Room";
import { Bid } from "types/Bid";
import { Card } from "types/Card";

const useFunctions = () => {
  /**
   * USER AUTHENTICATION
   */
  const [createUserWithEmailAndPassword, _, l0, e0] = useCreateUserWithEmailAndPassword(auth);
  const [signInWithEmailAndPassword, __, l1, e1] = useSignInWithEmailAndPassword(auth);
  const [signOut, l2, e2] = useSignOut(auth);

  /**
   * GAME ROOM API
   */
  const [createGameRoom, l7, e7] = useHttpsCallable<void, GameRoom>(functions, "createGameRoom");
  const [joinGameRoom, l8, e8] = useHttpsCallable<string, void>(functions, "joinGameRoom");
  const [leaveGameRoom, l9, e9] = useHttpsCallable(functions, "leaveGameRoom");

  const [toggleReady, l10, e10] = useHttpsCallable<string, void>(functions, "toggleReady");
  const [startGame, l11, e11] = useHttpsCallable(functions, "startGame");

  /**
   * BID API
   */
  const [placeBid, l3, e3] = useHttpsCallable<Bid, void>(functions, "placeBid");
  const [chooseTeammate, l13, e13] = useHttpsCallable<Card, void>(functions, "chooseTeammate");

  /**
   * TRICK TAKING API
   */
  const [playCard, l14, e14] = useHttpsCallable<Card, void>(functions, "playCard");

  /**
   * CHAT API
   */
  const [sendMessage, l12, e12] = useHttpsCallable<{ roomID: string; message: string }, void>(functions, "sendMessage");

  const isLoading = l0 || l1 || l2 || l3 || l7 || l8 || l9 || l10 || l11 || l12 || l13 || l14;

  const error = e0 || e1 || e2 || e3 || e7 || e8 || e9 || e10 || e11 || e12 || e13 || e14;

  return {
    isLoading,
    error,

    /**
     * UserAuthAPI
     */
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,

    /**
     * GameRoomAPI
     */
    joinGameRoom,
    createGameRoom,
    leaveGameRoom,
    toggleReady,
    startGame,

    /**
     * BidAPI
     */
    placeBid,
    chooseTeammate,

    /**
     * TrickTakingAPI
     */
    playCard,

    /**
     * ChatAPI
     */
    sendMessage,
  };
};

export default useFunctions;
