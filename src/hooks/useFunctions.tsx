import {
  useCreateUserWithEmailAndPassword,
  useSignInWithEmailAndPassword,
  useSignOut,
} from "react-firebase-hooks/auth";
import {useHttpsCallable} from "react-firebase-hooks/functions";
import {auth, functions} from "../firebase";
import {PlayerProfile} from "types/PlayerProfile";
import {User, UserInfo} from "firebase/auth";
import {GameState} from "types/GameState";

const useFunctions = () => {
  /**
   * USER AUTHENTICATION
   */
  const [createUserWithEmailAndPassword, _, l0, e0] =
    useCreateUserWithEmailAndPassword(auth);
  const [signInWithEmailAndPassword, __, l1, e1] =
    useSignInWithEmailAndPassword(auth);
  const [signOut, l2, e2] = useSignOut(auth);

  const [retrieveMyPlayerProfile, l3, e3] = useHttpsCallable<
    void,
    PlayerProfile
  >(functions, "retrieveMyPlayerProfile");
  const [createAnonymousPlayer, l4, e4] = useHttpsCallable<void, PlayerProfile>(
    functions,
    "createAnonymousPlayer"
  );
  const [createPlayerProfile, l11, e11] = useHttpsCallable<
    UserInfo,
    PlayerProfile
  >(functions, "createPlayerProfile");
  const [deleteAnonymousPlayer, l5, e5] = useHttpsCallable(
    functions,
    "deleteAnonymousPlayer"
  );

  /**
   * GAME ROOM API
   */
  const [createGameRoom, l6, e6] = useHttpsCallable<void, GameState>(
    functions,
    "createGameRoom"
  );
  const [joinGameRoom, l7, e7] = useHttpsCallable(functions, "joinGameRoom");
  const [leaveGameRoom, l8, e8] = useHttpsCallable(functions, "leaveGameRoom");

  const [toggleReady, l9, e9] = useHttpsCallable(functions, "toggleReady");
  const [startGame, l10, e10] = useHttpsCallable(functions, "startGame");

  const isLoading =
    l0 || l1 || l2 || l3 || l4 || l5 || l6 || l7 || l8 || l9 || l10 || l11;

  const error =
    e0 || e1 || e2 || e3 || e4 || e5 || e6 || e7 || e8 || e9 || e10 || e11;

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
     * PlayerAPI
     */
    retrieveMyPlayerProfile,
    createAnonymousPlayer,
    createPlayerProfile,
    deleteAnonymousPlayer,

    /**
     * GameRoomAPI
     */
    joinGameRoom,
    createGameRoom,
    leaveGameRoom,
    toggleReady,
    startGame,
  };
};

export default useFunctions;
