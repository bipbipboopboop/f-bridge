import {memo, useState} from "react";
import {useDocumentData} from "react-firebase-hooks/firestore";
import {DocumentReference, doc} from "firebase/firestore";
import {firestore} from "../../firebase";

import {useAuth} from "../../hooks/useAuth";

import {GamePlayer} from "types/PlayerProfile";

import PlayingCard from "assets/playing_card";
import "./hand.css";
import {BID_SUITS} from "../../utils/bid";
import {GameState} from "types/GameState";
import Button from "../buttons/button";
import {Card} from "types/Card";

const Hand = (props: {gameState: GameState}) => {
  const {gameState} = props;
  const {playerProfile} = useAuth();

  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  const roomID = playerProfile?.roomID;
  const gamePlayerRef = doc(
    firestore,
    `gameRooms/${roomID}/players`,
    playerProfile?.id || "ERROR"
  ) as DocumentReference<GamePlayer>;
  const [gamePlayer] = useDocumentData<GamePlayer>(gamePlayerRef);

  // gamePlayer's card sorted by suit and value in ascending order, suit order: ♣, ♦, ♥, ♠
  const sortedCards = gamePlayer?.cards.sort((a, b) => {
    const suitOrder = BID_SUITS.indexOf(a.suit) - BID_SUITS.indexOf(b.suit);

    if (suitOrder !== 0) {
      return suitOrder;
    }
    return a.value - b.value;
  });

  const isMyTurn = gameState.trickTakingPhase && gameState.trickTakingPhase.currentPlayerIndex === gamePlayer?.position;

  return (
    <div className="w-100 h-100 d-flex">
      {/* <pre>{JSON.stringify(selectedCard)}</pre> */}
      <div style={{width: "85%"}} className="hand">
        {/* <PlayingCard card={{suit: "♠", value: 10, stringValue: "10"}} /> */}
        {sortedCards?.map((card, index) => (
          <PlayingCard
            key={index}
            card={card}
            style={{
              marginLeft: "-2.2vw",
              top: selectedCard?.suit === card.suit && selectedCard.value === card.value ? "-10px" : "0px",
              position: "relative",
            }}
            onClick={() => {
              isMyTurn && setSelectedCard(card);
            }}
          />
        ))}
      </div>

      <div style={{width: "15%"}} className="h-100 d-flex align-items-end">
        {isMyTurn && (
          <Button theme="green" disabled={!selectedCard} onClick={() => {}}>
            Play
          </Button>
        )}
      </div>
    </div>
  );
};

export default memo(Hand); // Prevent unnecessary re-renders since the props never change
