import * as admin from "firebase-admin";
admin.initializeApp();

import {
  retrieveMyPlayerProfile,
  createAnonymousPlayer,
  deleteAnonymousPlayer,
} from "./PlayerAPI";

export {retrieveMyPlayerProfile, createAnonymousPlayer, deleteAnonymousPlayer};
