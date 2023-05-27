import * as admin from "firebase-admin";
admin.initializeApp();

import {retrieveMyPlayerProfile, createPlayerProfile} from "./PlayerAPI";

import {
  createGameRoom,
  joinGameRoom,
  leaveGameRoom,
  startGame,
  toggleReady,
} from "./GameRoomAPI";

export {
  retrieveMyPlayerProfile,
  createPlayerProfile,

  /**
   * GAME ROOM API
   */
  createGameRoom,
  joinGameRoom,
  leaveGameRoom,
  startGame,
  toggleReady,
};
