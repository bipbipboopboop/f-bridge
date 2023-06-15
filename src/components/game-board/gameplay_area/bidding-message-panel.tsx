import {BiddingPhase} from "types/GameState";
import {useAuth} from "../../../hooks/useAuth";

const BiddingMessagePanel = (props: {biddingPhase: BiddingPhase}) => {
  const {biddingPhase} = props;
  const {currentBidderIndex, gameroomPlayersList} = biddingPhase;
  const {playerProfile} = useAuth();

  const currentBidder = gameroomPlayersList.filter((plyr) => plyr.position === currentBidderIndex)[0];

  const isMyTurnToBid = currentBidder.id === playerProfile?.id;

  return (
    <div>
      {!isMyTurnToBid && <p>{`${currentBidder.displayName} is bidding ...`}</p>}
      {isMyTurnToBid && <p>Your turn to bid</p>}
    </div>
  );
};

export default BiddingMessagePanel;
