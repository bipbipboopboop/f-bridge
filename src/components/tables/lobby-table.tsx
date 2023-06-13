import {toast} from "react-toastify";
import PlayerSVG from "../../assets/player_assets/player.svg";
import useFunctions from "../../hooks/useFunctions";
import "./lobby-table.css";
import {createColumnHelper, flexRender, getCoreRowModel, useReactTable} from "@tanstack/react-table";

import {GameState} from "types/GameState";
import Loading from "../loading";
import {useNavigate} from "react-router-dom";

const RoomTable = (props: {gameRoomList: GameState[]}) => {
  const columnHelper = createColumnHelper<GameState>();
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

  const {gameRoomList} = props;
  const {joinGameRoom, isLoading, error} = useFunctions();
  const navigate = useNavigate();

  const table = useReactTable({
    data: gameRoomList,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (error) {
    toast.error(error.message);
  }
  if (isLoading) return <Loading />;

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
              const roomID = row.original.roomID;
              const success = await joinGameRoom(roomID);
              if (success) {
                toast.success("Successfully joined room");
                navigate(`/party/${roomID}`);
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
