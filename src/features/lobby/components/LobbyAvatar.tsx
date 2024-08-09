import Button from "../../../components/buttons/Button";
import { useAuth } from "../../../hooks/useAuth";
import { avatarLookup } from "assets/avatar";
import { useFunctions } from "../../../hooks/useFunctions";
import { AvatarID } from "types/Avatar";

const AVATAR_IDS: AvatarID[] = [
  "blueDino",
  "greenDino",
  "redDino",
  "yellowDino",
  "jungleMan",
  "finn",
  "kucingDasco",
  "popcat",
];

const LobbyAvatar: React.FC<React.HTMLAttributes<HTMLDivElement>> = (props) => {
  const { playerAccount } = useAuth();
  const { changeAvatar } = useFunctions();

  const { className, ...rest } = props;

  if (!playerAccount) {
    return null;
  }

  const changeAvatarHandler = (direction: "left" | "right") => async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const currentIndex = AVATAR_IDS.indexOf(playerAccount.avatarID);
    const newIndex =
      direction === "left"
        ? (currentIndex - 1 + AVATAR_IDS.length) % AVATAR_IDS.length
        : (currentIndex + 1) % AVATAR_IDS.length;
    await changeAvatar(AVATAR_IDS[newIndex]);
  };

  const avatar = avatarLookup[playerAccount.avatarID];
  const winRate = Math.round((playerAccount.numOfGamesWon / (playerAccount.numOfGamesPlayed || 1)) * 100);

  return (
    <div
      className={`flex flex-col justify-center items-center text-center text-3xs md:text-base bg-black/10 rounded-md ${className}`}
      {...rest}
    >
      <div>{playerAccount.displayName}</div>
      <div className="flex w-full h-1/2 justify-center items-center gap-x-3">
        <Button theme="yellow" size={2} className="h-5 md:h-20" onClick={changeAvatarHandler("left")}>{`<`}</Button>
        <img
          src={avatar}
          alt="avatar"
          className="h-full aspect-square max-h-[200px] bg-black/10 rounded-md"
          style={{ imageRendering: "pixelated" }}
        />
        <Button theme="yellow" size={2} className="h-5 md:h-20" onClick={changeAvatarHandler("right")}>{`>`}</Button>
      </div>
      <div className="mt-3">Winrate: {winRate}%</div>
    </div>
  );
};

export default LobbyAvatar;
