import {GameState} from "types/GameState";
import BiddingInfo from "./bidding.info";
import TrickTakingInfo from "./tricktaking.info";

const GameStateInfo = (props: {gameState: GameState}) => {
  const gameStateLookup = {
    Waiting: () => <></>,
    Bidding: BiddingInfo,
    "Taking Trick": TrickTakingInfo,
  };
  const gameroom = props.gameState;
  const GameStateInfoComponent = gameStateLookup[gameroom.status];

  return <GameStateInfoComponent gameState={gameroom} />;
};

export default GameStateInfo;
