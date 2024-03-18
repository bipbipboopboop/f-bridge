import PlayerSVG from "../../assets/player_assets/player.svg";

import { createColumnHelper } from "@tanstack/react-table";
import { GameRoom } from "types/Room";

const roomColHelper = createColumnHelper<GameRoom>();
export const rowColumns = [
  roomColHelper.accessor("roomID", {
    header: () => <span>Room ID</span>,
    cell: (info) => info.getValue(),
  }),
  roomColHelper.accessor("settings.isInviteOnly", {
    header: () => <span>Type</span>,
    cell: (info) => (info.getValue() ? "Invite Only" : "Open"),
  }),
  roomColHelper.accessor("players", {
    header: () => <span>Host</span>,
    cell: (info) => info.getValue().find((plyr) => plyr.isHost)?.displayName,
  }),
  roomColHelper.accessor("players", {
    header: () => <span>Players</span>,
    cell: (info) => (
      <div className="flex">
        {[0, 1, 2, 3].map((index) => (
          <img
            key={index}
            className={`h-5 ${info.cell.getValue()[index] ? "opacity-100" : "opacity-50"}`}
            src={PlayerSVG}
            alt={PlayerSVG}
          />
        ))}
      </div>
    ),
  }),
];
