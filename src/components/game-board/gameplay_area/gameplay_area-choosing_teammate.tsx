import { BiddingPhase } from "types/GameRoom";
import ChoosingTeammatePanel from "./choosing-teammate-panel";

const ChoosingTeammateGameplayArea = (props: { biddingPhase: BiddingPhase }) => {
  const { biddingPhase } = props;

  return (
    <div className="w-100 h-100 d-flex flex-column justify-content-center align-items-center">
      <ChoosingTeammatePanel biddingPhase={biddingPhase} />
    </div>
  );
};

export default ChoosingTeammateGameplayArea;
