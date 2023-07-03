import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";

import { TrickTakingPhase } from "types/GameRoom";
import { GameRoomPlayer } from "types/PlayerProfile";
import "./tricks-table.css";

const ScoreTable = () => {
  const trickTakingPhase: TrickTakingPhase = {
    currentPlayerIndex: 0,
    leadPlayerIndex: 0,
    trumpSuit: "♠",
    gameroomPlayersList: [
      {
        avatarID: "1",
        displayName: "Player 1",
        id: "1",
        numCardsOnHand: 13,
        position: 0,
        currentCardOnTable: null,
        numTricksWon: 0,
      },
      {
        displayName: "Player 2",
        id: "2",
        avatarID: "2",
        numCardsOnHand: 13,
        position: 1,
        currentCardOnTable: null,
        numTricksWon: 0,
      },
      {
        displayName: "Player 3",
        id: "3",
        avatarID: "3",
        numCardsOnHand: 13,
        position: 2,
        currentCardOnTable: null,
        numTricksWon: 0,
      },
      {
        displayName: "Player 4",
        id: "4",
        avatarID: "4",
        numCardsOnHand: 13,
        position: 3,
        currentCardOnTable: null,
        numTricksWon: 0,
      },
    ],
  };

  const data = trickTakingPhase.gameroomPlayersList;
  const columnHelper = createColumnHelper<GameRoomPlayer>();

  const columns = [
    columnHelper.accessor("displayName", {
      header: () => <span>Player</span>,
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("numTricksWon", {
      header: () => <span>#Tricks Won</span>,
      cell: (info) => info.getValue(),
    }),
  ];
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <table className="score-table">
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

export default ScoreTable;
