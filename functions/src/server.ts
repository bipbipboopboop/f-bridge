import * as admin from "firebase-admin";
admin.initializeApp();

import { createAccount } from "./PlayerAPI";

import { createGameRoom, joinGameRoom, leaveGameRoom, startGame, toggleReady } from "./RoomAPI";

import { placeBid, chooseTeammate } from "./BidAPI";
import { playCard } from "./TrickTakingAPI";

// import {sendMessage} from "./ChatAPI";

export {
  /**
   * PLAYER API
   */

  createAccount,

  /**
   * GAME ROOM API
   */
  createGameRoom,
  joinGameRoom,
  leaveGameRoom,
  startGame,
  toggleReady,

  // /**
  //  * BID API
  //  */
  placeBid,
  chooseTeammate,

  // /**
  //  * TRICK TAKING API
  //  */
  playCard,

  /**
   * CHAT API
   */
  // sendMessage,
};
