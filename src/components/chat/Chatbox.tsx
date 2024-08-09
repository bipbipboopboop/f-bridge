import { memo, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Message } from "types/Message";
import ChatMessage from "./ChatMessage";
import { ref, query, orderByChild } from "firebase/database";
import { database } from "../../firebase";
import ChatboxInput from "./ChatboxInput";
import { useList } from "react-firebase-hooks/database";

const Chatbox: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => {
  const { roomID } = useParams();
  const messagesRef = ref(database, `gameRooms/${roomID}/messages`);
  const messagesQuery = query(messagesRef, orderByChild("createdAt"));
  const [messageSnapshots, loading, error] = useList(messagesQuery);

  const messageListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messageSnapshots]);

  return (
    <div className={`bg-black/10 rounded-lg flex flex-col ${className}`} {...props}>
      <h4 className="font-bold p-4 h-[10%]">Chat</h4>
      <div ref={messageListRef} className="flex flex-col h-[80%] max-h-[80%] overflow-y-scroll px-4">
        {messageSnapshots?.map((snapshot) => (
          <ChatMessage message={snapshot.val() as Message} key={snapshot.key} />
        ))}
      </div>
      <div className="h-[10%] px-2 mb-5">
        <ChatboxInput />
      </div>
    </div>
  );
};

export default memo(Chatbox);
