import "./lobby-player-card.css";
import { avatarLookup } from "assets/avatar";
import { RestrictedAccountInfo } from "types/Account";

const LobbyPlayerCard = (props: { playerAccount: RestrictedAccountInfo }) => {
  const { playerAccount } = props;

  return (
    <div className="lobby-player-card">
      <div className="mx-2">
        <img src={avatarLookup[playerAccount.avatarID as "redDino"]} alt={":/"} />
      </div>
      <div className="player-info" style={{ width: "100%" }}>
        Name:
        <div>
          {playerAccount.displayName} ({playerAccount.country})
        </div>
        Games Played:
        <div>{playerAccount.numOfGamesPlayed}</div>
      </div>
    </div>
  );
};

export default LobbyPlayerCard;
