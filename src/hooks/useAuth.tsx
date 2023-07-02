import { useContext } from "react";

import AuthContext from "../context/AuthProvider";

export const useAuth = () => {
  const { playerProfile, gamePlayer, user } = useContext(AuthContext);

  return {
    user,
    gamePlayer,
    playerProfile,
  };
};
