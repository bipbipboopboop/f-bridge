import {BiddingPhase} from "types/GameState";
import BiddingTable from "../../tables/bidding.table";
import GreenButton from "../../buttons/button.green";

const BiddingGameplayArea = (props: {biddingPhase: BiddingPhase}) => {
  const {biddingPhase} = props;
  const {currentBidderIndex, gameroomPlayersList} = biddingPhase;

  const currentBidder = gameroomPlayersList.filter(
    (plyr) => plyr.position === currentBidderIndex
  )[0];

  // TODO: Get from AuthContext
  const myID = "0";
  const isMyTurnToBid = currentBidder.id === myID;

  return (
    <div className="w-50 h-75 d-flex flex-column justify-content-center align-items-center">
      {/* <pre>{JSON.stringify(currentBidder)}</pre> */}
      {!isMyTurnToBid && <p>{`${currentBidder.displayName} is bidding ...`}</p>}
      {isMyTurnToBid && <p>Your turn to bid</p>}
      <BiddingTable biddingPhase={biddingPhase} />
      <div>
        <GreenButton>Pass</GreenButton>
        <div className="d-flex">
          <button>1</button>
          <button>2</button>
          <button>3</button>
          <button>4</button>
          <button>5</button>
          <button>6</button>
        </div>
        <div className="d-flex">
          <button>♣</button>
          <button>♦</button>
          <button>♥</button>
          <button>♦</button>
          <button>NT</button>
        </div>
      </div>
    </div>
  );
};

export default BiddingGameplayArea;
