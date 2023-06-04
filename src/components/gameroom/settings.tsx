import {GameRoom} from "types/GameRoom";
const RoomSettings = ({room}: {room: GameRoom}) => {
  return (
    <>
      <h4>Settings</h4>
      <div className="w-100">
        <div className="tab">{`Invite Only: ${room.settings.isInviteOnly}`}</div>
        <div className="tab">Allow Reshuffle</div>
        <div className="tab">Allow Spectator</div>
        <div className="tab">Wait Time</div>
        <div className="tab">Max Bid</div>
      </div>
    </>
  );
};

export default RoomSettings;
