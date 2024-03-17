import * as admin from "firebase-admin";
admin.initializeApp();

import { createPlayerProfile } from "./PlayerAPI";

import { createGameRoom, joinGameRoom, leaveGameRoom, startGame, toggleReady } from "./GameRoomAPI";

import { placeBid, chooseTeammate } from "./BidAPI";
import { playCard } from "./TrickTakingAPI";

// import {sendMessage} from "./ChatAPI";

export {
  /**
   * PLAYER API
   */

  createPlayerProfile,

  /**
   * GAME ROOM API
   */
  createGameRoom,
  joinGameRoom,
  leaveGameRoom,
  startGame,
  toggleReady,

  /**
   * BID API
   */
  placeBid,
  chooseTeammate,

  /**
   * TRICK TAKING API
   */
  playCard,

  /**
   * CHAT API
   */
  // sendMessage,
};
