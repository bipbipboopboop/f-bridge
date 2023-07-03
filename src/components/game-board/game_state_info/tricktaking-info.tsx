import { GameRoom } from "types/GameRoom";
import ScoreTable from "../../tables/tricks-table";

const TrickTakingInfo = (props: { gameRoom: GameRoom }) => {
  const { gameRoom } = props;
  const trickTakingPhase = gameRoom.trickTakingPhase;
  return (
    <>
      <ScoreTable />
      <div className="d-flex flex-column align-items-center">
        <div>Trump</div>
        <div>{trickTakingPhase?.trumpSuit}</div>
      </div>
    </>
  );
};

export default TrickTakingInfo;
