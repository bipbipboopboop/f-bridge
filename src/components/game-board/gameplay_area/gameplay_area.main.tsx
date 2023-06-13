import {GameState} from "types/GameState";
import TrickTakingGameplayArea from "./gameplay_area.trick_taking";
import BiddingGameplayArea from "./gameplay_area.bidding";

const MainGameplayArea = (props: {gameState: GameState}) => {
  const {gameState} = props;

  const trickTakingPhase = gameState.trickTakingPhase;
  const biddingPhase = gameState.biddingPhase;

  if (trickTakingPhase) {
    return <TrickTakingGameplayArea trickTakingPhase={trickTakingPhase} />;
  }

  if (biddingPhase) {
    return <BiddingGameplayArea biddingPhase={biddingPhase} />;
  }
  return <></>;
};

export default MainGameplayArea;
