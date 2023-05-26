import {
  useCreateUserWithEmailAndPassword,
  useSignInWithEmailAndPassword,
  useSignOut,
} from "react-firebase-hooks/auth";
import {useHttpsCallable} from "react-firebase-hooks/functions";
import {auth, functions} from "../firebase";
import {PlayerProfile} from "types/PlayerProfile";

const useFunctions = () => {
  const [createUserWithEmailAndPassword, _, l0] =
    useCreateUserWithEmailAndPassword(auth);

  const [signInWithEmailAndPassword, l1] = useSignInWithEmailAndPassword(auth);

  const [signOut, l2, error] = useSignOut(auth);

  const [retrieveMyPlayerProfile, l3] = useHttpsCallable(
    functions,
    "retrieveMyPlayerProfile"
  );
  const [createAnonymousPlayer, l4] = useHttpsCallable<void, PlayerProfile>(
    functions,
    "createAnonymousPlayer"
  );
  useHttpsCallable(functions, "deleteAnonymousPlayer");
  useHttpsCallable(functions, "deleteAnonymousPlayer");

  useHttpsCallable(functions, "createGameRoom");
  useHttpsCallable(functions, "joinGameRoom");
  useHttpsCallable(functions, "leaveGameRoom");

  useHttpsCallable(functions, "toggleReady");
  useHttpsCallable(functions, "startGame");

  const isLoading = l0 || l1 || l2 || l3 || l4;

  return {
    isLoading,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,

    /**
     * PlayerAPI
     */
    retrieveMyPlayerProfile,
    createAnonymousPlayer,
  };
};

export default useFunctions;
