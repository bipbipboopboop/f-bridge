import GreenButton from "../components/buttons/button.green";
import OrangeButton from "../components/buttons/button.orange";
import LobbyRooms from "../components/lobby/lobby.tab";

const Lobby = () => {
  return (
    <div className="w-100 h-100 d-flex">
      <div className="w-50">
        <div className="d-flex justify-content-center">
          <LobbyRooms />
        </div>
      </div>
      <div className="w-50 h-100">
        <div className="h-100 d-flex flex-column justify-content-around">
          <div className="h-75" style={{border: "1px solid"}}>
            Room Details
          </div>
          <div className="d-flex flex-column p-3" style={{gap: "20px"}}>
            <div className="d-flex justify-content-center">
              <GreenButton style={{marginRight: "0.5rem"}}>
                Join Room
              </GreenButton>
              <GreenButton style={{marginLeft: "0.5rem"}}>
                Room Settings
              </GreenButton>
            </div>
            <div className="d-flex justify-content-center">
              <OrangeButton>Start Game</OrangeButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lobby;
