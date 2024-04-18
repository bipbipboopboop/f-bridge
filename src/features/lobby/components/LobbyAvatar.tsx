import { useAuth } from "../../../hooks/useAuth";
import { avatarLookup } from "assets/avatar";
const LobbyAvatar: React.FC<React.HTMLAttributes<HTMLDivElement>> = (props) => {
  const { playerAccount } = useAuth();

  const { className, ...rest } = props;

  if (!playerAccount) {
    return null;
  }

  const avatar = avatarLookup[playerAccount.avatarID];
  return (
    <div
      className={`flex flex-col justify-center items-center text-center mobile-landscape:text-3xs ${className}`}
      {...rest}
    >
      <div>
        {playerAccount.displayName} ({playerAccount.country})
      </div>
      <img
        src={avatar}
        alt="avatar"
        className="h-1/2 aspect-square max-h-[200px]"
        style={{ imageRendering: "pixelated" }}
      />
      <div>
        W/R: {playerAccount.numOfGamesWon}/{playerAccount.numOfGamesPlayed}
      </div>
    </div>
  );
};

export default LobbyAvatar;
