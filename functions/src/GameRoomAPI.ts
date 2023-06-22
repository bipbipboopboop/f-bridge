import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import {DocumentReference, DocumentSnapshot} from "firebase-admin/firestore";

import {produce} from "immer";

import {BiddingPhase, GameState} from "types/GameState";
import {
  GamePlayer,
  LobbyPlayerProfile,
  PlayerProfile,
} from "types/PlayerProfile";

import {shuffleCards} from "./utils/shuffle_cards";
import {nanoid} from "nanoid";

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
export const createGameRoom = functions.https.onCall(
  async (data: void, context) => {
    // Check if the user is authenticated
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "User is not authenticated."
      );
    }

    // Get the player's profile
    const playerProfileRef = admin
      .firestore()
      .collection("playerProfiles")
      .doc(context.auth.uid) as DocumentReference<PlayerProfile>;
    const playerProfileSnapshot = await playerProfileRef.get();
    const playerProfileData = playerProfileSnapshot!.data() as PlayerProfile;

    // Check if the player is already in a room
    if (playerProfileData.roomID) {
      throw new functions.https.HttpsError(
        "already-exists",
        "You can't create a room when you're already in one :/"
      );
    }

    const roomID = nanoid(9);
    const gameRoomData: GameState = {
      roomID,
      hostID: context.auth.uid,
      createdAt: new Date(),
      settings: {
        isInviteOnly: false,
        isSpectatorAllowed: false,
      },
      invitedID: [],
      status: "Waiting",
      players: [
        {
          ...playerProfileData,
          roomID,
          isReady: false,
          isHost: true,
          position: 0,
        },
      ],
      biddingPhase: null,
      trickTakingPhase: null,
    };

    // Create a new game room
    const gameRoomRef = admin
      .firestore()
      .collection("gameRooms")
      .doc(gameRoomData.roomID);
    await gameRoomRef.set(gameRoomData);
    const gameRoomId = gameRoomRef.id;

    // Update player's currentGameRoomID
    // and currentRoomID
    await playerProfileRef.update({
      roomID: gameRoomId,
    });

    return gameRoomData;
  }
);

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
export const joinGameRoom = functions.https.onCall(
  async (roomID: string, context) => {
    // Check if the user is authenticated
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "User is not authenticated."
      );
    }

    // Get the player's profile
    const playerProfileRef = admin
      .firestore()
      .collection("playerProfiles")
      .doc(context.auth.uid) as DocumentReference<PlayerProfile>;
    const playerProfileSnapshot = await playerProfileRef.get();
    const playerProfileData = playerProfileSnapshot.data() as PlayerProfile;

    // Check if the player is already in a room
    if (playerProfileData.roomID) {
      throw new functions.https.HttpsError(
        "already-exists",
        "You're already in a room! Leave it first to join"
      );
    }

    // Get the game room
    const gameRoomRef = admin.firestore().collection("gameRooms").doc(roomID);
    const gameRoomSnapshot = await gameRoomRef.get();
    const gameRoomData = gameRoomSnapshot.data() as GameState;

    // Check if the game room exists
    if (!gameRoomSnapshot.exists) {
      throw new functions.https.HttpsError(
        "not-found",
        "This game no longer exists :("
      );
    }

    // Check if the game has started
    if (gameRoomData.status !== "Waiting") {
      throw new functions.https.HttpsError(
        "failed-precondition",
        "The game has either already started or ended."
      );
    }

    // Check if the room is full
    if (gameRoomData.players.length >= 4) {
      throw new functions.https.HttpsError(
        "failed-precondition",
        "The game room is already full."
      );
    }

    // Check if the game is invite only and player not invited
    if (
      gameRoomData.settings.isInviteOnly &&
      !gameRoomData.invitedID.includes(context.auth.uid)
    ) {
      throw new functions.https.HttpsError(
        "permission-denied",
        "You are not invited to this game room."
      );
    }

    // Add the player to the game room
    const position = gameRoomData.players.length;
    const playerData: LobbyPlayerProfile = {
      ...playerProfileData,
      isReady: false,
      isHost: false,
      position,
    };

    await Promise.all([
      gameRoomRef.update({
        players: gameRoomData.players.concat(playerData),
      }),
      playerProfileRef.update({
        roomID,
      }),
    ]);

    return;
  }
);

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
 * - internal: Failed to update the player's profile.
 * - internal: Failed to delete the game room.
 *
 */
export const leaveGameRoom = functions.https.onCall(
  async (roomID: string, context) => {
    // Check if the user is authenticated
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "User is not authenticated."
      );
    }

    const playerProfileRef = admin
      .firestore()
      .collection("playerProfiles")
      .doc(context.auth.uid) as DocumentReference<PlayerProfile>;
    const gameRoomRef = admin
      .firestore()
      .collection("gameRooms")
      .doc(roomID) as DocumentReference<GameState>;

    const [playerProfileSnapshot, gameRoomSnapshot] = await Promise.all([
      playerProfileRef.get(),
      gameRoomRef.get(),
    ]);

    const playerProfileData = playerProfileSnapshot.data();
    const gameRoomData = gameRoomSnapshot.data();

    // Check if the player exists and is in this room
    if (!playerProfileData || playerProfileData.roomID !== roomID) {
      throw new functions.https.HttpsError(
        "failed-precondition",
        "You can't leave a room you don't belong to"
      );
    }

    // Check if the game room exists
    if (!gameRoomData) {
      throw new functions.https.HttpsError(
        "not-found",
        "This game no longer exists :("
      );
    }

    // Check if the player is the only one in the room
    if (gameRoomData.players.length === 1) {
      await Promise.all([
        gameRoomRef.delete(),
        playerProfileRef.update({
          roomID: null,
        }),
      ]);
      return;
    }

    const isPlayerAHost = gameRoomData.hostID === context.auth.uid;
    const remainingPlayers = gameRoomData.players
      .filter((player) => player.id !== context.auth!.uid)
      .map((player, index) => ({
        ...player,
        position: index,
      }));

    remainingPlayers[0].isHost = true;

    if (isPlayerAHost) {
      await gameRoomRef.update({
        hostID: remainingPlayers[0]?.id,
        players: remainingPlayers,
      });
    } else {
      await gameRoomRef.update({
        players: remainingPlayers,
      });
    }

    await playerProfileRef.update({
      roomID: null,
    });
  }
);

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
export const toggleReady = functions.https.onCall(
  async (roomID: string, context) => {
    // Check if the user is authenticated
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "User is not authenticated."
      );
    }

    // Get the player's profile
    const playerProfileRef = admin
      .firestore()
      .collection("playerProfiles")
      .doc(context.auth.uid);
    const playerProfileSnapshot = await playerProfileRef.get();
    const playerProfileData = playerProfileSnapshot.data() as PlayerProfile;

    // Get the game room
    const gameRoomRef = admin.firestore().collection("gameRooms").doc(roomID);
    const gameRoomSnapshot = await gameRoomRef.get();
    const gameRoomData = gameRoomSnapshot.data() as GameState;

    // Check if the game room exists
    if (!gameRoomData) {
      throw new functions.https.HttpsError(
        "not-found",
        "This game no longer exists :("
      );
    }

    // Check if the player is already in a game
    if (gameRoomData.status !== "Waiting") {
      throw new functions.https.HttpsError(
        "already-exists",
        "Game has already started or ended."
      );
    }

    // Check if the player is in the room
    if (playerProfileData.roomID !== roomID) {
      throw new functions.https.HttpsError(
        "failed-precondition",
        "Player is not in the specified room."
      );
    }

    // Find the player in the game room
    const playerIndex = gameRoomData.players.findIndex(
      (player) => player.id === context.auth!.uid
    );

    // Check if the player is in the game room
    if (playerIndex === -1) {
      throw new functions.https.HttpsError(
        "failed-precondition",
        "Player is not in the specified room."
      );
    }

    // Toggle the player's ready status
    const updatedGameRoom = produce(gameRoomData, (draftGameRoom) => {
      const player = draftGameRoom.players[playerIndex];
      player.isReady = !player.isReady;
    });

    // Update the game room with the updated player list
    await gameRoomRef.update(updatedGameRoom);

    return;
  }
);

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
export const startGame = functions.https.onCall(async (data: void, context) => {
  // Get the player's profile
  const playerProfileRef = admin
    .firestore()
    .collection("playerProfiles")
    .doc(context.auth!.uid) as DocumentReference<PlayerProfile>;
  const playerProfileSnapshot = await playerProfileRef.get();
  const playerProfileData = playerProfileSnapshot.data() as PlayerProfile;

  // Check if the player is in the game
  if (!playerProfileData.roomID) {
    throw new functions.https.HttpsError(
      "failed-precondition",
      "Player is not in a game."
    );
  }

  // Get the game room
  const gameRoomRef = admin
    .firestore()
    .collection("gameRooms")
    .doc(playerProfileData.roomID) as DocumentReference<GameState>;

  const gameRoomSnapshot = await gameRoomRef.get();
  const gameRoomData = gameRoomSnapshot.data() as GameState;

  // Check if the player is the host
  if (gameRoomData.hostID !== context.auth!.uid) {
    throw new functions.https.HttpsError(
      "failed-precondition",
      "Player is not the host."
    );
  }

  // Check if the game status is waiting
  if (gameRoomData.status !== "Waiting") {
    throw new functions.https.HttpsError(
      "failed-precondition",
      "Game has already started."
    );
  }

  // Check if all players are ready
  const readyPlayers = gameRoomData.players.filter(
    (player: LobbyPlayerProfile) => player.isReady
  );
  if (readyPlayers.length != 4) {
    throw new functions.https.HttpsError(
      "failed-precondition",
      "Insufficient ready players to start the game."
    );
  }

  // Initialize bidding phase
  const biddingPhase: BiddingPhase = {
    currentPlayerIndex: 0,
    highestBid: null,
    gameroomPlayersList: gameRoomData.players.map((player) => ({
      id: player.id,
      displayName: player.displayName,
      avatarID: player.avatarID,
      position: player.position,
      numCardsOnHand: 13,
      numTricksWon: 0,
      currentCardOnTable: null,
    })),
    bidHistory: [
      {
        p0: {bid: null, info: {displayName: "Player 1", id: "1"}},
        p1: {bid: null, info: {displayName: "Player 2", id: "2"}},
        p2: {bid: null, info: {displayName: "Player 3", id: "3"}},
        p3: {bid: null, info: {displayName: "Player 4", id: "4"}},
      },
    ],
  };

  // Update the game room
  await gameRoomRef.update({
    status: "Bidding",
    biddingPhase: biddingPhase,
  });

  // Deal cards to players
  const deck = shuffleCards();
  const players: GamePlayer[] = gameRoomData.players.map((player) => {
    const hand = deck.splice(0, 13);
    return {
      id: player.id,
      email: player.email,
      displayName: player.displayName,
      country: player.country,
      avatarID: player.avatarID,
      numOfGamesWon: player.numOfGamesWon,
      numOfGamesPlayed: player.numOfGamesPlayed,
      roomID: player.roomID,

      position: player.position,
      isReady: player.isReady,
      isHost: player.isHost,

      numCardsOnHand: 13,
      numTricksWon: 0,
      cards: hand,

      team: null,
    };
  });

  // Update game room players subcollection
  for (let i = 0; i < players.length; i++) {
    const player = players[i];
    const playerRef = gameRoomRef.collection("players").doc(player.id);
    await playerRef.set(player);
  }
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
export const invitePlayer = functions.https.onCall(
  async (inviteeID: string, context) => {
    // Check if the inviter is authenticated
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "User is not authenticated."
      );
    }

    const inviterID = context.auth.uid;
    // Check if invitee exists
    const inviteeProfileSnapshot = (await admin
      .firestore()
      .collection("playerProfiles")
      .doc(inviteeID)
      .get()) as DocumentSnapshot<PlayerProfile>;

    const inviteeProfile = inviteeProfileSnapshot.data();

    if (!inviteeProfile) {
      throw new functions.https.HttpsError(
        "not-found",
        "Invitee does not exist."
      );
    }

    // TODO: Check if invitee is online

    // Check if invitee is not in a room
    if (inviteeProfile.roomID) {
      throw new functions.https.HttpsError(
        "failed-precondition",
        "Invitee is already in a room."
      );
    }

    // Get inviter's player profile
    const inviterProfileSnapshot = (await admin
      .firestore()
      .collection("playerProfiles")
      .doc(inviterID!)
      .get()) as DocumentSnapshot<PlayerProfile>;

    const inviterProfile = inviterProfileSnapshot.data();

    if (!inviterProfile) {
      throw new functions.https.HttpsError(
        "not-found",
        "Inviter does not exist."
      );
    }

    // Check if inviter is in a room
    if (!inviterProfile.roomID) {
      throw new functions.https.HttpsError(
        "failed-precondition",
        "Inviter is not in a room."
      );
    }

    // Get inviter's game room
    const inviterGameRoomRef = admin
      .firestore()
      .collection("gameRooms")
      .doc(inviterProfile.roomID);
    const gameRoomSnapshot = await inviterGameRoomRef.get();
    const gameRoom = gameRoomSnapshot.data() as GameState;

    // Check if invitee is already invited
    const isAlreadyInvited = gameRoom.invitedID.includes(inviteeID);
    if (isAlreadyInvited) {
      throw new functions.https.HttpsError(
        "already-exists",
        "Invitee is already invited."
      );
    }

    // Check if the room is full
    if (gameRoom.players.length >= 4) {
      throw new functions.https.HttpsError(
        "failed-precondition",
        "The game room is already full."
      );
    }

    // Add invitee to the invitedID array of the game room
    const updatedGameRoom = {
      ...gameRoom,
      invitedID: [...gameRoom.invitedID, inviteeID],
    };

    // Update the game room to include the invitee in the invitedID array
    inviterGameRoomRef.update(updatedGameRoom);

    return {message: "Invite sent."};
  }
);

/**
 *
 */
export const kickPlayer = functions.https.onCall(
  async (targetPlayerID: string, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "User is not authenticated."
      );
    }

    const kickerID: string = context.auth.uid;

    // Check if player is already in a game
    const targetPlayerRef = admin
      .firestore()
      .collection("players")
      .doc(targetPlayerID);

    const targetPlayerSnapshot =
      (await targetPlayerRef.get()) as DocumentSnapshot<PlayerProfile>;
    const targetPlayer = targetPlayerSnapshot.data();

    if (!targetPlayer) {
      throw new functions.https.HttpsError(
        "not-found",
        "Player does not exist."
      );
    }

    if (!targetPlayer.roomID) {
      throw new functions.https.HttpsError(
        "failed-precondition",
        "Player is not in a room."
      );
    }

    const gameRoomRef = admin
      .firestore()
      .collection("rooms")
      .doc(targetPlayer.roomID);
    const gameRoomSnapshot =
      (await gameRoomRef.get()) as DocumentSnapshot<GameState>;

    const gameRoom = gameRoomSnapshot.data();
    if (!gameRoom) {
      throw new functions.https.HttpsError(
        "failed-precondition",
        "Room does not exist."
      );
    }

    if (gameRoom.status !== "Waiting") {
      throw new functions.https.HttpsError(
        "failed-precondition",
        "The game has already started or ended."
      );
    }

    // Check if the player is the host
    if (gameRoom.hostID !== kickerID) {
      throw new functions.https.HttpsError(
        "permission-denied",
        "You are not the host of the game."
      );
    }

    // Check if the target player is in the room
    if (targetPlayer.roomID !== targetPlayer.roomID) {
      throw new functions.https.HttpsError(
        "failed-precondition",
        "Target player is not in the room."
      );
    }

    // Kick the player from the room
    await targetPlayerRef.update({roomID: null});
  }
);
