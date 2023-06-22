import {Dispatch, SetStateAction, useState} from "react";
import {useAuth} from "../../../hooks/useAuth";

import PlayingCard from "assets/playing_card";
import {Card, Suit} from "types/Card";
import {deck} from "../../../utils/deck";
import BidButton from "../../buttons/button-bid";

const PickTeammatePanel = () => {
  const [selectedSuit, setSelectedSuit] = useState<Suit | null>(null);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  return (
    <div
      className="w-100 h-100 d-flex flex-column justify-content-center align-items-center"
      style={{border: "1px solid white"}}
    >
      <div className="h-50">{selectedCard && <PlayingCard card={selectedCard} />}</div>
      <div className="h-50 w-100 d-flex flex-column">
        {["♣", "♦", "♥", "♠"].map((suit) => (
          <div className="d-flex my-2" key={suit}>
            <BidButton
              style={{marginRight: "0.6rem", color: `${suit === "♣" || suit === "♠" ? "black" : "red"}`}}
              onClick={() => {
                setSelectedSuit(suit as Suit);
              }}
            >
              {suit}
            </BidButton>
            <OtherCardsComponent suit={suit as Suit} selectedSuit={selectedSuit} setSelectedCard={setSelectedCard} />
          </div>
        ))}
      </div>
    </div>
  );
};
export default PickTeammatePanel;

const OtherCardsComponent = (props: {
  suit: Suit;
  selectedSuit: Suit | null;
  setSelectedCard: Dispatch<SetStateAction<Card | null>>;
}) => {
  const {gamePlayer} = useAuth();
  const {suit, selectedSuit, setSelectedCard} = props;
  if (!gamePlayer) return <></>;
  if (!selectedSuit) return <></>;

  const otherCardsLookup: Record<Suit, Card[]> = {
    "♣": deck
      .filter((card) => card.suit === "♣")
      .filter((card) => !gamePlayer.cards.some((c) => c.stringValue === card.stringValue && c.suit === card.suit)),
    "♦": deck
      .filter((card) => card.suit === "♦")
      .filter((card) => !gamePlayer.cards.some((c) => c.stringValue === card.stringValue && c.suit === card.suit)),
    "♥": deck
      .filter((card) => card.suit === "♥")
      .filter((card) => !gamePlayer.cards.some((c) => c.stringValue === card.stringValue && c.suit === card.suit)),
    "♠": deck
      .filter((card) => card.suit === "♠")
      .filter((card) => !gamePlayer.cards.some((c) => c.stringValue === card.stringValue && c.suit === card.suit)),
  };
  console.log({suit, selectedSuit});

  if (!(suit === selectedSuit)) return <></>;

  return (
    <div className="d-flex">
      {otherCardsLookup[selectedSuit].map((card) => (
        <BidButton key={`${card.suit} - ${card.stringValue}`} onClick={() => setSelectedCard(card)}>
          {card.stringValue}
        </BidButton>
      ))}
    </div>
  );
};
