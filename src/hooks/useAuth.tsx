import { useContext } from "react";

import GamePlayerContext from "../context/GamePlayerProvider";

export const useAuth = () => {
  const { playerProfile, user, gamePlayer } = useContext(GamePlayerContext);

  return {
    user,
    gamePlayer,
    playerProfile,
  };
};
