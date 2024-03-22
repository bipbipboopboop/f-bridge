// RoomTable.tsx
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
        navigate(`/rooms/${roomID}`);
      }
      return;
    }
    if (playerAccount.roomID === row.original.roomID) {
      navigate(`/rooms/${playerAccount.roomID}`);
      return;
    }
    if (row.original.players.length >= 4) {
      toast.error("Room is full");
    }
  };

  return (
    <div className="h-[95%] overflow-auto select-none">
      <table className="min-w-full divide-y w-full border-separate border-spacing-y-2">
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
        <tbody className="divide-y">
          {table.getRowModel().rows.map((row) => {
            const isRoomAvailable = !(row.original.players.length >= 4 || row.original.settings.isInviteOnly);
            return (
              <tr
                key={row.id}
                onClick={() => handleRowClick(row)}
                className={`bg-black/5 text-white hover:bg-[#006cb1] cursor-pointer ${
                  isRoomAvailable ? "hover:bg-black/10" : "pointer-events-none"
                }`}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="py-2 px-4 select-text">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default RoomTable;
