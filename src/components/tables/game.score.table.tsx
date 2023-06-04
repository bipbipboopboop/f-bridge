import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {GameRoom} from "types/GameRoom";

const ScoreTable = () => {
  const data: GameRoom[] = [
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
          numCardsOnHand: 0,
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
          numCardsOnHand: 0,
          numOfGamesPlayed: 0,
          numOfGamesWon: 0,
          position: 0,
          roomID: "1",
        },
      ],
      biddingPhase: null,
      trickTakingPhase: null,
      scores: [],
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
      scores: [],
    },
  ];

  const columnHelper = createColumnHelper<GameRoom>();

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
        return <div></div>;
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
      <tbody id="lobby_center_rooms_table_body">
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

export default ScoreTable;
