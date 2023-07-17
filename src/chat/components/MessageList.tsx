import { Row, Spin } from "antd";
import { useSelector } from "react-redux";
import { Message } from "./Message";
import React, { useMemo, useRef, useState } from "react";
import { CurrentChat, Message as IMessage } from "../../types/interfaces";
import { appApi } from "../../api/appApi";
import { useDispatch } from "react-redux";
import { message, pushOlderMessages, setOffset } from "../../store/chat/chatSlice";
import { isSameDay } from "../../helpers/isSameDay";
import { DateTag } from "./DateTag";

interface Props {
    goDownButton: boolean | null,
    setGoDownButton: React.Dispatch<React.SetStateAction<boolean | null>>,
    chatContainerRef: React.MutableRefObject<HTMLDivElement | null>
}

export const MessageList = ({ goDownButton, setGoDownButton, chatContainerRef }: Props) => {

    const dispatch = useDispatch();
    const { id, messages, totalMessageCount, offset } = useSelector((state: any) => state.chat.currentChat) as CurrentChat;
    const [loading, setLoading] = useState(false);
    const nearTopRef = useRef<boolean>(false);
    const messagesLength = useMemo(() => messages.filter((value: IMessage) => value.status === "sent" || !value.status).length, [messages]);

    const handleScroll = async() => {

        const scroll = (chatContainerRef.current?.scrollTop as number) + (chatContainerRef.current?.clientHeight as number);
        const scrollHeight = chatContainerRef.current?.scrollHeight as number;
       
        if(chatContainerRef.current?.scrollTop as number < 200 && !nearTopRef.current && totalMessageCount > messagesLength) {

            setLoading(true);
            nearTopRef.current = true;

            const scrollBottom = (chatContainerRef.current?.scrollHeight as number) - (chatContainerRef.current?.scrollTop as number);

            try {

                const { data } = await appApi.get(`messages/chat/${id}/${offset}`);
    
                setLoading(false);
    
                if(!data.ok) return dispatch(message({ type: "error", message: "There has been an error. Please try again later." }));
    
                dispatch(setOffset(offset+50));
                dispatch(pushOlderMessages(data.messages));

                requestAnimationFrame(() => {

                    const scrollHeight = chatContainerRef.current?.scrollHeight as number;

                    if(chatContainerRef.current) chatContainerRef.current.scrollTop = ((scrollBottom-scrollHeight)*-1);
                });

            } catch (error) {

                dispatch(message({ type: "error", message: "There has been an error. Please try again later." }));
                
            }
            
        }

        if(chatContainerRef.current?.scrollTop as number > 200 && nearTopRef.current) {

            setLoading(false);
            nearTopRef.current = false;

        }

        if(goDownButton && (scroll < (scrollHeight-50))) return;
        if((!goDownButton) && !(scroll < (scrollHeight-50))) return;

        setGoDownButton(scroll < (scrollHeight-50));

    };

    return (
        <div onScroll={ handleScroll } ref={ chatContainerRef } className="chat-container" style={{flexGrow: 1, overflowY: "auto", overflowX: "hidden", padding: "1rem", paddingTop: "2rem", position: "relative"}}>
            <div style={{display: "flex", flexDirection: "column", width: "100%", position: "relative"}}>
                <Row style={{visibility: loading ? "visible" : "hidden", marginBottom: "1rem", marginTop: "1rem", display: totalMessageCount === messagesLength ? "none" : "flex"}} align={"middle"} justify={"center"}>
                    <Spin size="small" />
                </Row>
                {
                    messages.map((value: IMessage, i: number) => {

                        const dateTag = !isSameDay(new Date(value.createdAt), messages[i-1] ? new Date(messages[i-1].createdAt) : new Date(0));

                        return <React.Fragment key={ value._id }>
                            {
                                dateTag
                                    ? (
                                        <Row style={{marginTop: messages[i-1] ? "1rem" : 0, marginBottom: "1rem", position: "sticky", alignSelf: "center", top: "0"}} justify={"center"} align={"middle"}>
                                            <DateTag date={new Date(value.createdAt)} />
                                        </Row>
                                    )
                                    : null
                            }
                            <Message message={value} prev={messages[i-1]} />
                        </React.Fragment>;

                    })
                }
            </div>
        </div>
    );
};
