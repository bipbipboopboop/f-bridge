import {GameRoom} from "types/GameRoom";
const RoomSettings = ({room}: {room: GameRoom}) => {
  return (
    <>
      <h4>Settings</h4>
      <div style={{border: "1px solid"}}>
        <p>{`Invite Only: ${room.settings.isInviteOnly}`}</p>
        <p>Allow Reshuffle</p>
        <p>Allow Spectator</p>
        <p>Wait Time</p>
        <p>Max Bid</p>
      </div>
    </>
  );
};

export default RoomSettings;
