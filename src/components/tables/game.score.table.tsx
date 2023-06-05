import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {GameScore} from "types/GameRoom";
import "./game.score.table.css";
const ScoreTable = () => {
  const data: GameScore[] = [
    {
      playerID: "1",
      numTricksWon: 0,
      position: 0,
    },
    {
      playerID: "2",
      numTricksWon: 0,
      position: 1,
    },
    {
      playerID: "3",
      numTricksWon: 0,
      position: 2,
    },
    {
      playerID: "4",
      numTricksWon: 0,
      position: 3,
    },
  ];

  const columnHelper = createColumnHelper<GameScore>();

  const columns = [
    columnHelper.accessor("playerID", {
      header: () => <span>Player ID</span>,
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

export default ScoreTable;
