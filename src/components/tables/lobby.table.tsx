import PlayerSVG from "../../assets/player_assets/player.svg";
import "./lobby.table.css";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {GameState} from "types/GameState";

const RoomTable = () => {
  const data: GameState[] = [
    {
      hostID: "Host 1",
      createdAt: new Date(),
      settings: {
        isInviteOnly: false,
        isSpectatorAllowed: false,
      },
      invitedID: [],
      status: "Waiting",
      players: [
        {
          displayName: "Player 1",
          country: "International",
          avatarID: "2",
          email: "hi@email.com",
          id: "1",
          isReady: true,
          isHost: false,
          numOfGamesPlayed: 0,
          numOfGamesWon: 0,
          position: 0,
          roomID: "1",
        },
        {
          displayName: "Player 1",
          country: "International",
          avatarID: "1",
          email: "hi@email.com",
          id: "1",
          isReady: true,
          isHost: false,
          numOfGamesPlayed: 0,
          numOfGamesWon: 0,
          position: 0,
          roomID: "1",
        },
      ],
      biddingPhase: null,
      trickTakingPhase: null,
    },
    {
      hostID: "Host 2",
      createdAt: new Date(),
      settings: {
        isInviteOnly: false,
        isSpectatorAllowed: false,
      },
      invitedID: [],
      status: "Waiting",
      players: [],
      biddingPhase: null,
      trickTakingPhase: null,
    },
  ];

  const columnHelper = createColumnHelper<GameState>();

  const columns = [
    columnHelper.accessor("biddingPhase", {
      header: () => <span>Room ID</span>,
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("hostID", {
      header: () => <span>Host</span>,
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("settings.isInviteOnly", {
      header: () => <span>Type</span>,
      cell: (info) => info.getValue(),
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
                className={`lobby_table_data_players-${
                  plyrList[index] ? "occupied" : "vacant"
                }`}
                src={PlayerSVG}
              />
            ))}
          </div>
        );
      },
    }),
  ];
  const table = useReactTable({
    data,
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
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default RoomTable;
