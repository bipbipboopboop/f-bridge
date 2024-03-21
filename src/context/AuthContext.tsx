import React, { createContext, useEffect, useState } from "react";
import { auth, firestore } from "../firebase";
import { User, signInAnonymously } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { RestrictedAccountInfo } from "types/Account";
import Loading from "../components/Loading";

interface AuthContextProps {
  user: User | null;
  loading: boolean;
  playerAccount: RestrictedAccountInfo | null;
}

export const AuthContext = createContext<AuthContextProps>({
  user: null,
  loading: true,
  playerAccount: null,
});

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [playerAccount, setPlayerAccount] = useState<RestrictedAccountInfo | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        // User is logged in
        setUser(user);
        await subscribeToAccountChanges(user);
      } else {
        // User is not logged in, log in anonymously
        try {
          const userCredential = await signInAnonymously(auth);
          setUser(userCredential.user);
          await subscribeToAccountChanges(userCredential.user);
        } catch (error) {
          console.error("Error signing in anonymously:", error);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const subscribeToAccountChanges = async (user: User) => {
    const acountRef = doc(firestore, "accounts", user.uid);

    const unsubscribe = onSnapshot(
      acountRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setPlayerAccount(snapshot.data() as RestrictedAccountInfo);
        } else {
          setPlayerAccount(null);
        }
      },
      (error) => {
        console.error("Error fetching player acount:", error);
      }
    );

    return () => unsubscribe();
  };

  const loading = playerAccount === null;

  if (loading) return <Loading text="Loading" />;

  return <AuthContext.Provider value={{ user, loading, playerAccount }}>{children}</AuthContext.Provider>;
};
