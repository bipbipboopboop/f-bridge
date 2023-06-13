import {memo, useState} from "react";
import GreenButton from "../buttons/button-green";
import useFunctions from "../../hooks/useFunctions";
import {useParams} from "react-router-dom";

const ChatboxInput = () => {
  const {roomID} = useParams();
  const {sendMessage} = useFunctions();
  const [inputMessage, setInputMessage] = useState<string>("");

  console.log("ChatboxInput loaded");
  if (!roomID) return <></>;
  return (
    <div className="chatbox-bottom">
      <input
        type="text"
        className="textbox"
        value={inputMessage}
        onChange={(e) => {
          setInputMessage(e.target.value);
        }}
      />
      <GreenButton
        onClick={async () => {
          await sendMessage({roomID, message: inputMessage});
          console.log("Sent");
          setInputMessage("");
        }}
      >
        Send
      </GreenButton>
    </div>
  );
};

export default memo(ChatboxInput);
