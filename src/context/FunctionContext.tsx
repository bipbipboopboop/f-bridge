import React, { createContext } from "react";
import {
  useCreateUserWithEmailAndPassword,
  useSignInWithEmailAndPassword,
  useSignOut,
} from "react-firebase-hooks/auth";
import { useHttpsCallable } from "react-firebase-hooks/functions";
import { HttpsCallableResult } from "firebase/functions";
import { auth, functions } from "../firebase";
import { GameRoom } from "types/Room";
import { Bid } from "types/Bid";
import { Card } from "types/Card";
import Loading from "../components/Loading";
import { toast } from "react-toastify";

interface FunctionContextProps {
  isLoading: boolean;
  error: Error | undefined;
  createUserWithEmailAndPassword: ReturnType<typeof useCreateUserWithEmailAndPassword>[0];
  signInWithEmailAndPassword: ReturnType<typeof useSignInWithEmailAndPassword>[0];
  signOut: ReturnType<typeof useSignOut>[0];
  renameUser: (newName: string) => Promise<HttpsCallableResult<void> | undefined>;
  changeAvatar: (newAvatar: string) => Promise<HttpsCallableResult<void> | undefined>;

  joinGameRoom: (data?: string | undefined) => Promise<HttpsCallableResult<void> | undefined>;
  createGameRoom: () => Promise<HttpsCallableResult<GameRoom> | undefined>;
  leaveGameRoom: (data: string) => Promise<HttpsCallableResult<void> | undefined>;
  toggleReady: (roomId: string) => Promise<HttpsCallableResult<void> | undefined>;
  startGame: () => Promise<HttpsCallableResult<void> | undefined>;
  placeBid: (bid: Bid) => Promise<HttpsCallableResult<void> | undefined>;
  chooseTeammate: (card: Card) => Promise<HttpsCallableResult<void> | undefined>;
  playCard: (card: Card) => Promise<HttpsCallableResult<void> | undefined>;
}

export const FunctionContext = createContext<FunctionContextProps>({
  isLoading: false,
  error: undefined,
  createUserWithEmailAndPassword: () => Promise.resolve(undefined),
  signInWithEmailAndPassword: () => Promise.resolve(undefined),
  signOut: () => Promise.resolve(false),
  renameUser: () => Promise.resolve(undefined),
  changeAvatar: () => Promise.resolve(undefined),
  joinGameRoom: () => Promise.resolve(undefined),
  createGameRoom: () => Promise.resolve(undefined),
  leaveGameRoom: () => Promise.resolve(undefined),
  toggleReady: () => Promise.resolve(undefined),
  startGame: () => Promise.resolve(undefined),
  placeBid: () => Promise.resolve(undefined),
  chooseTeammate: () => Promise.resolve(undefined),
  playCard: () => Promise.resolve(undefined),
});

export const FunctionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [createUserWithEmailAndPassword, , l0, e0] = useCreateUserWithEmailAndPassword(auth);
  const [signInWithEmailAndPassword, , l1, e1] = useSignInWithEmailAndPassword(auth);
  const [signOut, l2, e2] = useSignOut(auth);
  const [renameUser, l3, e3] = useHttpsCallable<string, void>(functions, "renameUser");
  const [changeAvatar, l4, e4] = useHttpsCallable<string, void>(functions, "changeAvatar");
  const [createGameRoom, l5, e5] = useHttpsCallable<void, GameRoom>(functions, "createGameRoom");
  const [joinGameRoom, l6, e6] = useHttpsCallable<string, void>(functions, "joinGameRoom");
  const [leaveGameRoom, l7, e7] = useHttpsCallable<string, void>(functions, "leaveGameRoom");
  const [toggleReady, l8, e8] = useHttpsCallable<string, void>(functions, "toggleReady");
  const [startGame, l9, e9] = useHttpsCallable<void, void>(functions, "startGame");
  const [placeBid, l10, e10] = useHttpsCallable<Bid, void>(functions, "placeBid");
  const [chooseTeammate, l11, e11] = useHttpsCallable<Card, void>(functions, "chooseTeammate");
  const [playCard, l12, e12] = useHttpsCallable<Card, void>(functions, "playCard");

  const isLoading = l0 || l1 || l2 || l3 || l5 || l6 || l7 || l8 || l9 || l10 || l11;
  const error = e0 || e1 || e2 || e3 || e4 || e5 || e6 || e7 || e8 || e9 || e10 || e11 || e12;

  const contextValue: FunctionContextProps = {
    isLoading,
    error,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    renameUser,
    changeAvatar,
    joinGameRoom,
    createGameRoom,
    leaveGameRoom,
    toggleReady,
    startGame,
    placeBid,
    chooseTeammate,
    playCard,
  };

  if (error) {
    toast.error(error.message);
  }

  return <FunctionContext.Provider value={contextValue}>{isLoading ? <Loading /> : children}</FunctionContext.Provider>;
};
