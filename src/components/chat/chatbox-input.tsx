import { ChangeEvent, FormEvent, memo, useState } from "react";
import { useParams } from "react-router-dom";
import Button from "../buttons/button";
import { CollectionReference, Timestamp, addDoc, collection } from "firebase/firestore";
import { firestore } from "../../firebase";
import { Message } from "types/Chat";
import { useAuth } from "../../hooks/useAuth";

const ChatboxInput = () => {
  const { roomID } = useParams();
  const { playerProfile } = useAuth();
  // const { sendMessage } = useFunctions();
  const [inputMessage, setInputMessage] = useState<string>("");

  const messagesCollection = collection(firestore, `gameRooms/${roomID}/messages`) as CollectionReference<Message>;

  // console.log("ChatboxInput loaded");
  if (!roomID) return <></>;
  if (!playerProfile) return <></>;

  const onChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    setInputMessage(e.target.value);
  };

  const onSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    // await sendMessage({ roomID, message: inputMessage });
    await addDoc(messagesCollection, {
      createdAt: Timestamp.now(),
      playerName: playerProfile!.displayName,
      uid: playerProfile!.id,
      text: inputMessage,
    });
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
