import {TrickTakingPhase} from "types/GameState";
import PlayingAreaCard from "./gameplay_area.trick_taking_card";

const TrickTakingGameplayArea = (props: {
  trickTakingPhase: TrickTakingPhase;
}) => {
  const {trickTakingPhase} = props;

  // TODO: Obtain from trickTakingPhase and AuthContext
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
          location="top"
          card={cardLookup["top"]}
          zIndex={zIndexLookup["top"]}
        />
      </div>

      <div className="d-flex justify-content-around">
        <PlayingAreaCard
          location="left"
          card={cardLookup["left"]}
          zIndex={zIndexLookup["left"]}
        />
        <PlayingAreaCard
          location="right"
          card={cardLookup["right"]}
          zIndex={zIndexLookup["right"]}
        />
      </div>

      <div className="d-flex justify-content-center">
        <PlayingAreaCard
          location="bottom"
          card={cardLookup["bottom"]}
          zIndex={zIndexLookup["bottom"]}
        />
      </div>
    </div>
  );
};

export default TrickTakingGameplayArea;