import { Card } from "./Card";

export interface Announcement {
  id: string;
  title: string;
  createdAt: Date;
  gameStatus: "Waiting" | "Bidding" | "Choosing Teammate" | "Taking Trick" | "Ended";
  teammateChoosingAnnoucement: TeammateChoosingAnnouncement | null;
  trickTakingAnnouncement: TrickTakingAnnouncement | null;
  endedAnnouncement: EndedAnnouncement | null;
}

interface TeammateChoosingAnnouncement {
  bidWinnerID: string;
  bidWinnerName: string;
  chosenCard: Card;
  content: string;
}

interface TrickTakingAnnouncement {
  trickWinnerID: string;
  trickWinnerName: string;
  content: string;
}

interface EndedAnnouncement {
  winningTeamName: "Defender" | "Declarer";
  content: string;
}
