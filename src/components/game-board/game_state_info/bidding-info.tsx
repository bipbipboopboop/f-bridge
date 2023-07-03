import { GameRoom } from "types/GameRoom";
import BiddingTable from "../../tables/bidding-table";

const BiddingInfo = (props: { gameRoom: GameRoom }) => {
  const { gameRoom } = props;
  const biddingPhase = gameRoom.biddingPhase;

  if (!biddingPhase) return <></>;

  return biddingPhase && <BiddingTable biddingPhase={biddingPhase} />;
};

export default BiddingInfo;
