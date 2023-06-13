import React from "react";
import {LobbyPlayerProfile} from "types/PlayerProfile";
import OrangeButton from "../buttons/button-orange";
import PlayerBox from "./player_box";

import "./player_panel.css";
import GreenButton from "../buttons/button-green";
import useFunctions from "../../hooks/useFunctions";
import {useAuth} from "../../hooks/useAuth";
import Loading from "../loading";
import {toast} from "react-toastify";
import {useNavigate} from "react-router-dom";

interface PlayerPanelProps {
  players: LobbyPlayerProfile[];
}

const PlayerPanel: React.FC<PlayerPanelProps> = ({players}) => {
  const {playerProfile} = useAuth();
  const {leaveGameRoom, isLoading, error} = useFunctions();
  const navigate = useNavigate();

  if (isLoading) return <Loading />;
  if (error) toast.error(error.message);

  return (
    <>
      <h4>Players</h4>
      <div className="h-75">
        <div className="player-panel">
          {/* Player Box Row */}
          <div className="player-panel-row">
            <PlayerBox player={players[0]} />
            <PlayerBox player={players[1]} />
          </div>

          {/* Player Box Row */}
          <div className="player-panel-row">
            <PlayerBox player={players[2]} />
            <PlayerBox player={players[3]} />
          </div>
        </div>
        <div className="d-flex justify-content-center">
          <OrangeButton onClick={() => alert("start game")}>Start Game</OrangeButton>
          <GreenButton
            onClick={async () => {
              console.log({roomID: playerProfile?.roomID});
              const success = await leaveGameRoom(playerProfile?.roomID);
              if (success) {
                toast.success(`You left the room!`);
                navigate("/lobby");
              }
            }}
          >
            Leave Room
          </GreenButton>
        </div>
      </div>
    </>
  );
};

export default PlayerPanel;
