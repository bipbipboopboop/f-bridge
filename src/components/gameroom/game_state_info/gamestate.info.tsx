import {GameState} from "types/GameState";
import BiddingInfo from "./bidding.info";
import TrickTakingInfo from "./tricktaking.info";

const GameStateInfo = (props: {gameroom: GameState}) => {
  const gameStateLookup = {
    Waiting: () => <></>,
    Bidding: BiddingInfo,
    "Taking Trick": TrickTakingInfo,
  };
  const gameroom = props.gameroom;
  const GameStateInfoComponent = gameStateLookup[gameroom.status];

  return <GameStateInfoComponent gameroom={gameroom} />;
};

export default GameStateInfo;
