import * as admin from "firebase-admin";
admin.initializeApp();

import {
  retrieveMyPlayerProfile,
  createAnonymousPlayer,
  createPlayerProfile,
  deleteAnonymousPlayer,
} from "./PlayerAPI";

export {
  retrieveMyPlayerProfile,
  createAnonymousPlayer,
  createPlayerProfile,
  deleteAnonymousPlayer,
};
