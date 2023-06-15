import {BiddingPhase} from "types/GameState";
import {useAuth} from "../../../hooks/useAuth";
import {FC, HTMLAttributes} from "react";

type BiddingMessagePanelProps = {
  biddingPhase: BiddingPhase;
};

const BiddingMessagePanel: FC<HTMLAttributes<HTMLDivElement> & BiddingMessagePanelProps> = ({...props}) => {
  const {biddingPhase, ...divProps} = props;
  const {currentPlayerIndex, gameroomPlayersList} = biddingPhase;
  const {playerProfile} = useAuth();

  const currentBidder = gameroomPlayersList.filter((plyr) => plyr.position === currentPlayerIndex)[0];

  const isMyTurnToBid = currentBidder.id === playerProfile?.id;

  return (
    <div {...divProps}>
      {!isMyTurnToBid && <p>{`${currentBidder.displayName} is bidding ...`}</p>}
      {isMyTurnToBid && <p>Your turn to bid</p>}
    </div>
  );
};

export default BiddingMessagePanel;
