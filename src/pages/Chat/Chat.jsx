import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getChats } from "../../API";
import ChatCard from "../../components/ChatCard/ChatCard";
import useFetch from "../../hooks/useFetch";
import Online from "../../components/Online/Online";
import Messenger from "../../components/Messenger/Messenger";
import "./chat.css";

const Chat = () => {
   const {
      user: { token },
      modal: { isSidebarVisible },
   } = useSelector(state => state);

   const [chats, setChats] = useState([]);
   const customFetch = useFetch();

   useEffect(() => {
      (async () => {
         const data = await customFetch(getChats, token);
         if (data) setChats(data.chat);
      })();
   }, [customFetch, token]);

   return (
      <main className="chat__page">
         <section className="chat__page__cards">
            {chats.map(chat => (
               <ChatCard chat={chat} key={chat._id} />
            ))}
         </section>
         <Messenger />
         <article className={isSidebarVisible ? "singlepost__right visible" : "singlepost__right"}>
            <Online />
         </article>
      </main>
   );
};

export default Chat;
