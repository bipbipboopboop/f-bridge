import { Timestamp } from "firebase/firestore";

export interface Message {
  // Player info
  uid: string;
  playerName: string;
  text: string;
  createdAt: Timestamp;

  type?: "chat" | "system";
  title?: string; // Only for system messages
  content?: unknown; // Only for system messages
}
