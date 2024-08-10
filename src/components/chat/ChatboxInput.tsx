import { ChangeEvent, FormEvent, memo, useState } from "react";
import { useParams } from "react-router-dom";
import Button from "../buttons/Button";
import { ref, push, serverTimestamp } from "firebase/database";
import { database } from "../../firebase";
import { Message } from "types/Message";
import { useAuth } from "../../hooks/useAuth";

const ChatboxInput = () => {
  const { roomID } = useParams();
  const { playerAccount } = useAuth();
  const [inputMessage, setInputMessage] = useState<string>("");

  if (!roomID || !playerAccount) return null;

  const onChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    setInputMessage(e.target.value);
  };

  const onSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    const messagesRef = ref(database, `gameRooms/${roomID}/messages`);
    const message: Message = {
      createdAt: serverTimestamp() as any as number,
      playerName: playerAccount.displayName,
      uid: playerAccount.id,
      text: inputMessage,
      type: "chat",
    };
    const result = await push(messagesRef, message);
    console.log({ result });
    setInputMessage("");
  };

  return (
    <form onSubmit={onSendMessage} className="flex items-center h-full">
      <input
        type="text"
        value={inputMessage}
        onChange={onChangeInput}
        className="w-[80%] mr-[2%] py-2 md:py-3 rounded border border-gray-300 text-gray-700 text-2xs md:text-sm"
      />
      <Button theme="green" size={1} type="submit" disabled={!inputMessage}>
        Send
      </Button>
    </form>
  );
};

export default memo(ChatboxInput);
