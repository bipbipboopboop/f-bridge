import { PlayerProfile } from "types/PlayerProfile";
import "./lobby-player-card.css";

import { avatarLookup } from "assets/avatar";

const LobbyPlayerCard = (props: { playerProfile: PlayerProfile }) => {
  const { playerProfile } = props;

  return (
    <div className="lobby-player-card">
      <div className="mx-2">
        <img src={avatarLookup[playerProfile.avatarID as "redDino"]} alt={":/"} />
      </div>
      <div className="player-info" style={{ width: "100%" }}>
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
