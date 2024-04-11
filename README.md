# F-Bridge Documentation

Floating Bridge[`F-Bridge`] is a variant of the classic card game Contract Bridge, with a slight twist - you need to "guess" who is on your team and who isn't!

Just like contract bridge, it is a team based card game with 2 teams and each team having exactly 2 players and is broken down into 2 phases - the bidding phase and the trick taking phase.

However, unlike traditional Contract Bridge, your teammate is not predetermined, and is only determined by the result of the bidding phase. Hence, players have to deduce who their teammate is during the trick taking phase, adding an element of uncertainty and strategic decision-making to the game.

## <a name="_3dwzl713cbz4"></a>**Rules**

### <a name="_c9owaxn1p2zy"></a>**Bidding Phase**

1. **Objective**: The objective of the `bidding phase` is for players to compete for the `trump suit`, determine the `contract`(how many rounds to win) and who your `teammate` is.
1. **Bidding Sequence**: The bidding starts with the dealer and proceeds counter-clockwise. Each player, in turn, can either make a `higher bid` or pass.
1. **Bidding Options**: During their turn, a player can make a bid by specifying a suit and a numerical value representing the number of tricks they aim to win. The bid consists of two components: the **bidding suit** and the **contract number**.
   1. **Bidding Suit**: The bidding suit can be one of the following options, arranged from lowest to highest: `clubs`, `diamonds`, `hearts`, `spades`, or `no trump(NT)`.
   1. **Contract Number**: The `contract number` + `6` represents the number of tricks the bidder's team has to win.
1. **Legal Bid**: As players take turns bidding, each subsequent bid must be higher than the previous bid. The hierarchy for comparing bids is determined by the bidding suit and the number.
1. **Passing**: If a player does not wish to make a higher bid, they can choose to pass. Once a player passes, they cannot make any more bids during that round.
1. **Contract Determination**: The bidding continues until three consecutive players pass, or until a certain bid threshold is reached. The final bid becomes the contract for the round, representing the number of tricks the declarer and their partner aim to win.

### <a name="_doxmgxu95yh6"></a>**Trick-Taking Phase**

1. **Objective**: The objective of the trick-taking phase is for players to win tricks and fulfill the contract set during the bidding phase.
1. **Declarer**: The player who made the highest bid becomes the declarer. They are responsible for leading the first card of each trick.
1. **Card Playing**: The player to the left of the declarer leads the first card. Other players must follow suit if they have a card of the same suit. If they don't have a card of the led suit, they can play any card. The player who played the highest card of the led suit wins the trick and leads the next one.
1. **Winning Tricks**: The declarer and their chosen partner work together to win the specified number of tricks in the contract. To fulfill the contract, they must win at least the number of tricks they bid during the bidding phase.
1. **Scoring**: Players earn points based on the number of tricks won and whether they successfully fulfill their contract. Scoring can be calculated based on predetermined rules or customized to fit specific gameplay preferences.

## Player APIs

| Name          | Parameter | Return        | Rules                                                                                                                                                            |
| ------------- | --------- | ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| createAccount | User      | PlayerAccount | <p>Automatically creates a player account when a new user is created in Firebase Authentication.</p><p>Throws an error if the player account already exists.</p> |

## Game Room APIs

| Name           | Parameter | Return             | Rules                                                                                                                                                                                                                                                                                                                                                        |
| -------------- | --------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| createGameRoom | void      | {roomID}           | <p>Throw error if:</p><p>1) Player is already in a room.</p><p>Once the room has been created, the player should join the room automatically and immediately, and their playerAccount should be updated.</p>                                                                                                                                                 |
| joinGameRoom   | roomID    | {success: boolean} | <p>Throw error if:</p><p>1) Player is already in a room.</p><p>2) Room is full.</p><p>3) Game has started.</p><p>4) Game has ended.</p><p>5) Game is invite-only but player is not invited.</p>                                                                                                                                                              |
| leaveGameRoom  | roomID    | void               | <p>Throw error if:</p><p>1) Player is not in the specified room.</p><p>If the player is the host and the only player, leave the room and delete it.</p><p>If the player is the host and the room has other players, pass the host to another player and recalculate everybody's position such that they always occupy positions 0, 1, 2, and 3 in order.</p> |
| toggleReady    | roomID    | {success: boolean} | <p>Throw error if:</p><p>1) Player is not in the specified room.</p><p>2) Game has ended.</p><p>Set the player to be ready if they are not ready.</p><p>Set the player to be not ready if they are ready.</p>                                                                                                                                                |
| startGame      | void      | {success: boolean} | <p>Throw error if:</p><p>1) Player is not in a game.</p><p>2) Game has already started or ended.</p><p>3) Player is not the host.</p><p>4) Not all players are ready.</p>                                                                                                                                                                                    |

## Bidding APIs

| Name           | Parameter    | Return | Rules                                                                                                                                                                                                                                                                                                                                                           |
| -------------- | ------------ | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| placeBid       | roomID, Bid  | void   | <p>Throw error if:</p><p>1) Game is not in the bidding phase.</p><p>2) Player is not in the specified room.</p><p>3) It's not the player's turn.</p><p>4) Bid is smaller than the highest bid.</p><p>If there are 4 consecutive passes, the bid resets and the cards are redealt.</p><p>If there are 3 consecutive passes, the largest bidder wins the bid.</p> |
| chooseTeammate | roomID, card | void   | <p>Throw error if:</p><p>1) Game is not in the teammate choosing phase.</p><p>2) Player is not in the specified room.</p><p>3) It's not the player's turn to choose their teammate.</p><p>4) The chosen card belongs to the player.</p><p>5) No player has the chosen card.</p>                                                                                 |

## Trick Taking APIs

| Name     | Parameter    | Return             | Rules                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| -------- | ------------ | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| playCard | roomID, card | {success: boolean} | <p>Throw error if:</p><p>1) Game is not in the trick-taking phase.</p><p>2) Player is not in the specified room.</p><p>3) It's not the player's turn.</p><p>4) The player doesn't have the specified card.</p><p>5) The suit of the card is not the same as the suit of the first card played, and the player has a card of the same suit.</p><p>If the trick is over, find the winner, reset the trick, and make the next lead player the trick winner.</p> |
