import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export const useAuth = () => {
  // const { playerAccount, user, gamePlayer } = useContext(GamePlayerContext);
  const { user, playerAccount, loading } = useContext(AuthContext);

  return {
    user,
    playerAccount,
    loading,
  };
};
