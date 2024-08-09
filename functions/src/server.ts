import * as admin from "firebase-admin";
admin.initializeApp();

import { createAccount, renameUser, changeAvatar } from "./PlayerAPI";

import { createGameRoom, joinGameRoom, leaveGameRoom, startGame, toggleReady, kickPlayer } from "./RoomAPI";

import { placeBid, chooseTeammate } from "./BidAPI";
import { playCard } from "./TrickTakingAPI";

// import {sendMessage} from "./ChatAPI";

export {
  /**
   * PLAYER API
   */

  createAccount,
  renameUser,
  changeAvatar,

  /**
   * GAME ROOM API
   */
  createGameRoom,
  joinGameRoom,
  leaveGameRoom,
  startGame,
  toggleReady,
  kickPlayer,

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
