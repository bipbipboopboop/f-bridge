import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, firestore } from "../firebase";

import { User, signInAnonymously } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

import { PlayerProfile } from "types/PlayerProfile";

interface AuthContextProps {
  user: User | null;
  loading: boolean;
  profile: PlayerProfile | null;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  loading: true,
  profile: null,
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [profile, setProfile] = useState<PlayerProfile | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        // User is logged in
        setUser(user);
        await fetchOrCreateProfile(user);
      } else {
        // User is not logged in, log in anonymously
        try {
          const userCredential = await signInAnonymously(auth);
          setUser(userCredential.user);
          await fetchOrCreateProfile(userCredential.user);
        } catch (error) {
          console.error("Error signing in anonymously:", error);
        }
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const fetchOrCreateProfile = async (user: User) => {
    const profileRef = doc(firestore, "playerProfiles", user.uid);
    const profileDoc = await getDoc(profileRef);

    if (profileDoc.exists()) {
      setProfile(profileDoc.data() as PlayerProfile);
    } else {
      setProfile(null);
    }
  };

  return <AuthContext.Provider value={{ user, loading, profile }}>{children}</AuthContext.Provider>;
};
