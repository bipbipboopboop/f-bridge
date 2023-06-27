import {Dispatch, SetStateAction, useState} from "react";
import {useAuth} from "../../../hooks/useAuth";

import PlayingCard from "assets/playing_card";
import {Card, Suit} from "types/Card";
import {deck} from "../../../utils/deck";
import BidButton from "../../buttons/button-bid";
import {BiddingPhase} from "types/GameState";
import Button from "../../buttons/button";

const ChoosingTeammatePanel = (props: {biddingPhase: BiddingPhase}) => {
  const {biddingPhase} = props;
  const {playerProfile, gamePlayer} = useAuth();

  const [selectedSuit, setSelectedSuit] = useState<Suit | null>(null);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [isHovering, setIsHovering] = useState(false);

  // Check whether the player is the bid winner
  const bidWinner = biddingPhase.gameroomPlayersList.find(
    (player) => player.position === biddingPhase.currentPlayerIndex
  );

  const isBidWinner = bidWinner?.id === playerProfile?.id;
  if (!isBidWinner) {
    return <div>{bidWinner?.displayName} is choosing a teammate...</div>;
  }

  if (!gamePlayer) {
    return <></>;
  }

  const otherCardsLookup: Record<Suit, Card[]> = {
    "♣": deck
      .filter((card) => card.suit === "♣")
      .filter(
        (card) =>
          !gamePlayer.cards.some(
            (c) => c.stringValue === card.stringValue && c.suit === card.suit
          )
      ),
    "♦": deck
      .filter((card) => card.suit === "♦")
      .filter(
        (card) =>
          !gamePlayer.cards.some(
            (c) => c.stringValue === card.stringValue && c.suit === card.suit
          )
      ),
    "♥": deck
      .filter((card) => card.suit === "♥")
      .filter(
        (card) =>
          !gamePlayer.cards.some(
            (c) => c.stringValue === card.stringValue && c.suit === card.suit
          )
      ),
    "♠": deck
      .filter((card) => card.suit === "♠")
      .filter(
        (card) =>
          !gamePlayer.cards.some(
            (c) => c.stringValue === card.stringValue && c.suit === card.suit
          )
      ),
  };

  const promptText = `Your teammate will be the owner of ${selectedCard?.stringValue} ${selectedCard?.suit}`;

  return (
    <div
      className="h-100 px-3 d-flex flex-column justify-content-center align-items-center"
      style={{backgroundColor: "rgba(0, 0, 0, 0.3)", width: "90%"}}
    >
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
        >
          {isHovering ? "Lock in" : promptText}
        </Button>
      )}
      <div className="h-50 d-flex flex-column">
        <table>
          <tbody>
            {(["♣", "♦", "♥", "♠"] as Suit[]).map((suit) => (
              <tr>
                <td>
                  <BidButton
                    style={{
                      marginRight: "0.6rem",
                      color:
                        suit === "♣" || suit === "♠" ? "#222222" : "#ff525d",
                    }}
                    onClick={() => {
                      setSelectedSuit(suit);
                    }}
                  >
                    {suit}
                  </BidButton>
                </td>

                <td>
                  <div className="d-flex">
                    {suit === selectedSuit &&
                      otherCardsLookup[suit].map((card) => (
                        <BidButton
                          key={`${card.suit} - ${card.stringValue}`}
                          onClick={() => setSelectedCard(card)}
                        >
                          {card.stringValue}
                        </BidButton>
                      ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default ChoosingTeammatePanel;
