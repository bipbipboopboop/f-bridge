import { CollectionReference, DocumentReference } from "firebase-admin/firestore";
import { CallableContext, HttpsError } from "firebase-functions/v1/https";
import { BidSuit, Card, CardSuit, GameRoom, GameRoomPlayer, GameState, PlayerPosition } from "./GameType";
import { CARD_VALUES, NUMBER_OF_PLAYERS } from "./constants";

// TODO: split this file to multiple, smaller utlity files.

export function getUidOrThrow(context: CallableContext): string {
  const { auth } = context;
  if (!auth) {
    throw new HttpsError("unauthenticated", "The user is not authenticated");
  }
  return auth.uid;
}

export async function getGameRoomOrThrow(gameRoomRef: DocumentReference<GameRoom>) {
  const gameRoomSnapshot = await gameRoomRef.get();
  const gameRoom = gameRoomSnapshot.data();
  if (!gameRoom) {
    throw new HttpsError("not-found", "The game does not exist");
  }
  return gameRoom;
}

export async function getPlayerInRoomOrThrow(gameRoomPlayerRef: DocumentReference<GameRoomPlayer>) {
  const gameRoomPlayerSnapshot = await gameRoomPlayerRef.get();
  const gameRoomPlayer = gameRoomPlayerSnapshot.data();
  if (!gameRoomPlayer) {
    throw new HttpsError("failed-precondition", "No such player in the room");
  }
  return gameRoomPlayer;
}

export async function getAllPlayersInRoom(gameRoomPlayersCollectionRef: CollectionReference<GameRoomPlayer>) {
  return (await gameRoomPlayersCollectionRef.get()).docs.map(ref => ref.data());
}

export function nextPlayerPosition(position: PlayerPosition): PlayerPosition {
  const nextPosition = (position + 1) % NUMBER_OF_PLAYERS;
  return nextPosition as PlayerPosition;
}

export function isSameCard(first: Card, second: Card) {
  return first.suit === second.suit && first.value === second.value;
}

function suitToRank(suit: CardSuit, leadSuit: CardSuit, trumpSuit: BidSuit) {
  if (suit === trumpSuit) {
    return 2;
  } else if (suit === leadSuit) {
    return 1;
  } else {
    return 0;
  }
}

export function compareCard(first: Card, second: Card, leadSuit: CardSuit, trumpSuit: BidSuit) {
  const firstRank = suitToRank(first.suit, leadSuit, trumpSuit);
  const secondRank = suitToRank(second.suit, leadSuit, trumpSuit);
  const diff = firstRank - secondRank;
  if (diff) {
    return diff;
  }
  const firstValue = CARD_VALUES.indexOf(first.value);
  const secondValue = CARD_VALUES.indexOf(second.value);
  return firstValue - secondValue;
}
