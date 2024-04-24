import { firestore } from "../firebase";
import { doc, DocumentReference } from "firebase/firestore";
import { RestrictedPlayerData } from "types/GameState";
import { GameRoom } from "types/Room";
export class DatabaseAdapter {
  private static instance: DatabaseAdapter;

  private constructor() {}

  public static getInstance(): DatabaseAdapter {
    if (!DatabaseAdapter.instance) {
      DatabaseAdapter.instance = new DatabaseAdapter();
    }
    return DatabaseAdapter.instance;
  }

  public getPlayerRef(roomId: string, playerId: string): DocumentReference<RestrictedPlayerData> {
    return doc(
      firestore,
      "gameRooms",
      roomId,
      "restrictedPlayerCards",
      playerId
    ) as DocumentReference<RestrictedPlayerData>;
  }

  public getGameRoomRef(roomId: string | undefined) {
    return ((roomId && doc(firestore, "gameRooms", roomId)) as DocumentReference<GameRoom>) || null;
  }
}
