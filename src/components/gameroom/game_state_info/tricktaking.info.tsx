import {GameRoom} from "types/GameRoom";
import ScoreTable from "../../tables/game.score.table";

const TrickTakingInfo = (props: {gameroom: GameRoom}) => {
  const gameroom = props.gameroom;
  const trickTakingPhase = gameroom.trickTakingPhase;
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
