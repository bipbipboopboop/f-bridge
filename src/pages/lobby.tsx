import {Link} from "react-router-dom";
import GreenButton from "../components/buttons/button.green";
import OrangeButton from "../components/buttons/button.orange";
import LobbyRooms from "../components/lobby/lobby-rooms";
import LobbyPlayerCard from "../components/lobby/lobby-player-card";

import {useAuth} from "../hooks/useAuth";

const Lobby = () => {
  const {playerProfile} = useAuth();

  if (!playerProfile) return <></>;

  return (
    <div className="w-100 h-100 d-flex">
      <div className="w-50 p-3">
        <div className="d-flex justify-content-center">
          <LobbyRooms />
        </div>
      </div>
      <div className="w-50 h-100 p-3 d-flex flex-column justify-content-between">
        <LobbyPlayerCard playerProfile={playerProfile} />
        <div className="p-3" style={{border: "1px solid"}}>
          <p>Join A Room!</p>
          <input type="text" style={{height: "52px"}} />
          <GreenButton style={{marginRight: "0.5rem"}}>Join Room</GreenButton>
        </div>
        <div className="d-flex flex-column p-3" style={{gap: "20px"}}>
          <div className="d-flex justify-content-center">
            <Link
              style={{textDecoration: "none", color: "white"}}
              to={"/gameroom"}
            >
              <OrangeButton>Create Room</OrangeButton>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lobby;
