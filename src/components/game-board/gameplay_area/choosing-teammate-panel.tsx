import {useState} from "react";
import {toast} from "react-toastify";

import {useAuth} from "../../../hooks/useAuth";
import useFunctions from "../../../hooks/useFunctions";

import {Card, Suit} from "types/Card";
import {deck} from "../../../utils/deck";
import {BiddingPhase} from "types/GameState";

import BidButton from "../../buttons/button-bid";
import Button from "../../buttons/button";
import Loading from "../../Loading";

const ChoosingTeammatePanel = (props: {biddingPhase: BiddingPhase}) => {
  const {biddingPhase} = props;
  const {playerProfile, gamePlayer} = useAuth();

  const [selectedSuit, setSelectedSuit] = useState<Suit | null>(null);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [isHovering, setIsHovering] = useState(false);

  const {chooseTeammate, isLoading, error} = useFunctions();

  // Check whether the player is the bid winner
  const bidWinner = biddingPhase.gameroomPlayersList.find(
    (player) => player.position === biddingPhase.currentPlayerIndex
  );

  const isBidWinner = bidWinner?.id === playerProfile?.id;
  if (!isBidWinner) {
    return <div>{bidWinner?.displayName} is choosing a teammate...</div>;
  }

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    toast.error(error.message);
  }

  if (!gamePlayer) {
    return <></>;
  }

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

  const promptText = `Your teammate will be the owner of ${selectedCard?.stringValue} ${selectedCard?.suit}`;

  return (
    <div
      className="h-100 d-flex flex-column align-items-center"
      style={{backgroundColor: "rgba(0, 0, 0, 0.2)", width: "90%"}}
    >
      <div className="h-25 d-flex justify-content-center align-items-center">
        {selectedCard && (
          <Button
            theme="yellow"
            style={{width: "28rem", marginBottom: "1rem"}}
            onMouseEnter={() => {
              setIsHovering(true);
            }}
            onMouseLeave={() => {
              setIsHovering(false);
            }}
            onClick={() => {
              chooseTeammate(selectedCard);
            }}
          >
            {isHovering ? "Lock in" : promptText}
          </Button>
        )}
      </div>
      <div className="h-75 w-100 d-flex">
        <div className="w-50 h-100 d-flex flex-column justify-content-center align-items-center">
          {(["♣", "♦", "♥", "♠"] as Suit[]).map((suit) => (
            <BidButton
              style={{
                color: suit === "♣" || suit === "♠" ? "#222222" : "#ff525d",
                marginBottom: "0.5rem",
                border: `${selectedSuit === suit ? "5px solid #BD8E63" : ""}`,
              }}
              onClick={() => {
                setSelectedSuit(suit);
              }}
            >
              {suit}
            </BidButton>
          ))}
        </div>

        <div className="w-50 d-flex flex-wrap justify-content-center align-items-center">
          {selectedSuit &&
            otherCardsLookup[selectedSuit as Suit]
              .sort((a, b) => b.value - a.value)
              .map((card) => (
                <BidButton
                  style={{
                    marginRight: "1rem",
                    border: `${card === selectedCard ? "5px solid #BD8E63" : ""}`,
                  }}
                  key={`${card.suit} - ${card.stringValue}`}
                  onClick={() => setSelectedCard(card)}
                >
                  {card.stringValue}
                </BidButton>
              ))}
        </div>
      </div>
    </div>
  );
};
export default ChoosingTeammatePanel;
