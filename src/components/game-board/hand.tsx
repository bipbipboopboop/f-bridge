import {memo} from "react";
import {useDocumentData} from "react-firebase-hooks/firestore";
import {DocumentReference, doc} from "firebase/firestore";
import {firestore} from "../../firebase";

import {useAuth} from "../../hooks/useAuth";

import {GamePlayer} from "types/PlayerProfile";

import PlayingCard from "assets/playing_card";
import "./hand.css";
import {BID_SUITS} from "../../utils/bid";

const Hand = () => {
  //TODO: Get Hand from cloud function
  const {playerProfile} = useAuth();
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

  return (
    <div className="hand">
      {/* <PlayingCard card={{suit: "♠", value: 10, stringValue: "10"}} /> */}
      {sortedCards?.map((card, index) => (
        <PlayingCard key={index} card={card} style={{marginLeft: "-2.2rem"}} />
      ))}
    </div>
  );
};

export default memo(Hand); // Prevent unnecessary re-renders since the props never change
