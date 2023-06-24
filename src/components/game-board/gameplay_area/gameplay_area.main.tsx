import {GameState} from "types/GameState";
import TrickTakingGameplayArea from "./gameplay_area.trick_taking";
import BiddingGameplayArea from "./gameplay_area.bidding";
import ChoosingTeammateGameplayArea from "./gameplay_area-choosing_teammate";

const MainGameplayArea = (props: {gameState: GameState}) => {
  const {gameState} = props;

  const trickTakingPhase = gameState.trickTakingPhase;
  const biddingPhase = gameState.biddingPhase;

  const status = gameState.status;
  // TODO: REFACTOR
  if (status === "Bidding") {
    return biddingPhase ? <BiddingGameplayArea biddingPhase={biddingPhase} /> : <></>;
  }
  if (status === "Choosing Teammate") {
    return biddingPhase ? <ChoosingTeammateGameplayArea biddingPhase={biddingPhase} /> : <></>;
  }
  if (status === "Taking Trick") {
    return trickTakingPhase ? <TrickTakingGameplayArea trickTakingPhase={trickTakingPhase} /> : <></>;
  }
  return <></>;
};

export default MainGameplayArea;
