import {memo} from "react";
import {useCollectionData} from "react-firebase-hooks/firestore";
import {useParams} from "react-router-dom";

import "./chat.css";
import {Message} from "types/Chat";
import ChatMessage from "./chat.message";

import {CollectionReference, collection, orderBy, query} from "firebase/firestore";
import {firestore} from "../../firebase";
import ChatboxInput from "./chatbox-input";

const Chatbox = () => {
  const {roomID} = useParams();
  const messagesCollection = collection(firestore, `gameRooms/${roomID}/messages`) as CollectionReference<Message>;
  const messagesQuery = query(messagesCollection, orderBy("createdAt", "asc"));

  const [messageList, isLoading, error] = useCollectionData<Message>(messagesQuery);

  console.log("Chat loaded");

  return (
    <div className="chatbox">
      <h4>Chat</h4>
      <div className="h-75" style={{overflowY: "scroll"}}>
        {messageList?.map((message, index) => (
          <ChatMessage message={message} key={index} />
        ))}
      </div>
      <ChatboxInput />
    </div>
  );
};

export default memo(Chatbox);
