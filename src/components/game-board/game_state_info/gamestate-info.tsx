import { GameRoom } from "types/GameRoom";
import BiddingInfo from "./bidding-info";
import TrickTakingInfo from "./tricktaking-info";

const GameRoomInfo = (props: { gameRoom: GameRoom }) => {
  const gameRoomLookup = {
    Waiting: () => <></>,
    Bidding: BiddingInfo,
    "Taking Trick": TrickTakingInfo,
    "Choosing Teammate": () => <></>,
    Ended: () => <></>,
  };
  const gameroom = props.gameRoom;
  const GameRoomInfoComponent = gameRoomLookup[gameroom.status];

  return <GameRoomInfoComponent gameRoom={gameroom} />;
};

export default GameRoomInfo;
