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
  const [createUserWithEmailAndPassword, , l0, e0] = useCreateUserWithEmailAndPassword(auth);
  const [signInWithEmailAndPassword, , l1, e1] = useSignInWithEmailAndPassword(auth);
  const [signOut, l2, e2] = useSignOut(auth);

  /**
   * GAME ROOM API
   */
  const [createGameRoom, l3, e3] = useHttpsCallable<void, GameRoom>(functions, "createGameRoom");
  const [joinGameRoom, l4, e4] = useHttpsCallable<string, void>(functions, "joinGameRoom");
  const [leaveGameRoom, l5, e5] = useHttpsCallable<void, void>(functions, "leaveGameRoom");
  const [toggleReady, l6, e6] = useHttpsCallable<string, void>(functions, "toggleReady");
  const [startGame, l7, e7] = useHttpsCallable<void, void>(functions, "startGame");

  /**
   * BID API
   */
  const [placeBid, l8, e8] = useHttpsCallable<Bid, void>(functions, "placeBid");
  const [chooseTeammate, l9, e9] = useHttpsCallable<Card, void>(functions, "chooseTeammate");

  /**
   * TRICK TAKING API
   */
  const [playCard, l10, e10] = useHttpsCallable<Card, void>(functions, "playCard");

  const isLoading = l0 || l1 || l2 || l3 || l4 || l5 || l6 || l7 || l8 || l9 || l10;
  const error = e0 || e1 || e2 || e3 || e4 || e5 || e6 || e7 || e8 || e9 || e10;

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
  };
};

export default useFunctions;
