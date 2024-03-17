import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, firestore } from "../firebase";
import { User, signInAnonymously } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { PlayerProfile } from "types/PlayerProfile";

interface AuthContextProps {
  user: User | null;
  loading: boolean;
  playerProfile: PlayerProfile | null;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  loading: true,
  playerProfile: null,
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [playerProfile, setPlayerProfile] = useState<PlayerProfile | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        // User is logged in
        setUser(user);
        await subscribeToProfileChanges(user);
      } else {
        // User is not logged in, log in anonymously
        try {
          const userCredential = await signInAnonymously(auth);
          setUser(userCredential.user);
          await subscribeToProfileChanges(userCredential.user);
        } catch (error) {
          console.error("Error signing in anonymously:", error);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const subscribeToProfileChanges = async (user: User) => {
    const profileRef = doc(firestore, "playerProfiles", user.uid);

    const unsubscribe = onSnapshot(profileRef, (snapshot) => {
      if (snapshot.exists()) {
        setPlayerProfile(snapshot.data() as PlayerProfile);
      } else {
        setPlayerProfile(null);
      }
    });

    return () => unsubscribe();
  };

  return <AuthContext.Provider value={{ user, loading, playerProfile }}>{children}</AuthContext.Provider>;
};
