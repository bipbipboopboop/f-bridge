import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {BidSnapshot, GameState} from "types/GameState";

const BiddingInfo = (props: {gameroom: GameState}) => {
  const gameroom = props.gameroom;

  const data = gameroom.biddingPhase!.bidHistory;
  const columnHelper = createColumnHelper<BidSnapshot>();

  const columns = [
    columnHelper.accessor("p0", {
      header: () => (
        <span>
          {gameroom.biddingPhase?.gameroomPlayersList.at(0)!.displayName}
        </span>
      ),
      cell: (info) => {
        const bid = info.getValue().bid;
        return bid ? `${bid.number + bid.suit}` : "Pass";
      },
    }),
    columnHelper.accessor("p1", {
      header: () => (
        <span>
          {gameroom.biddingPhase?.gameroomPlayersList.at(1)!.displayName}
        </span>
      ),
      cell: (info) => {
        const bid = info.getValue().bid;
        return bid ? `${bid.number + bid.suit}` : "Pass";
      },
    }),
    columnHelper.accessor("p2", {
      header: () => (
        <span>
          {gameroom.biddingPhase?.gameroomPlayersList.at(2)!.displayName}
        </span>
      ),
      cell: (info) => {
        const bid = info.getValue().bid;
        return bid ? `${bid.number + bid.suit}` : "Pass";
      },
    }),
    columnHelper.accessor("p3", {
      header: () => (
        <span>
          {gameroom.biddingPhase?.gameroomPlayersList.at(3)!.displayName}
        </span>
      ),
      cell: (info) => {
        const bid = info.getValue().bid;
        return bid ? `${bid.number + bid.suit}` : "Pass";
      },
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

export default BiddingInfo;
