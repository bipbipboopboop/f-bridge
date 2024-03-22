// ChatboxInput.tsx
import { ChangeEvent, FormEvent, memo, useState } from "react";
import { useParams } from "react-router-dom";
import Button from "../buttons/button";
import { CollectionReference, Timestamp, addDoc, collection } from "firebase/firestore";
import { firestore } from "../../firebase";
import { Message } from "types/Message";
import { useAuth } from "../../hooks/useAuth";

const ChatboxInput = () => {
  const { roomID } = useParams();
  const { playerAccount } = useAuth();
  const [inputMessage, setInputMessage] = useState<string>("");
  const messagesCollection = collection(firestore, `gameRooms/${roomID}/messages`) as CollectionReference<Message>;

  if (!roomID || !playerAccount) return null;

  const onChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    setInputMessage(e.target.value);
  };

  const onSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    await addDoc(messagesCollection, {
      createdAt: Timestamp.now(),
      playerName: playerAccount.displayName,
      uid: playerAccount.id,
      text: inputMessage,
    });
    setInputMessage("");
  };

  return (
    <form onSubmit={onSendMessage} className="flex items-center">
      <input
        type="text"
        value={inputMessage}
        onChange={onChangeInput}
        className="w-[80%] mr-[2%] h-full rounded border border-gray-300 text-gray-700 text-2xs md:text-sm"
      />
      <Button theme="green" size={1} type="submit" disabled={!inputMessage}>
        Send
      </Button>
    </form>
  );
};

export default memo(ChatboxInput);
