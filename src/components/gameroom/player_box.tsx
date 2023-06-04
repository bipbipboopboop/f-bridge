import {LobbyPlayerProfile} from "types/PlayerProfile";
import "./player_box.css";
import dino_sprite_1 from "../../assets/player_assets/dino_sprite_1.gif";
import dino_sprite_2 from "../../assets/player_assets/dino_sprite_2.gif";
import dino_sprite_3 from "../../assets/player_assets/dino_sprite_3.gif";
import dino_sprite_4 from "../../assets/player_assets/dino_sprite_4.gif";

const PlayerBox = ({player}: {player: LobbyPlayerProfile}) => {
  const spriteList = [
    dino_sprite_1,
    dino_sprite_2,
    dino_sprite_3,
    dino_sprite_4,
  ];

  // Convert player avatarID to sprite index
  const spriteIndex =
    player.avatarID === null ? 0 : parseInt(player.avatarID) - 1;

  return (
    <div className="player-box">
      <img style={{height: "6rem"}} src={spriteList[spriteIndex]} />
      <span>{player?.displayName}</span>
      <span>{`${player?.isReady ? "Ready" : "Not Ready"}`}</span>
    </div>
  );
};

export default PlayerBox;
