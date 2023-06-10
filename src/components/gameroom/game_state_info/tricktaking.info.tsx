import {GameState} from "types/GameState";
import ScoreTable from "../../tables/tricks.table";

const TrickTakingInfo = (props: {gameState: GameState}) => {
  const {gameState} = props;
  const trickTakingPhase = gameState.trickTakingPhase;
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
