import {GameRoom} from "types/GameRoom";
const RoomSettings = ({room}: {room: GameRoom}) => {
  return (
    <>
      <h4>Settings</h4>
      <div className="w-100">
        <div className="tab">{`Invite Only: ${room.settings.isInviteOnly}`}</div>
        <div className="tab">{`Allow Reshuffle: ${room.settings.isInviteOnly}`}</div>
        <div className="tab">{`Allow Spectator: ${room.settings.isSpectatorAllowed}`}</div>
        <div className="tab">Wait Time: None</div>
        <div className="tab">Max Bid: 4</div>
      </div>
    </>
  );
};

export default RoomSettings;
