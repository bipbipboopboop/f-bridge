import { Timestamp } from "firebase/firestore";

export interface Message {
  // Player info
  uid: string;
  playerName: string;
  text: string;
  createdAt: Timestamp | number;

  type: "chat" | "system" | "teammate chosen" | "playing trick";
  title?: string; // Only for system messages
  content?: unknown; // Only for system messages
}
