import {createColumnHelper, flexRender, getCoreRowModel, useReactTable} from "@tanstack/react-table";

import {BidSnapshot, BiddingPhase} from "types/GameState";
import "./bidding-table.css";

const BiddingTable = (props: {biddingPhase: BiddingPhase}) => {
  const biddingPhase = props.biddingPhase;

  const data = biddingPhase!.bidHistory;
  const columnHelper = createColumnHelper<BidSnapshot>();

  const columns = [
    columnHelper.accessor("p0", {
      header: () => <span>{biddingPhase.gameroomPlayersList[0]!.displayName}</span>,
      cell: (info) => {
        const bid = info.getValue().bid;

        return !bid ? <></> : bid.isPass ? "Pass" : `${bid.number + bid.suit}`;
      },
    }),
    columnHelper.accessor("p1", {
      header: () => <span>{biddingPhase.gameroomPlayersList[1]!.displayName}</span>,
      cell: (info) => {
        const bid = info.getValue().bid;
        return !bid ? <></> : bid.isPass ? "Pass" : `${bid.number + bid.suit}`;
      },
    }),
    columnHelper.accessor("p2", {
      header: () => <span>{biddingPhase?.gameroomPlayersList[2]!.displayName}</span>,
      cell: (info) => {
        const bid = info.getValue().bid;
        return !bid ? <></> : bid.isPass ? "Pass" : `${bid.number + bid.suit}`;
      },
    }),
    columnHelper.accessor("p3", {
      header: () => <span>{biddingPhase.gameroomPlayersList[3]!.displayName}</span>,
      cell: (info) => {
        const bid = info.getValue().bid;
        return !bid ? <></> : bid.isPass ? "Pass" : `${bid.number + bid.suit}`;
      },
    }),
  ];
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  return (
    <table className="bidding-table">
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
              <td key={cell.id}>
                <span>{flexRender(cell.column.columnDef.cell, cell.getContext())}</span>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default BiddingTable;
