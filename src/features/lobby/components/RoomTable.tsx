// RoomTable.tsx
import { useNavigate } from "react-router-dom";
import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { GameRoom } from "types/Room";
import { useAuth } from "../../../hooks/useAuth";
import { useFunctions } from "../../../hooks/useFunctions";
import { rowColumns } from "./RoomTableConfig";

import { checkCanJoinRoom } from "../utils";

interface RoomTableProps {
  gameRoomList: GameRoom[];
}

const RoomTable: React.FC<RoomTableProps> = ({ gameRoomList }) => {
  const navigate = useNavigate();
  const { playerAccount } = useAuth();
  const { joinGameRoom } = useFunctions();

  const table = useReactTable({
    data: gameRoomList,
    columns: rowColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleRowClick = checkCanJoinRoom(playerAccount, joinGameRoom, navigate);

  return (
    <table className="divide-y w-full border-separate border-spacing-y-2">
      <thead className="sticky top-0 z-10">
        {table.getHeaderGroups().map((headerGroup, index) => (
          <tr key={index} className="bg-[#006cb1] text-white">
            {headerGroup.headers.map((header, index) => (
              <th key={index} className="py-2 px-4 text-left text-2xs md:text-base">
                {flexRender(header.column.columnDef.header, header.getContext())}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row, index) => {
          const isRoomAvailable = !(row.original.players.length >= 4 || row.original.settings.isInviteOnly);
          return (
            <tr
              key={index}
              onClick={() => handleRowClick(row)}
              className={`bg-black/5 text-white hover:bg-[#006cb1] cursor-pointer ${
                isRoomAvailable ? "hover:bg-black/10" : "pointer-events-none"
              }`}
            >
              {row.getVisibleCells().map((cell, index) => (
                <td key={index} className="py-2 px-4 select-text text-2xs md:text-base">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default RoomTable;
