import BiddingTable from "../../tables/bidding-table";

import {BiddingPhase} from "types/GameState";

import BiddingMessagePanel from "./bidding-message-panel";
import BiddingOptionsPanel from "./bidding-options-panel";

const BiddingGameplayArea = (props: {biddingPhase: BiddingPhase}) => {
  const {biddingPhase} = props;

  return (
    <div className="w-75 h-100 d-flex flex-column justify-content-center align-items-center">
      <BiddingMessagePanel style={{height: "10%"}} biddingPhase={biddingPhase} />
      <div style={{height: "60%"}}>
        <BiddingTable biddingPhase={biddingPhase} />
      </div>
      <BiddingOptionsPanel style={{height: "30%"}} biddingPhase={biddingPhase} />
    </div>
  );
};

export default BiddingGameplayArea;
