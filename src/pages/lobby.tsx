import {Link} from "react-router-dom";
import GreenButton from "../components/buttons/button.green";
import OrangeButton from "../components/buttons/button.orange";
import LobbyRooms from "../components/lobby/lobby.tab";
import dino from "assets/player_assets/dino_sprite_1.gif";
import {useAuth} from "../hooks/useAuth";
import {PlayerProfile} from "types/PlayerProfile";
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

const LobbyPlayerCard = (props: {playerProfile: PlayerProfile}) => {
  const {playerProfile} = props;
  return (
    <div
      className="d-flex p-3"
      style={{
        border: "6px solid grey",
        borderRadius: "20px",
        backgroundColor: "#5090E0",
      }}
    >
      <div className="mx-2">
        <img
          style={{
            height: "15rem",
            border: "2px solid lightblue",
            borderRadius: "20px",
            backgroundColor: "#68A0E0",
            boxShadow: "0px 0px 10px 5px rgba(0,0,0,0.1)",
          }}
          src={dino}
        />
      </div>
      <div>
        <div
          className="p-2 mb-2"
          style={{
            backgroundColor: "#80B0E8",
            borderRadius: "10px",
          }}
        >
          {playerProfile.displayName} ({playerProfile.country})
        </div>
        <div
          className="p-2"
          style={{
            backgroundColor: "#80B0E8",
            borderRadius: "10px",
          }}
        >
          Games Played:{playerProfile.numOfGamesPlayed}
        </div>
      </div>
    </div>
  );
};
