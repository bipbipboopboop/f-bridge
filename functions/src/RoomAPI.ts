import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { DocumentReference } from "firebase-admin/firestore";
import { nanoid } from "nanoid";

import { GameRoom } from "types/Room";
import { PublicPlayer } from "types/Player";
import { RestrictedAccountInfo } from "types/Account";
import { PublicBiddingPhase } from "types/GameState";

import { UnauthenticatedError } from "./error/error";
import { shuffleCards } from "./utils/shuffle_cards";

/**
 * Create a new game room
 * @param data
 * @param context
 * @returns
 * @throws
 * - unauthenticated: User is not authenticated.
 * - already-exists: Player is already in a room.
 * - internal: Failed to create a game room.
 */
export const createGameRoom = functions.region("asia-east2").https.onCall(async (data: void, context) => {
  if (!context.auth) {
    throw UnauthenticatedError;
  }

  const playerAccountRef = admin
    .firestore()
    .collection("accounts")
    .doc(context.auth.uid) as DocumentReference<RestrictedAccountInfo>;
  const playerAccountSnapshot = await playerAccountRef.get();
  const playerAccountData = playerAccountSnapshot.data() as RestrictedAccountInfo;

  if (playerAccountData.roomID) {
    throw new functions.https.HttpsError("already-exists", "You can't create a room when you're already in one.");
  }

  const roomID = nanoid(9);

  const publicPlayerData: PublicPlayer = {
    id: context.auth.uid,
    displayName: playerAccountData.displayName,
    avatarID: playerAccountData.avatarID,
    country: playerAccountData.country,
    numOfGamesPlayed: playerAccountData.numOfGamesPlayed,
    isReady: false,
    isHost: true,
    roomID,
    position: null,
    numCardsOnHand: 0,
    numTricksWon: 0,
    currentCardOnTable: null,
  };

  const gameRoomData: GameRoom = {
    roomID,
    hostID: context.auth.uid,
    createdAt: new Date(),
    invitedPlayerIDs: [],
    settings: {
      isInviteOnly: false,
      isSpectatorAllowed: false,
    },
    status: "Waiting",
    playerCount: 1,
    players: [publicPlayerData],
  };

  const gameRoomRef = admin.firestore().collection("gameRooms").doc(roomID);
  await gameRoomRef.set(gameRoomData);
  await playerAccountRef.update({ roomID });

  return { roomID };
});

/**
 * Join a game room
 * @param roomID
 * @param context
 * @returns
 * @throws
 * - unauthenticated: User is not authenticated.
 * - already-exists: Player is already in a room.
 * - not-found: Game room does not exist.
 * - failed-precondition: The game room is already full.
 * - permission-denied: You are not invited to this game room.
 * - internal: Failed to join the game room.
 */
export const joinGameRoom = functions.region("asia-east2").https.onCall(async (roomID: string, context) => {
  if (!context.auth) {
    throw UnauthenticatedError;
  }

  const playerAccountRef = admin
    .firestore()
    .collection("accounts")
    .doc(context.auth.uid) as DocumentReference<RestrictedAccountInfo>;
  const playerAccountSnapshot = await playerAccountRef.get();
  const playerAccountData = playerAccountSnapshot.data() as RestrictedAccountInfo;

  if (playerAccountData.roomID) {
    throw new functions.https.HttpsError("already-exists", "You're already in a room! Leave it first to join.");
  }

  const gameRoomRef = admin.firestore().collection("gameRooms").doc(roomID) as DocumentReference<GameRoom>;
  const gameRoomSnapshot = await gameRoomRef.get();
  const gameRoomData = gameRoomSnapshot.data() as GameRoom;

  if (!gameRoomSnapshot.exists) {
    throw new functions.https.HttpsError("not-found", "This game no longer exists.");
  }

  if (gameRoomData.status !== "Waiting") {
    throw new functions.https.HttpsError("failed-precondition", "The game has either already started or ended.");
  }

  if (gameRoomData.playerCount >= 4) {
    throw new functions.https.HttpsError("failed-precondition", "The game room is already full.");
  }

  if (gameRoomData.settings.isInviteOnly && !gameRoomData.invitedPlayerIDs.includes(context.auth.uid)) {
    throw new functions.https.HttpsError("permission-denied", "You are not invited to this game room.");
  }

  const publicPlayerData: PublicPlayer = {
    id: context.auth.uid,
    displayName: playerAccountData.displayName,
    avatarID: playerAccountData.avatarID,
    country: playerAccountData.country,
    numOfGamesPlayed: playerAccountData.numOfGamesPlayed,
    isReady: false,
    isHost: false,
    roomID,
    position: null,
    numCardsOnHand: 0,
    numTricksWon: 0,
    currentCardOnTable: null,
  };

  console.log(gameRoomData, gameRoomSnapshot.exists);

  await gameRoomRef.update({
    playerCount: gameRoomData.playerCount + 1,
    players: gameRoomData.players.concat(publicPlayerData),
  });
  await playerAccountRef.update({ roomID });

  return { success: true };
});

/**
 * Leave a game room
 * @param roomID
 * @param context
 * @returns
 * @throws
 * - unauthenticated: User is not authenticated.
 * - not-found: Game room does not exist.
 * - failed-precondition: The game has either already started or ended.
 * - internal: Failed to leave the game room.
 * - internal: Failed to update the player's account.
 * - internal: Failed to delete the game room.
 *
 */
export const leaveGameRoom = functions.region("asia-east2").https.onCall(async (roomID: string, context) => {
  // Check if the user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "User is not authenticated.");
  }

  const playerAccountRef = admin
    .firestore()
    .collection("accounts")
    .doc(context.auth.uid) as DocumentReference<RestrictedAccountInfo>;

  const gameRoomRef = admin.firestore().collection("gameRooms").doc(roomID) as DocumentReference<GameRoom>;

  const [playerAccountSnapshot, gameRoomSnapshot] = await Promise.all([playerAccountRef.get(), gameRoomRef.get()]);

  const playerAccountData = playerAccountSnapshot.data();
  const gameRoomData = gameRoomSnapshot.data();

  // Check if the player exists and is in this room
  if (!playerAccountData || playerAccountData.roomID !== roomID) {
    throw new functions.https.HttpsError("failed-precondition", "You can't leave a room you don't belong to");
  }

  // Check if the game room exists
  if (!gameRoomData) {
    throw new functions.https.HttpsError("not-found", "This game no longer exists");
  }

  // Check if the player is the only one in the room
  if (gameRoomData.playerCount === 1) {
    await Promise.all([
      gameRoomRef.delete(),
      playerAccountRef.update({
        roomID: null,
      }),
    ]);
    return;
  }

  const isPlayerHost = gameRoomData.hostID === context.auth.uid;
  const updatedPlayers = gameRoomData.players.filter((player) => player.id !== context.auth!.uid);

  if (isPlayerHost) {
    const newHostPlayer = updatedPlayers[0];
    await gameRoomRef.update({
      hostID: newHostPlayer.id,
      players: updatedPlayers.map((player, index) => ({
        ...player,
        isHost: player.id === newHostPlayer.id,
        position: index as 0 | 1 | 2 | 3,
        isReady: false, // Set all players to "Not Ready"
      })),
      playerCount: updatedPlayers.length,
    });
  } else {
    await gameRoomRef.update({
      players: updatedPlayers.map((player, index) => ({
        ...player,
        position: index as 0 | 1 | 2 | 3,
        isReady: false, // Set all players to "Not Ready"
      })),
      playerCount: updatedPlayers.length,
    });
  }

  await playerAccountRef.update({
    roomID: null,
  });
});

/**
 * Toggle ready status
 * @param roomID
 * @param context
 * @returns
 * @throws
 * - unauthenticated: User is not authenticated.
 * - not-found: Game room does not exist.
 * - failed-precondition: The game has either already started or ended.
 *
 */
export const toggleReady = functions.region("asia-east2").https.onCall(async (roomID: string, context) => {
  if (!context.auth) {
    throw UnauthenticatedError;
  }

  const playerAccountRef = admin
    .firestore()
    .collection("accounts")
    .doc(context.auth.uid) as DocumentReference<RestrictedAccountInfo>;

  const playerAccountSnapshot = await playerAccountRef.get();
  const playerAccountData = playerAccountSnapshot.data() as RestrictedAccountInfo;

  const gameRoomRef = admin.firestore().collection("gameRooms").doc(roomID);
  const gameRoomSnapshot = await gameRoomRef.get();
  const gameRoomData = gameRoomSnapshot.data() as GameRoom;

  if (!gameRoomSnapshot.exists) {
    throw new functions.https.HttpsError("not-found", "This game no longer exists.");
  }

  if (gameRoomData.status !== "Waiting") {
    throw new functions.https.HttpsError("failed-precondition", "The game has either already started or ended.");
  }

  if (playerAccountData.roomID !== roomID) {
    throw new functions.https.HttpsError("failed-precondition", "Player is not in the specified room.");
  }

  const uid = context.auth.uid;

  const playerIndex = gameRoomData.players.findIndex((player) => player.id === uid);

  if (playerIndex === -1) {
    throw new functions.https.HttpsError("not-found", "Player not found in the game room.");
  }

  const updatedPlayers = [...gameRoomData.players];
  updatedPlayers[playerIndex].isReady = !updatedPlayers[playerIndex].isReady;

  await gameRoomRef.update({ players: updatedPlayers });

  return { success: true };
});

/**
 * Start the game
 * @param data
 * @param context
 * @returns
 * @throws
 * - unauthenticated: User is not authenticated.
 * - failed-precondition: Player is not in a game.
 * - already-exists: Game has already started.
 * - not-found: Game room does not exist.
 * - internal: Failed to start the game.
 * - invalid-argument: Game room is not full.
 * - permission-denied: Player is not the host.
 */
export const startGame = functions.region("asia-east2").https.onCall(async (data: void, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "User is not authenticated.");
  }

  const playerAccountRef = admin
    .firestore()
    .collection("accounts")
    .doc(context.auth.uid) as DocumentReference<RestrictedAccountInfo>;
  const playerAccountSnapshot = await playerAccountRef.get();
  const playerAccountData = playerAccountSnapshot.data() as RestrictedAccountInfo;

  if (!playerAccountData.roomID) {
    throw new functions.https.HttpsError("failed-precondition", "Player is not in a game.");
  }

  const gameRoomRef = admin.firestore().collection("gameRooms").doc(playerAccountData.roomID);
  const gameRoomSnapshot = await gameRoomRef.get();
  const gameRoomData = gameRoomSnapshot.data() as GameRoom;

  if (!gameRoomSnapshot.exists) {
    throw new functions.https.HttpsError("not-found", "Game room does not exist.");
  }

  if (gameRoomData.hostID !== context.auth.uid) {
    throw new functions.https.HttpsError("permission-denied", "Player is not the host.");
  }

  if (gameRoomData.status !== "Waiting") {
    throw new functions.https.HttpsError("already-exists", "Game has already started or ended.");
  }

  const uid = context.auth.uid;
  const otherPlayers = gameRoomData.players.filter((player) => player.id !== uid);
  const allOtherPlayersReady = otherPlayers.every((player) => player.isReady);

  if (!allOtherPlayersReady) {
    throw new functions.https.HttpsError("failed-precondition", "Not all players are ready.");
  }

  const deck = shuffleCards();
  const restrictedPlayersRef = gameRoomRef.collection("restrictedPlayerCards");

  for (const player of gameRoomData.players) {
    const playerCards = deck.splice(0, 13);
    await restrictedPlayersRef.doc(player.id).set({ cards: playerCards });
  }

  const publicBiddingPhaseData: PublicBiddingPhase = {
    currentPlayerIndex: 0,
    numPasses: 0,
    highestBid: null,
    bidHistory: [],
    players: gameRoomData.players,
  };

  await gameRoomRef.collection("publicGameState").doc("biddingPhase").set(publicBiddingPhaseData);
  await gameRoomRef.update({
    status: "Bidding",
  });

  return { success: true };
});

/**
 * Invite a player to a game
 * @param data
 * @param context
 * @returns
 * @throws
 * - unauthenticated: User is not authenticated.
 * - not-found: Invitee does not exist.
 * - failed-precondition: Invitee is already in a room.
 * - internal: Failed to invite the player.
 * - permission-denied: Player is not the host.
 * - already-exists: Invitee is already in the room.
 * - invalid-argument: Invitee is the host.
 * - resource-exhausted: Room is full.
 */
export const invitePlayer = functions.region("asia-east2").https.onCall(async (inviteeID: string, context) => {
  if (!context.auth) {
    throw UnauthenticatedError;
  }

  const hostID = context.auth.uid;
  const hostAccount = await admin.firestore().collection("accounts").doc(hostID).get();
  const hostAccountData = hostAccount.data() as RestrictedAccountInfo;

  if (!hostAccountData.roomID) {
    throw new functions.https.HttpsError("failed-precondition", "Host is not in a game room.");
  }

  const inviteeAccount = await admin.firestore().collection("accounts").doc(inviteeID).get();
  const inviteeAccountData = inviteeAccount.data() as RestrictedAccountInfo;

  if (!inviteeAccount.exists) {
    throw new functions.https.HttpsError("not-found", "Invitee does not exist.");
  }

  if (inviteeAccountData.roomID) {
    throw new functions.https.HttpsError("failed-precondition", "Invitee is already in a room.");
  }

  const gameRoomRef = admin.firestore().collection("gameRooms").doc(hostAccountData.roomID);
  const gameRoomSnapshot = await gameRoomRef.get();
  const gameRoomData = gameRoomSnapshot.data() as GameRoom;

  if (gameRoomData.hostID !== hostID) {
    throw new functions.https.HttpsError("permission-denied", "Player is not the host.");
  }

  if (gameRoomData.invitedPlayerIDs.includes(inviteeID)) {
    throw new functions.https.HttpsError("already-exists", "Invitee is already invited to the room.");
  }

  if (inviteeID === hostID) {
    throw new functions.https.HttpsError("invalid-argument", "Invitee is the host.");
  }

  if (gameRoomData.playerCount >= 4) {
    throw new functions.https.HttpsError("resource-exhausted", "Room is full.");
  }

  await gameRoomRef.update({
    invitedPlayerIDs: admin.firestore.FieldValue.arrayUnion(inviteeID),
  });

  return { success: true };
});

/**
 * Kick a player from a game room
 * @param playerID
 * @param context
 * @returns
 * @throws
 * - unauthenticated: User is not authenticated.
 * - failed-precondition: Host is not in a game room.
 * - permission-denied: Player is not the host.
 * - invalid-argument: Cannot kick the host.
 * - not-found: Player is not in the room.
 * - internal: Failed to kick the player.
 */
export const kickPlayer = functions.region("asia-east2").https.onCall(async (playerID: string, context) => {
  if (!context.auth) {
    throw UnauthenticatedError;
  }

  const hostID = context.auth.uid;
  const hostAccount = await admin.firestore().collection("accounts").doc(hostID).get();
  const hostAccountData = hostAccount.data() as RestrictedAccountInfo;

  if (!hostAccountData.roomID) {
    throw new functions.https.HttpsError("failed-precondition", "Host is not in a game room.");
  }

  const gameRoomRef = admin.firestore().collection("gameRooms").doc(hostAccountData.roomID);
  const gameRoomSnapshot = await gameRoomRef.get();
  const gameRoomData = gameRoomSnapshot.data() as GameRoom;

  if (gameRoomData.hostID !== hostID) {
    throw new functions.https.HttpsError("permission-denied", "Player is not the host.");
  }

  if (playerID === hostID) {
    throw new functions.https.HttpsError("invalid-argument", "Cannot kick the host.");
  }

  const publicPlayersRef = gameRoomRef.collection("publicPlayers");
  const playerDoc = await publicPlayersRef.doc(playerID).get();

  if (!playerDoc.exists) {
    throw new functions.https.HttpsError("not-found", "Player is not in the room.");
  }

  await Promise.all([
    gameRoomRef.update({
      playerCount: admin.firestore.FieldValue.increment(-1),
    }),
    publicPlayersRef.doc(playerID).delete(),
    admin.firestore().collection("accounts").doc(playerID).update({ roomID: null }),
  ]);

  return { success: true };
});
