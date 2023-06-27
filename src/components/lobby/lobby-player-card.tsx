import {PlayerProfile} from "types/PlayerProfile";
import dino from "assets/player_assets/dino_sprite_1.gif";
import "./lobby-player-card.css";

const LobbyPlayerCard = (props: {playerProfile: PlayerProfile}) => {
  const {playerProfile} = props;
  return (
    <div className="lobby-player-card">
      <div className="mx-2">
        <img src={dino} alt={":/"} />
      </div>
      <div className="player-info" style={{width: "100%"}}>
        Name:
        <div>
          {playerProfile.displayName} ({playerProfile.country})
        </div>
        Games Played:
        <div>{playerProfile.numOfGamesPlayed}</div>
      </div>
    </div>
  );
};

export default LobbyPlayerCard;
