import { useAuth } from "../../hooks/useAuth";
import { avatarLookup } from "../../assets/avatar";
const LobbyAvatar = () => {
  const { playerAccount } = useAuth();

  if (!playerAccount) {
    return null;
  }

  const avatar = avatarLookup[playerAccount.avatarID];
  return (
    <div className="h-full flex flex-col justify-center items-center py-10 text-center">
      <div>
        {playerAccount.displayName} ({playerAccount.country})
      </div>
      <img src={avatar} alt="avatar" className="w-1/2 h-1/2" />
      <div>
        W/R: {playerAccount.numOfGamesWon}/{playerAccount.numOfGamesPlayed}
      </div>
    </div>
  );
};

export default LobbyAvatar;
