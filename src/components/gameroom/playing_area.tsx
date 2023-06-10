import {Card} from "types/Card";
import {TrickTakingPhase} from "types/GameState";
import PlayingCard from "../../assets/playing_card";

type Props = {};

const PlayingArea = (props: Props) => {
  const trickTakingPhase: TrickTakingPhase = {
    currentPlayerIndex: 0,
    leadPlayerIndex: 0,
    trumpSuit: "♠",
    gameroomPlayersList: [
      {
        avatarID: "1",
        displayName: "Player 1",
        id: "1",
        numCardsOnHand: 13,
        position: 0,
        currentCardOnTable: {stringValue: "A", suit: "♠", value: 14},
        numTricksWon: 0,
      },
      {
        displayName: "Player 2",
        id: "2",
        avatarID: "2",
        numCardsOnHand: 13,
        position: 1,
        currentCardOnTable: {stringValue: "K", suit: "♠", value: 13},
        numTricksWon: 0,
      },
      {
        displayName: "Player 3",
        id: "3",
        avatarID: "3",
        numCardsOnHand: 13,
        position: 2,
        currentCardOnTable: {stringValue: "Q", suit: "♠", value: 12},
        numTricksWon: 0,
      },
      {
        displayName: "Player 4",
        id: "4",
        avatarID: "4",
        numCardsOnHand: 13,
        position: 3,
        currentCardOnTable: {stringValue: "J", suit: "♠", value: 11},
        numTricksWon: 0,
      },
    ],
  };

  const myPosition = 1;
  const positionLookup = {
    top: (myPosition + 2) % 4,
    right: (myPosition + 1) % 4,
    bottom: myPosition,
    left: (myPosition + 3) % 4,
  };

  const zIndexLookup = {
    top: (positionLookup["top"] - trickTakingPhase.leadPlayerIndex + 4) % 4,
    right: (positionLookup["right"] - trickTakingPhase.leadPlayerIndex + 4) % 4,
    bottom:
      (positionLookup["bottom"] - trickTakingPhase.leadPlayerIndex + 4) % 4,
    left: (positionLookup["left"] - trickTakingPhase.leadPlayerIndex + 4) % 4,
  };

  const cardLookup = {
    top: trickTakingPhase.gameroomPlayersList[positionLookup["top"]]
      .currentCardOnTable,
    right:
      trickTakingPhase.gameroomPlayersList[positionLookup["right"]]
        .currentCardOnTable,
    bottom:
      trickTakingPhase.gameroomPlayersList[positionLookup["bottom"]]
        .currentCardOnTable,
    left: trickTakingPhase.gameroomPlayersList[positionLookup["left"]]
      .currentCardOnTable,
  };

  return (
    <div>
      {/* <pre>{JSON.stringify(zIndexLookup)}</pre> */}
      <div className="d-flex justify-content-center">
        <PlayingAreaCard
          card={cardLookup["top"]}
          location="top"
          zIndex={zIndexLookup["top"]}
        />
      </div>

      <div className="d-flex justify-content-around">
        <PlayingAreaCard
          card={cardLookup["left"]}
          location="left"
          zIndex={zIndexLookup["left"]}
        />
        <PlayingAreaCard
          card={cardLookup["right"]}
          location="right"
          zIndex={zIndexLookup["right"]}
        />
      </div>

      <div className="d-flex justify-content-center">
        <PlayingAreaCard
          card={cardLookup["bottom"]}
          location="bottom"
          zIndex={zIndexLookup["bottom"]}
        />
      </div>
    </div>
  );
};

export default PlayingArea;

const PlayingAreaCard = (props: {
  card: Card | null;
  location: "top" | "bottom" | "left" | "right";
  zIndex: number;
}) => {
  const {card, location, zIndex} = props;

  const rotationLookup = {
    top: "0deg",
    bottom: "0deg",
    left: "90deg",
    right: "270deg",
  };

  const topOffset = {
    top: "3rem",
    bottom: "-3rem",
    left: "0rem",
    right: "0rem",
  };
  if (card)
    return (
      <PlayingCard
        card={card}
        style={{
          zIndex,
          rotate: rotationLookup[location],
          position: "relative",
          top: topOffset[location],
        }}
      />
    );
  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        height: "7rem",
        width: "5rem",
        rotate: rotationLookup[location],
        position: "relative",
        top: topOffset[location],
      }}
    >
      {rotationLookup[location]}
    </div>
  );
};
