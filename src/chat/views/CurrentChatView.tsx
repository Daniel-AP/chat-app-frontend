import { useSelector } from "react-redux";
import { CurrentChat } from "../../types/interfaces";
import { useEffect, useRef, useState } from "react";
import { TopChatView } from "../components/TopChatView";
import { MessageList } from "../components/MessageList";
import { InputChatView } from "../components/InputChatView";

export const CurrentChatView = () => {

    const { id } = useSelector((state: any) => state.chat.currentChat) as CurrentChat;
    const [goDownButton, setGoDownButton] = useState<boolean | null>(null);
    const chatContainerRef = useRef<HTMLDivElement | null>(null);

    const scrollDown = () => {

        chatContainerRef.current?.scrollTo({
            top: chatContainerRef.current?.scrollHeight,
            behavior: "smooth",
        });

    };

    useEffect(() => {

        requestAnimationFrame(() => {
            chatContainerRef.current?.scrollTo({
                top: chatContainerRef.current?.scrollHeight,
                behavior: "instant"
            });
        });

        setGoDownButton(null);

    }, [id]);

    return (
        <div key={ id } className="animate__animated animate__fadeIn animate__faster" style={{height: "100%", display: "flex", flexDirection: "column", width: "100%"}}>
            <TopChatView />
            <MessageList
                chatContainerRef={ chatContainerRef }
                goDownButton={ goDownButton }
                setGoDownButton={ setGoDownButton }
            />
            <InputChatView
                goDownButton={ goDownButton }
                scrollDown={ scrollDown }
            />            
        </div>
    );
};
