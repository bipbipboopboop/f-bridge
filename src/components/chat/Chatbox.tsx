// Chatbox.tsx
import { memo, useEffect, useRef } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useParams } from "react-router-dom";
import { Message } from "types/Message";
import ChatMessage from "./ChatMessage";
import { CollectionReference, collection, orderBy, query } from "firebase/firestore";
import { firestore } from "../../firebase";
import ChatboxInput from "./ChatboxInput";

const Chatbox: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => {
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
    <div className={`bg-black/10 rounded-lg flex flex-col ${className}`} {...props}>
      <h4 className="font-bold p-4 h-[10%]">Chat</h4>
      <div
        ref={messageListRef}
        className="flex flex-col h-[80%] max-h-[80%] md:h-[85%] md:max-h-[85%] overflow-y-scroll px-4"
      >
        {messageList?.map((message, index) => (
          <ChatMessage message={message} key={index} />
        ))}
      </div>

      <div className="h-[10%] md:h-[5%] px-1 mb-5">
        <ChatboxInput />
      </div>
    </div>
  );
};

export default memo(Chatbox);
