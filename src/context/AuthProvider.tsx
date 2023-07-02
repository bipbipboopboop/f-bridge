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

export const AuthProvider = ({ children }: AuthProviderProps) => {
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

  // Signs the user in anonymously if they don't log in and creates a player profile for them.
  // Otherwise, they are already logged in and we can just retrieve their player profile.

  console.log({ firebaseUser, playerProfile, gamePlayer, isLoadingFirebaseUser, isLoadingPlayerProfile });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!(isLoadingFirebaseUser || isLoadingPlayerProfile || isCreatingPlayer) && playerProfile) {
      setIsLoading(false);
    }
  }, [isCreatingPlayer, isLoadingFirebaseUser, isLoadingPlayerProfile, playerProfile]);

  useEffect(() => {
    if (isLoadingFirebaseUser) return;
    if (isLoadingPlayerProfile) return;

    if (!firebaseUser && !playerProfile) {
      console.log("Creating player profile");
      (async () => {
        const userCred = await signInAnonymously(auth);
        const user = userCred.user;
        const newUserInfo = {
          displayName: user.displayName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          photoURL: user.photoURL,
          uid: user.uid,
          providerId: user.providerId,
        };
        await createPlayerProfile(newUserInfo);
      })();
    }

    return () => {};
  }, [playerProfile, firebaseUser, isLoadingFirebaseUser, isLoadingPlayerProfile]);

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

interface AuthProviderProps {
  children: ReactNode;
}

interface AuthContextValue {
  user: User | null;
  playerProfile: PlayerProfile | null;
  gamePlayer: GamePlayer | null;
}

export default AuthContext;
