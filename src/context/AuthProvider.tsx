import { createContext, ReactNode, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAuthState } from "react-firebase-hooks/auth";

import { auth } from "../firebase";
import { signInAnonymously, User } from "firebase/auth";

import Loading from "../components/Loading";

export const AuthContext = createContext<AuthContextValue>({
  user: null,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  /**
   * HOOKS
   */
  const [firebaseUser, isLoadingFirebaseUser, firebaseUserError] = useAuthState(auth);

  // console.log({ firebaseUser, playerProfile, gamePlayer, isLoadingFirebaseUser, isLoadingPlayerProfile });

  useEffect(() => {
    if (!isLoadingFirebaseUser) return;
    if (!firebaseUser) {
      (async () => {
        await signInAnonymously(auth);
      })();
    }
  }, [firebaseUser, isLoadingFirebaseUser]);

  const authContextValue: AuthContextValue = {
    user: firebaseUser || null,
  };

  if (firebaseUserError) {
    toast.error(firebaseUserError.message);
  }

  if (isLoadingFirebaseUser) return <Loading />;

  return <AuthContext.Provider value={authContextValue}>{children}</AuthContext.Provider>;
};

interface AuthContextValue {
  user: User | null;
}

export default AuthContext;
