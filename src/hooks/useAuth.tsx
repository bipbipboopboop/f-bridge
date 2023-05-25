import { useContext } from "react";

import AuthContext from "../context/AuthProvider";

export const useAuth = () => {
  const { user, isLoggedIn } = useContext(AuthContext);
  return {
    user,
    isLoggedIn,
  };
};
