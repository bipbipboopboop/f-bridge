import { GameRoom } from "types/GameRoom";
import TrickTakingGameplayArea from "./gameplay_area.trick_taking";
import BiddingGameplayArea from "./gameplay_area.bidding";
import ChoosingTeammateGameplayArea from "./gameplay_area-choosing_teammate";

const MainGameplayArea = (props: { gameRoom: GameRoom }) => {
  const { gameRoom } = props;

  const trickTakingPhase = gameRoom.trickTakingPhase;
  const biddingPhase = gameRoom.biddingPhase;

  const status = gameRoom.status;
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
