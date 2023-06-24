import {Dispatch, SetStateAction, useState} from "react";
import {useAuth} from "../../../hooks/useAuth";

import PlayingCard from "assets/playing_card";
import {Card, Suit} from "types/Card";
import {deck} from "../../../utils/deck";
import BidButton from "../../buttons/button-bid";
import {BiddingPhase} from "types/GameState";

const ChoosingTeammatePanel = (props: {biddingPhase: BiddingPhase}) => {
  const {biddingPhase} = props;
  const {playerProfile, gamePlayer} = useAuth();

  const [selectedSuit, setSelectedSuit] = useState<Suit | null>(null);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

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

  return (
    <div
      className="w-100 h-100 d-flex flex-column justify-content-center align-items-center"
      style={{border: "1px solid white"}}
    >
      {selectedCard && (
        <>
          Your teammate will be the owner of {selectedCard.stringValue}
          {selectedCard.suit}
        </>
      )}
      <div className="h-50 w-100 d-flex flex-column">
        <table>
          <tbody>
            {["♣", "♦", "♥", "♠"].map((suit) => (
              <tr>
                <td>
                  <BidButton
                    style={{marginRight: "0.6rem", color: "black"}}
                    onClick={() => {
                      setSelectedSuit(suit as Suit);
                    }}
                  >
                    {suit}
                  </BidButton>
                </td>
                <td>
                  <div className="d-flex">
                    {suit === selectedSuit &&
                      otherCardsLookup[suit as Suit].map((card) => (
                        <BidButton key={`${card.suit} - ${card.stringValue}`} onClick={() => setSelectedCard(card)}>
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
