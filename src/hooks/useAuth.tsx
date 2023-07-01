import {useContext} from "react";

import AuthContext from "../context/AuthProvider";

export const useAuth = () => {
  const {playerProfile, gamePlayer, user} = useContext(AuthContext);
  // console.log({playerProfile});
  return {
    user,
    gamePlayer,
    playerProfile,
  };
};
