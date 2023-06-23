# F-Bridge

Floating Bridge[`F-Bridge`] is a variant of the classic card game Contract Bridge, with a Singaporean twist. F-Bridge is a team based card game with 2 teams and each team having exactly 2 players and is broken down into 2 phases- the bidding phase and the trick taking phase.

In F-Bridge, four players compete against each other in bidding for the trump suit. Unlike traditional Contract Bridge, teammates are not predefined, and are only determined by the result of the bidding phase. Hence, players have to deduce who their teammate is during the trick taking phase, adding an element of uncertainty and strategic decision-making to the game.

Here is a video explaining the rules in detail: https://www.youtube.com/watch?v=NUTi2r4u2-g

## <a name="_3dwzl713cbz4"></a>**Rules**

### <a name="_c9owaxn1p2zy"></a>**Bidding Phase**

1. **Objective**: The objective of the bidding phase is for players to compete for the trump suit and determine the contract.
1. **Bidding Order**: The bidding starts with the player to the dealer's left and proceeds clockwise. Each player, in turn, can make a bid or pass.
1. **Bidding Options**: During their turn, a player can make a bid by specifying a suit and a numerical value representing the number of tricks they aim to win. The bid consists of two components: the **bidding suit** and the **number**.
   1. **Bidding Suit**: The bidding suit can be one of the following options, arranged from lowest to highest: clubs, diamonds, hearts, spades, or no trump.
   1. **Number**: The number represents the minimum number of tricks the player intends to win with the specified bidding suit.
1. **Bidding Hierarchy**: As players take turns bidding, each subsequent bid must be higher than the previous bid. The hierarchy for comparing bids is determined by the bidding suit and the number. No trump bids are typically considered higher than bids with a specific suit.
1. **Passing**: If a player does not wish to make a higher bid, they can choose to pass. Once a player passes, they cannot make any more bids during that round.
1. **Contract Determination**: The bidding continues until three consecutive players pass, or until a certain bid threshold is reached. The final bid becomes the contract for the round, representing the number of tricks the declarer and their partner aim to win.

### <a name="_doxmgxu95yh6"></a>**Trick-Taking Phase**

1. **Objective**: The objective of the trick-taking phase is for players to win tricks and fulfill the contract set during the bidding phase.
1. **Declarer**: The player who made the highest bid becomes the declarer. They are responsible for leading the first card of each trick.
1. **Card Playing**: The player to the left of the declarer leads the first card. Other players must follow suit if they have a card of the same suit. If they don't have a card of the led suit, they can play any card. The player who played the highest card of the led suit wins the trick and leads the next one.
1. **Winning Tricks**: The declarer and their chosen partner work together to win the specified number of tricks in the contract. To fulfill the contract, they must win at least the number of tricks they bid during the bidding phase.
1. **Scoring**: Players earn points based on the number of tricks won and whether they successfully fulfill their contract. Scoring can be calculated based on predetermined rules or customized to fit specific gameplay preferences.

## APIs

### <a name="_fr9krkawyfc9"></a>**Player APIs**

| Name                | Parameter | Return        | Rules                                                                                                         |
| :------------------ | :-------- | :------------ | :------------------------------------------------------------------------------------------------------------ |
| createPlayerProfile | User      | PlayerProfile | <p>Throw error if</p><p>1) PlayerProfile already exists</p><p>2) context\.auth\.id not equals to user\.id</p> |

### <a name="_k6i23y6tyf96"></a>**Game Room APIs**

| **Name**       | **Parameter**            | **Return** | **Rules**                                                                                                                                                                                                                                                                                                                                                          |
| :------------- | :----------------------- | :--------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| createGameRoom | GameRoom                 | GameRoom   | <p>Throw error if</p><p>1) player already in game</p><p>2) player already in room</p><p></p><p>else:</p><p>once the room has been created, the player should join the room automatically and immediately and their playerProfile should be updated</p>                                                                                                             |
| joinGameRoom   | roomID                   | void       | <p>Throw error if</p><p>1) player already in game</p><p>2) player already in room</p><p>3) room is full</p><p>4) game has started</p><p>5) game has ended</p><p>6) game is invite only but player not in invite</p>                                                                                                                                                |
| leaveGameRoom  | {roomID}                 | void       | <p>Throw error if</p><p>1) player already in game</p><p>2) player not in this room</p><p></p><p>else:</p><p>if player is host and is the only player, leave the room and delete it</p><p>If player is host and room has other player, pass the host to another player and recalculate everybody’s position such that the always occupy 0, then 1 then 2 then 3</p> |
| toggleReady    | {roomID}                 | void       | <p>Throw error if</p><p>1) player already in game</p><p>2) player not in room</p><p>3) game ended</p><p></p><p>else:</p><p>set player to be ready if they are not ready </p><p></p><p>set player to be not ready if they are ready</p>                                                                                                                             |
| startGame      | {roomID}                 | void       | <p>Throw error if</p><p>1) player already in game</p><p>2) player not in room</p><p>3) game started</p><p>4) game ended</p><p>5) player not host</p><p>6) insufficient ready players</p>                                                                                                                                                                           |
| invitePlayer   | {roomID, targetPlayerID} | void       | <p>Throw error if</p><p>1) invitee doesn’t exist</p><p>2) invitee not online</p><p>3) invitee in game</p><p>4) invitee already invited</p>                                                                                                                                                                                                                         |
| kickPlayer     | {roomID, targetPlayerID} | void       | <p>Throw error if</p><p>1) player already in game</p><p>2) player not in room</p><p>3) game started</p><p>4) game ended</p><p>5) player not host</p><p>6) target player not in room</p><p></p><p>player array position should be updated to start from 0 to n, where n is the number of remaining players</p>                                                      |

### <a name="_tk42z7cn9mz5"></a>**Chat API**

| **Name**    | **Parameter**     | **Return** | **Rules**                                                                                                                               |
| :---------- | :---------------- | :--------- | :-------------------------------------------------------------------------------------------------------------------------------------- |
| sendMessage | {roomID, message} | message    | <p>Throw error if</p><p>1) player not in room</p><p></p><p>messages should be stored in the the subcollection messages of gameRooms</p> |

### <a name="_5wqep7f0d95c"></a>**Bidding API**

| **Name** | **Parameter** | **Return** | **Rules**                                                                                                                                                                                                                                                                                                                      |
| :------- | :------------ | :--------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| placeBid | roomID, Bid   | void       | <p>Throw error if</p><p>1) game not in bidding phase</p><p>2) player not in room</p><p>3) not player’s turn</p><p>4) bid smaller than highest bid</p><p></p><p>If there are 4 consecutive passes, the bid resets and the cards are redealt</p><p></p><p>If there are 3 consecutive passes, the largest bidder wins the bid</p> |

Trick Taking API

| playCard | roomID, card | void | <p>Throw error if</p><p>1) game not in trick taking phase</p><p>2) player not in room</p><p>3) not player’s turn</p><p>4) invalid card</p><p></p><p>else:</p><p>play card onto the table when there are less than 4 cards</p><p></p><p>declare who won, then make that player start the next trick</p><p></p> |
| :------- | :----------- | :--- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |

## <a name="_wc177nhtuebw"></a>**Frontend Routes**
