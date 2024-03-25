import React, { HTMLAttributes } from "react";

import { useAuth } from "../../../hooks/useAuth";
import { useMediaQuery } from "react-responsive";

import { RestrictedPlayerProvider } from "../../../context/RestrictedPlayerContext";

import MatchPeripheral from "../MatchPeripheral";
import Auction from "./Auction";

const BiddingRoom: React.FC = () => {
  const { playerAccount } = useAuth();
  const currentPlayerId = playerAccount?.id;
  const roomId = playerAccount?.roomID;
  const isPortrait = useMediaQuery({ orientation: "portrait" });

  if (!roomId || !currentPlayerId) {
    return null;
  }

  if (isPortrait) {
    return (
      // <BiddingRoomLandscape
      //   style={{
      //     transform: "rotate(-90deg) translate(-100%, 0)",
      //     transformOrigin: "top left",
      //     width: "100vh",
      //     height: "100vw",
      //     overflowX: "hidden",
      //     position: "absolute",
      //     top: 0,
      //     left: 0,
      //   }}
      // />
      <div className="w-full- h-full flex flex-col justify-center">ROTATE YOUR PHONE</div>
    );
  }

  return <BiddingRoomLandscape />;
};

const BiddingRoomLandscape: React.FC<HTMLAttributes<HTMLDivElement>> = (props) => {
  const { playerAccount } = useAuth();
  const currentPlayerId = playerAccount?.id;
  const roomId = playerAccount?.roomID;
  const isDesktop = useMediaQuery({ minWidth: 930 });

  const desktopStyle = "w-3/4 h-full pt-4";
  const landscapeStyle = "w-full h-full pt-4";

  const orientationStyle = isDesktop ? desktopStyle : landscapeStyle;

  if (!roomId || !currentPlayerId) {
    return null;
  }

  return (
    <RestrictedPlayerProvider roomID={roomId} playerID={currentPlayerId}>
      <div className="flex w-full h-full" {...props}>
        <div className={orientationStyle}>
          <Auction />
          <MatchPeripheral />
        </div>
      </div>
    </RestrictedPlayerProvider>
  );
};

export default BiddingRoom;
