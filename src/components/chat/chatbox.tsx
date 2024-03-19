// Chatbox.tsx
import { memo, useEffect, useRef } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useParams } from "react-router-dom";
import { Message } from "types/Message";
import ChatMessage from "./ChatMessage";
import { CollectionReference, collection, orderBy, query } from "firebase/firestore";
import { firestore } from "../../firebase";
import ChatboxInput from "./ChatboxInput";

const Chatbox = () => {
  const { roomID } = useParams();
  const messagesCollection = collection(firestore, `gameRooms/${roomID}/messages`) as CollectionReference<Message>;
  const messagesQuery = query(messagesCollection, orderBy("createdAt", "asc"));
  const [messageList] = useCollectionData<Message>(messagesQuery);
  const messageListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messageList]);

  return (
    <div className="bg-black/10 p-4 rounded-lg h-full w-full flex flex-col text-sm">
      <div className="h-5/6 pt-5">
        <h4 className="text-lg font-bold mb-2">Chat</h4>
        <div ref={messageListRef} className="flex flex-col max-h-[95%] overflow-y-scroll">
          {messageList?.map((message, index) => (
            <ChatMessage message={message} key={index} />
          ))}
        </div>
      </div>
      <div className="h-1/6 flex flex-col-reverse">
        <ChatboxInput />
      </div>
    </div>
  );
};

export default memo(Chatbox);
