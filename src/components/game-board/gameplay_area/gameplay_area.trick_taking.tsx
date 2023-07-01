import {TrickTakingPhase} from "types/GameState";
import PlayingAreaCard from "./gameplay_area.trick_taking_card";
import {useAuth} from "../../../hooks/useAuth";

const TrickTakingGameplayArea = (props: {trickTakingPhase: TrickTakingPhase}) => {
  const {trickTakingPhase} = props;
  const {playerProfile} = useAuth();

  const currPlayer = trickTakingPhase.gameroomPlayersList[trickTakingPhase.currentPlayerIndex];
  const myPlayer = trickTakingPhase.gameroomPlayersList.find((plyr) => plyr.id === playerProfile?.id);
  const myPosition = myPlayer?.position as number;
  const positionLookup = {
    top: (myPosition + 2) % 4,
    right: (myPosition + 1) % 4,
    bottom: myPosition,
    left: (myPosition + 3) % 4,
  };

  const zIndexLookup = {
    top: (positionLookup["top"] - trickTakingPhase.leadPlayerIndex + 4) % 4,
    right: (positionLookup["right"] - trickTakingPhase.leadPlayerIndex + 4) % 4,
    bottom: (positionLookup["bottom"] - trickTakingPhase.leadPlayerIndex + 4) % 4,
    left: (positionLookup["left"] - trickTakingPhase.leadPlayerIndex + 4) % 4,
  };

  const cardLookup = {
    top: trickTakingPhase.gameroomPlayersList[positionLookup["top"]].currentCardOnTable,
    right: trickTakingPhase.gameroomPlayersList[positionLookup["right"]].currentCardOnTable,
    bottom: trickTakingPhase.gameroomPlayersList[positionLookup["bottom"]].currentCardOnTable,
    left: trickTakingPhase.gameroomPlayersList[positionLookup["left"]].currentCardOnTable,
  };

  return (
    <div
      className="h-100 w-75 d-flex flex-column align-items-center"
      style={{backgroundColor: "rgba(0, 0, 0, 0.2)", width: "90%"}}
    >
      {currPlayer.id === myPlayer?.id && <p>Your turn to play</p>}
      {currPlayer.id !== myPlayer?.id && <p>{currPlayer.displayName}'s turn to play</p>}
      <div className="d-flex justify-content-center">
        <PlayingAreaCard location="top" card={cardLookup["top"]} zIndex={zIndexLookup["top"]} />
      </div>

      <div className="d-flex justify-content-around">
        <PlayingAreaCard location="left" card={cardLookup["left"]} zIndex={zIndexLookup["left"]} />
        <PlayingAreaCard location="right" card={cardLookup["right"]} zIndex={zIndexLookup["right"]} />
      </div>

      <div className="d-flex justify-content-center">
        <PlayingAreaCard location="bottom" card={cardLookup["bottom"]} zIndex={zIndexLookup["bottom"]} />
      </div>
    </div>
  );
};

export default TrickTakingGameplayArea;
