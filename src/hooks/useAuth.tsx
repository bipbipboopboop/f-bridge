import { useContext } from "react";

import AuthContext from "../context/AuthProvider";
import ProfileContext from "../context/ProfileProvider";
import { GamePlayer } from "types/PlayerProfile";

export const useAuth = () => {
  const { playerProfile, user } = useContext(ProfileContext);

  const gamePlayer: GamePlayer = {
    avatarID: "blueDino",
    cards: [],
    country: "",
    displayName: "",
    email: "",
    id: "",
    isHost: false,
    isReady: false,
    numCardsOnHand: 0,
    numOfGamesPlayed: 0,
    numOfGamesWon: 0,
    numTricksWon: 0,
    position: 0,
    roomID: "",
    team: "Declarer",
  };

  return {
    user,
    gamePlayer,
    playerProfile,
  };
};
