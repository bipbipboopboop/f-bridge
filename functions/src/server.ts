import * as admin from "firebase-admin";
admin.initializeApp();

import {createPlayerProfile} from "./PlayerAPI";

import {
  createGameRoom,
  joinGameRoom,
  leaveGameRoom,
  startGame,
  toggleReady,
} from "./GameRoomAPI";

import {sendMessage} from "./ChatAPI";

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
   * CHAT API
   */
  sendMessage,
};
