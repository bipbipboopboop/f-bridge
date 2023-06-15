import {ChangeEvent, FormEvent, memo, useState} from "react";
import GreenButton from "../buttons/button-green";
import useFunctions from "../../hooks/useFunctions";
import {useParams} from "react-router-dom";

const ChatboxInput = () => {
  const {roomID} = useParams();
  const {sendMessage} = useFunctions();
  const [inputMessage, setInputMessage] = useState<string>("");

  console.log("ChatboxInput loaded");
  if (!roomID) return <></>;

  const onChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    setInputMessage(e.target.value);
  };

  const onSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    await sendMessage({roomID, message: inputMessage});
    console.log("Sent");
    setInputMessage("");
  };

  return (
    <form className="chatbox-bottom" onSubmit={onSendMessage}>
      <input type="text" className="textbox" value={inputMessage} onChange={onChangeInput} />
      <GreenButton type="submit" disabled={!inputMessage}>
        Send
      </GreenButton>
    </form>
  );
};

export default memo(ChatboxInput);
