import { createContext, ReactNode, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDocumentData } from "react-firebase-hooks/firestore";

import { auth, firestore } from "../firebase";
import { signInAnonymously, User } from "firebase/auth";
import { GamePlayer, PlayerProfile } from "types/PlayerProfile";

import Loading from "../components/Loading";
import useFunctions from "../hooks/useFunctions";
import { doc, DocumentReference } from "firebase/firestore";

export const AuthContext = createContext<AuthContextValue>({
  user: null,
  playerProfile: null,
  gamePlayer: null,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  /**
   * HOOKS
   */
  const [firebaseUser, isLoadingFirebaseUser, firebaseUserError] = useAuthState(auth);

  const { createPlayerProfile, isLoading: isCreatingPlayer, error } = useFunctions();

  const playerProfileRef = (firebaseUser && doc(firestore, `playerProfiles/${firebaseUser.uid}`)) || null;

  const [playerProfile, isLoadingPlayerProfile] = useDocumentData<PlayerProfile>(
    playerProfileRef as DocumentReference<PlayerProfile>
  );

  const gamePlayerRef =
    (playerProfile && doc(firestore, `gameRooms/${playerProfile.roomID}/players/${playerProfile.id}`)) || null;

  const [gamePlayer] = useDocumentData<GamePlayer>(gamePlayerRef as DocumentReference<GamePlayer>);

  // console.log({ firebaseUser, playerProfile, gamePlayer, isLoadingFirebaseUser, isLoadingPlayerProfile });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isLoadingFirebaseUser) return;
    if (!firebaseUser) {
      (async () => {
        await signInAnonymously(auth);
      })();
    }
  }, [firebaseUser, isLoadingFirebaseUser]);

  useEffect(() => {
    if (isLoadingPlayerProfile) return;

    if (firebaseUser && !playerProfile) {
      (async () => {
        const newUserInfo = {
          displayName: firebaseUser.displayName,
          email: firebaseUser.email,
          phoneNumber: firebaseUser.phoneNumber,
          photoURL: firebaseUser.photoURL,
          uid: firebaseUser.uid,
          providerId: firebaseUser.providerId,
        };
        await createPlayerProfile(newUserInfo);
      })();
    }
  }, [isLoadingPlayerProfile, playerProfile]);

  useEffect(() => {
    if (!(isLoadingFirebaseUser || isLoadingPlayerProfile || isCreatingPlayer) && playerProfile) {
      setIsLoading(false);
    }
  }, [isCreatingPlayer, isLoadingFirebaseUser, isLoadingPlayerProfile, playerProfile]);

  const authContextValue: AuthContextValue = {
    user: firebaseUser || null,
    playerProfile: playerProfile || null,
    gamePlayer: gamePlayer || null,
  };

  if (firebaseUserError) {
    toast.error(firebaseUserError.message);
  }

  if (error) {
    toast.error(error.message);
  }

  if (isLoading) return <Loading />;

  return <AuthContext.Provider value={authContextValue}>{children}</AuthContext.Provider>;
};

interface AuthContextValue {
  user: User | null;
  playerProfile: PlayerProfile | null;
  gamePlayer: GamePlayer | null;
}

export default AuthContext;
