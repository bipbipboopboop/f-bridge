import {ChangeEvent, FormEvent, memo, useState} from "react";
import useFunctions from "../../hooks/useFunctions";
import {useParams} from "react-router-dom";
import Button from "../buttons/button";

const ChatboxInput = () => {
  const {roomID} = useParams();
  const {sendMessage} = useFunctions();
  const [inputMessage, setInputMessage] = useState<string>("");

  // console.log("ChatboxInput loaded");
  if (!roomID) return <></>;

  const onChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    setInputMessage(e.target.value);
  };

  const onSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    await sendMessage({roomID, message: inputMessage});
    // console.log("Sent");
    setInputMessage("");
  };

  return (
    <form className="chatbox-bottom" onSubmit={onSendMessage}>
      <input type="text" className="textbox" value={inputMessage} onChange={onChangeInput} />
      <Button theme="green" type="submit" disabled={!inputMessage}>
        Send
      </Button>
    </form>
  );
};

export default memo(ChatboxInput);
