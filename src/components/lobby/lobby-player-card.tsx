import {PlayerProfile} from "types/PlayerProfile";
import dino from "assets/player_assets/dino_sprite_1.gif";
import "./lobby-player-card.css";

const LobbyPlayerCard = (props: {playerProfile: PlayerProfile}) => {
  const {playerProfile} = props;
  return (
    <div className="lobby-player-card">
      <div className="mx-2">
        <img src={dino} />
      </div>
      <div className="player-info">
        <div>
          {playerProfile.displayName} ({playerProfile.country})
        </div>
        <div>Games Played:{playerProfile.numOfGamesPlayed}</div>
      </div>
    </div>
  );
};

export default LobbyPlayerCard;
