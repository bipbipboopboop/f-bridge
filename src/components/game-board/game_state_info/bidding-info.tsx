import {GameState} from "types/GameState";
import BiddingTable from "../../tables/bidding-table";

const BiddingInfo = (props: {gameState: GameState}) => {
  const {gameState} = props;
  const biddingPhase = gameState.biddingPhase;

  if (!biddingPhase) return <></>;

  return biddingPhase && <BiddingTable biddingPhase={biddingPhase} />;
};

export default BiddingInfo;
