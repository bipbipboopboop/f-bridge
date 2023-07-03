import { toast } from "react-toastify";
import PlayerSVG from "../../assets/player_assets/player.svg";
import useFunctions from "../../hooks/useFunctions";
import "./lobby-table.css";
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";

import { GameRoom } from "types/GameRoom";
import Loading from "../Loading";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const RoomTable = (props: { gameRoomList: GameRoom[] }) => {
  const { playerProfile } = useAuth();
  const navigate = useNavigate();
  const columnHelper = createColumnHelper<GameRoom>();
  const columns = [
    columnHelper.accessor("roomID", {
      header: () => <span>Room ID</span>,
      cell: (info) => info.getValue(),
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
          <div>
            {[0, 1, 2, 3].map((index) => (
              <img
                key={index}
                className={`lobby_table_data_players-${plyrList[index] ? "occupied" : "vacant"}`}
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
  const { joinGameRoom, isLoading, error } = useFunctions();

  const table = useReactTable({
    data: gameRoomList,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (error) {
    toast.error(error.message);
  }
  if (isLoading) return <Loading />;
  if (!playerProfile) return <></>;

  return (
    <table className="lobby-table">
      <thead>
        {table.getHeaderGroups().map((headerGroup, index) => (
          <tr key={index}>
            {headerGroup.headers.map((header, index) => (
              <th key={index}>
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
            onClick={async () => {
              if (!playerProfile.roomID) {
                const roomID = row.original.roomID;
                const success = await joinGameRoom(roomID);
                if (success) {
                  toast.success("Successfully joined room");
                  navigate(`/gameroom/${roomID}`);
                }
              }

              if (playerProfile.roomID === row.original.roomID) {
                navigate(`/gameroom/${playerProfile.roomID}`);
                return;
              }

              if (row.original.players.length >= 4) {
                toast.error("Room is full");
                return;
              }
            }}
          >
            {row.getVisibleCells().map((cell, index) => (
              <td key={index}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default RoomTable;
