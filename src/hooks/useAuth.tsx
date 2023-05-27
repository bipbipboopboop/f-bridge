import {useContext} from "react";

import AuthContext from "../context/AuthProvider";

export const useAuth = () => {
  const {playerProfile, user} = useContext(AuthContext);
  return {
    user,
    playerProfile,
  };
};
