import BiddingTable from "../../tables/bidding-table";

import {BiddingPhase} from "types/GameState";

import BiddingMessagePanel from "./bidding-message-panel";
import BiddingOptionsPanel from "./bidding-options-panel";

const BiddingGameplayArea = (props: {biddingPhase: BiddingPhase}) => {
  const {biddingPhase} = props;

  return (
    <div className="w-75 h-75 d-flex flex-column justify-content-center align-items-center">
      <BiddingMessagePanel biddingPhase={biddingPhase} />
      <BiddingTable biddingPhase={biddingPhase} />
      <BiddingOptionsPanel biddingPhase={biddingPhase} />
    </div>
  );
};

export default BiddingGameplayArea;
