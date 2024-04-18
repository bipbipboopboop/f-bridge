import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { HttpsCallableResult } from "firebase/functions";

import { Row } from "@tanstack/react-table";

import { RestrictedAccountInfo } from "types/Account";
import { GameRoom } from "types/Room";

export const checkCanJoinRoom = (
  playerAccount: RestrictedAccountInfo | null,
  joinGameRoom: (data?: string | undefined) => Promise<HttpsCallableResult<void> | undefined>,
  navigate: ReturnType<typeof useNavigate>
) => {
  return async (row: Row<GameRoom>) => {
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
};
