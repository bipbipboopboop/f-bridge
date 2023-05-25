import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import {produce} from "immer";
import {BiddingPhase, GameRoom} from "types/GameRoom";
import {
  GameRoomPlayer,
  LobbyPlayerProfile,
  PlayerProfile,
} from "types/PlayerProfile";
import {DocumentReference} from "firebase-admin/firestore";
import {Card, Suit} from "types/Card";

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
  async (data: GameRoom, context) => {
    // Check if the user is authenticated
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "User is not authenticated."
      );
    }

    try {
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
          "Player is already in a room."
        );
      }

      const gameRoomData: GameRoom = {
        hostID: context.auth.uid,
        createdAt: new Date(),
        settings: {
          isInviteOnly: data.settings.isInviteOnly || false,
          isSpectatorAllowed: data.settings.isSpectatorAllowed || false,
        },
        invitedID: [],
        status: "Waiting",
        players: [
          {
            ...playerProfileData,
            isReady: false,
            numCardsOnHand: 0,
            position: 0,
          },
        ],
        biddingPhase: null,
        trickTakingPhase: null,
        scores: [],
      };

      // Create a new game room
      const gameRoomRef = await admin
        .firestore()
        .collection("gameRooms")
        .add(gameRoomData);
      const gameRoomId = gameRoomRef.id;

      // Update player's currentGameRoomID and currentRoomID
      await playerProfileRef.update({
        roomID: gameRoomId,
      });

      return gameRoomData;
    } catch (error) {
      throw new functions.https.HttpsError(
        "internal",
        "Failed to create a game room.",
        error
      );
    }
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
 * - failed-precondition: Cannot join this room because the game has either already started or ended.
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

    try {
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
          "Player is already in a room."
        );
      }

      // Get the game room
      const gameRoomRef = admin.firestore().collection("gameRooms").doc(roomID);
      const gameRoomSnapshot = await gameRoomRef.get();
      const gameRoomData = gameRoomSnapshot.data() as GameRoom;

      // Check if the game room exists
      if (!gameRoomSnapshot.exists) {
        throw new functions.https.HttpsError(
          "not-found",
          "Game room does not exist."
        );
      }

      // Check if the game has started
      if (gameRoomData.status !== "Waiting") {
        throw new functions.https.HttpsError(
          "failed-precondition",
          "Cannot join this room because the game has either already started or ended."
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
        numCardsOnHand: 0,
        position,
      };

      await Promise.all([
        gameRoomRef.update({
          players: admin.firestore.FieldValue.arrayUnion(playerData),
        }),
        playerProfileRef.update({
          roomID,
        }),
      ]);

      return;
    } catch (error) {
      throw new functions.https.HttpsError(
        "internal",
        "Failed to join the game room.",
        error
      );
    }
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
 * - failed-precondition: Cannot leave this room because the game has either already started or ended.
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

    // Get the player's profile
    const playerProfileRef = admin
      .firestore()
      .collection("playerProfiles")
      .doc(context.auth.uid) as DocumentReference<PlayerProfile>;

    const playerProfileSnapshot = await playerProfileRef.get();
    const playerProfileData = playerProfileSnapshot!.data() as PlayerProfile;

    // Get the game room
    const gameRoomRef = admin
      .firestore()
      .collection("gameRooms")
      .doc(roomID) as DocumentReference<GameRoom>;
    const gameRoomSnapshot = await gameRoomRef.get();
    const gameRoomData = gameRoomSnapshot.data() as GameRoom;

    // Check if the player is in this room
    if (playerProfileData.roomID !== roomID) {
      throw new functions.https.HttpsError(
        "failed-precondition",
        "Player is not in this room."
      );
    }

    // Check if the room is in waiting status
    if (gameRoomData.status !== "Waiting") {
      throw new functions.https.HttpsError(
        "failed-precondition",
        "Cannot leave this room because the game has either already started or ended."
      );
    }

    // Check if the player is the host
    if (gameRoomData.hostID === context.auth.uid) {
      // Check if the player is the only player
      if (gameRoomData.players.length === 1) {
        // Delete the game room
        await gameRoomRef.delete();
      } else {
        // Pass the host to another player
        const newHostID = gameRoomData.players[1].id;

        // Recalculate position
        const newPlayers = gameRoomData.players
          .filter((player) => player.id !== context!.auth!.uid)
          .map((player, index) => {
            return {
              ...player,
              position: index,
            };
          });

        await gameRoomRef.update({
          hostID: newHostID,
          players: newPlayers,
        });
      }

      // Update the player's profile
      await playerProfileRef.update({
        roomID: "",
      });
    }
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
 * - failed-precondition: Cannot toggle ready status because the game has either already started or ended.
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

    try {
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
      const gameRoomData = gameRoomSnapshot.data() as GameRoom;

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

      // Check if the game room exists
      if (!gameRoomSnapshot.exists) {
        throw new functions.https.HttpsError(
          "not-found",
          "Game room does not exist."
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
    } catch (error) {
      throw new functions.https.HttpsError(
        "internal",
        "Failed to toggle the ready status.",
        error
      );
    }
  }
);

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
    .doc(playerProfileData.roomID) as DocumentReference<GameRoom>;

  const gameRoomSnapshot = await gameRoomRef.get();
  const gameRoomData = gameRoomSnapshot.data() as GameRoom;

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
    bidHistory: [],
    currentBidderIndex: 0,
    numBidsMade: 0,
    highestBid: null,
  };

  // Update the game room
  await gameRoomRef.update({
    status: "Bidding",
    biddingPhase: biddingPhase,
  });

  // Deal cards to players
  const deck = shuffleCards();
  const players: GameRoomPlayer[] = gameRoomData.players.map((player) => {
    const hand = deck.splice(0, 13);
    return {
      ...player,
      cards: hand,
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
 * Shuffles a deck of cards.
 * @returns A shuffled deck of cards
 */
const shuffleCards = () => {
  // Create a deck of cards
  const deck: Card[] = [];
  for (let suit = 0; suit < 4; suit++) {
    for (let rank = 0; rank < 13; rank++) {
      let suitString: Suit;

      switch (suit) {
        case 0:
          suitString = "♣";
          break;
        case 1:
          suitString = "♦";
          break;
        case 2:
          suitString = "♥";
          break;
        default:
          suitString = "♠";
          break;
      }

      deck.push({
        suit: suitString,
        value: rank,
      });
    }
  }

  // Shuffle the deck
  for (let i = 0; i < deck.length; i++) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = deck[i];
    deck[i] = deck[j];
    deck[j] = temp;
  }

  return deck;
};
