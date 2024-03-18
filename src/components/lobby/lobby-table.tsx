import { toast } from "react-toastify";
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useNavigate } from "react-router-dom";

import PlayerSVG from "../../assets/player_assets/player.svg";

import { GameRoom } from "types/Room";

import { useAuth } from "../../hooks/useAuth";
import { useFunctions } from "../../hooks/useFunctions";

const LobbyRoomTable = (props: { gameRoomList: GameRoom[] }) => {
  const { playerAccount } = useAuth();
  const navigate = useNavigate();

  const columnHelper = createColumnHelper<GameRoom>();

  const columns = [
    columnHelper.accessor("roomID", {
      header: () => <span>Room ID</span>,
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("settings.isInviteOnly", {
      header: () => <span>Type</span>,
      cell: (info) => (info.getValue() ? "Invite Only" : "Open"),
    }),
    columnHelper.accessor("players", {
      header: () => <span>Host</span>,
      cell: (info) => info.getValue().find((plyr) => plyr.isHost)?.displayName,
    }),
    columnHelper.accessor("players", {
      header: () => <span>Players</span>,
      cell: (info) => {
        const plyrList = info.cell.getValue();
        return (
          <div className="flex">
            {[0, 1, 2, 3].map((index) => (
              <img
                key={index}
                className={`h-5 ${plyrList[index] ? "opacity-100" : "opacity-50"}`}
                src={PlayerSVG}
                alt={PlayerSVG}
              />
            ))}
          </div>
        );
      },
    }),
  ];

  const { gameRoomList } = props;
  const { joinGameRoom, error } = useFunctions();

  const table = useReactTable({
    data: gameRoomList,
    rowColumns: columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (error) {
    toast.error(error.message);
  }

  if (!playerAccount) return <></>;

  return (
    <table className="w-full border-separate border-spacing-0">
      <thead>
        {table.getHeaderGroups().map((headerGroup, index) => (
          <tr key={index}>
            {headerGroup.headers.map((header, index) => (
              <th key={index} className="px-4 py-2">
                {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row, index) => (
          <tr
            key={index}
            className="cursor-pointer bg-gray-100 hover:bg-blue-500 h-12 text-sm"
            onClick={async () => {
              if (row.original.settings.isInviteOnly) return;
              if (!playerAccount.roomID) {
                const roomID = row.original.roomID;
                const success = await joinGameRoom(roomID);
                if (success) {
                  toast.success("Successfully joined room");
                  navigate(`/party/${roomID}`);
                }
              }
              if (playerAccount.roomID === row.original.roomID) {
                navigate(`/party/${playerAccount.roomID}`);
                return;
              }
              if (row.original.playerCount >= 4) {
                toast.error("Room is full");
                return;
              }
            }}
          >
            {row.getVisibleCells().map((cell, index) => (
              <td key={index} className="px-4 py-2 align-middle">
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default LobbyRoomTable;
