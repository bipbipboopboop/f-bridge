import {TrickTakingPhase} from "types/GameRoom";

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
        currentCardOnTable: null,
        numTricksWon: 0,
      },
      {
        displayName: "Player 2",
        id: "2",
        avatarID: "2",
        numCardsOnHand: 13,
        position: 1,
        currentCardOnTable: null,
        numTricksWon: 0,
      },
      {
        displayName: "Player 3",
        id: "3",
        avatarID: "3",
        numCardsOnHand: 13,
        position: 2,
        currentCardOnTable: null,
        numTricksWon: 0,
      },
      {
        displayName: "Player 4",
        id: "4",
        avatarID: "4",
        numCardsOnHand: 13,
        position: 3,
        currentCardOnTable: null,
        numTricksWon: 0,
      },
    ],
  };
  return (
    <>
      {/* <div
        className="d-flex justify-content-center"
        style={{height: "5em", marginBottom: "-3vh"}}
      >
        {topCard ? (
          <div style={{zIndex: topOffset}}>
            <PlayingCard card={new CardClass(topCard?.suit, topCard?.rank)} />
          </div>
        ) : (
          <PlaceholderCard />
        )}
      </div>
      <div className="d-flex justify-content-around" style={{height: "5em"}}>
        {leftCard ? (
          <div style={{zIndex: leftOffset}}>
            <PlayingCard
              card={new CardClass(leftCard?.suit, leftCard?.rank)}
              orientation={"left"}
            />
          </div>
        ) : (
          <PlaceholderCard orientation={"left"} />
        )}
        {rightCard ? (
          <div style={{zIndex: rightOffset}}>
            <PlayingCard
              card={new CardClass(rightCard?.suit, rightCard?.rank)}
              orientation={"right"}
            />
          </div>
        ) : (
          <PlaceholderCard orientation={"right"} />
        )}
      </div>
      <div
        className="d-flex justify-content-center"
        style={{height: "5em", marginTop: "-3vh"}}
      >
        {bottomCard ? (
          <div style={{zIndex: bottomOffset}}>
            <PlayingCard
              card={new CardClass(bottomCard.suit, bottomCard.rank)}
            />
          </div>
        ) : (
          <PlaceholderCard />
        )}
      </div> */}
    </>
  );
};

export default PlayingArea;
