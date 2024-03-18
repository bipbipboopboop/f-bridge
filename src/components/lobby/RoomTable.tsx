import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Row, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";

import { GameRoom } from "types/Room";

import { useAuth } from "../../hooks/useAuth";
import { useFunctions } from "../../hooks/useFunctions";

import { rowColumns } from "./RoomTableConfig";

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

  const handleRowClick = async (row: Row<GameRoom>) => {
    if (row.original.settings.isInviteOnly) return;
    if (!playerAccount) return;
    if (!playerAccount.roomID) {
      const roomID = row.original.roomID;
      const success = await joinGameRoom(roomID);
      if (success) {
        toast.success("Successfully joined room");
        navigate(`/party/${roomID}`);
      }
      return;
    }

    if (playerAccount.roomID === row.original.roomID) {
      navigate(`/party/${playerAccount.roomID}`);
      return;
    }

    if (row.original.players.length >= 4) {
      toast.error("Room is full");
    }
  };

  return (
    <table className="w-full border-separate border-spacing-y-2">
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id} className="bg-[#006cb1] text-white">
            {headerGroup.headers.map((header) => (
              <th key={header.id} className="py-2 px-4 text-left">
                {flexRender(header.column.columnDef.header, header.getContext())}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr
            key={row.id}
            className={`bg-black/5 text-white hover:bg-[#006cb1] cursor-pointer ${
              row.original.settings.isInviteOnly || row.original.players.length >= 4 ? "opacity-50 cursor-default" : ""
            }`}
            onClick={() => handleRowClick(row)}
          >
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id} className="py-2 px-4">
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
