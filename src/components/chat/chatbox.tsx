import {memo, useEffect, useRef} from "react";
import {useCollectionData} from "react-firebase-hooks/firestore";
import {useParams} from "react-router-dom";

import "./chat.css";
import {Message} from "types/Chat";
import ChatMessage from "./chatbox-message";

import {CollectionReference, collection, orderBy, query} from "firebase/firestore";
import {firestore} from "../../firebase";
import ChatboxInput from "./chatbox-input";

const Chatbox = () => {
  const {roomID} = useParams();
  const messagesCollection = collection(firestore, `gameRooms/${roomID}/messages`) as CollectionReference<Message>;
  const messagesQuery = query(messagesCollection, orderBy("createdAt", "asc"));

  const [messageList, isLoading, error] = useCollectionData<Message>(messagesQuery);

  const focus = useRef<HTMLSpanElement>(document.createElement("span"));

  useEffect(() => {
    console.log("cursor moved");
    focus.current.scrollIntoView({behavior: "smooth"});
  }, [messageList]);

  console.log("Chat loaded");

  return (
    <div className="chatbox">
      <h4>Chat</h4>
      <div className="message-list">
        {messageList?.map((message, index) => (
          <ChatMessage message={message} key={index} />
        ))}
        <span ref={focus}></span>
      </div>

      <ChatboxInput />
    </div>
  );
};

export default memo(Chatbox);
