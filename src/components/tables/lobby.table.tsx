import PlayerSVG from "../../assets/player_assets/player.svg";
import "./lobby.table.css";
import {createColumnHelper, flexRender, getCoreRowModel, useReactTable} from "@tanstack/react-table";

import {GameState} from "types/GameState";

const RoomTable = (props: {gameRoomList: GameState[]}) => {
  const {gameRoomList} = props;

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
              />
            ))}
          </div>
        );
      },
    }),
  ];

  const table = useReactTable({
    data: gameRoomList,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <table className="lobby-table">
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th key={header.id}>
                {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default RoomTable;
