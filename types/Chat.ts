import { Timestamp } from "firebase/firestore";

export interface Message {
  // Player info
  uid: string;
  playerName: string;

  text: string;
  createdAt: Timestamp;
}
