import { PropsWithChildren, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { delMessage, delTypingUser, message, pushNewMessage, updateMessage, setTypingUser, setLoading, updateLastMessage, setOffset, setTotalMessageCount } from "../store/chat/chatSlice";
import { useSelector } from "react-redux";
import { Chat } from "../types/interfaces";
import { Socket, io } from "socket.io-client";
import { getEnvVariables } from "../helpers/getEnvVariables";
import { SocketContext } from "./SocketContext";
import { store } from "../store/store";

export const SocketConnection = ({ children }: PropsWithChildren) => {

    const envVariables = useMemo(() => getEnvVariables(), []);
    const dispatch = useDispatch();
    const uid = useSelector((state: any) => state.auth.uid);
    const [lastUserTypingByChat, setLastUserTypingByChat] = useState<{[chatId: string]: number}>({});
    const [socket, setSocket] = useState<Socket | null>(null);

    const handleErrors = () => {

        dispatch(message({ type: "error", message: "There has been an error. Please try again later." }));

    };

    const handleUserTyping = (data: { chatId: string, user: { uid: string, name: string } }) => {

        const chats = store.getState().chat.chats as Chat[];
        const indexTargetChat = chats.findIndex((value: Chat) => data.chatId === value._id);

        if(chats[indexTargetChat].userTyping?.uid === data.user.uid) return;
        if((lastUserTypingByChat[data.chatId]+3000) > Date.now() && chats[indexTargetChat].userTyping) return;

        setLastUserTypingByChat((prev: any) => ({ ...prev, [data.chatId]: Date.now() }));
        dispatch(setTypingUser(data));

    };

    const handleUserNotTyping = (data: string) => {

        dispatch(delTypingUser(data));

    };

    const handleIncomingMessage = (data: { _id: string, content: string, chat: { id: string, name: string }, createdAt: string, userId: any }) => {

        dispatch(updateLastMessage({ chatId: data.chat.id, content: {
            _id: data._id,
            content: data.content,
            chatId: data.chat.id,
            createdAt: data.createdAt,
            userId: data.userId,
        } }));

        if(data.chat.id === store.getState().chat.currentChat?.id) {

            dispatch(pushNewMessage({
                _id: data._id,
                content: data.content,
                chatId: data.chat.id,
                createdAt: data.createdAt,
                userId: data.userId,
            }));

            dispatch(setOffset(store.getState().chat.currentChat?.offset as number+1));
            dispatch(setTotalMessageCount(store.getState().chat.currentChat?.totalMessageCount as number+1));

        }

        else {

            const truncatedMessage = data.content.length > 55 ? `${data.chat.name}: ${data.content.slice(0, 55)}...` : `${data.chat.name}: ${data.content}`;

            dispatch(message({ type: "info", message: truncatedMessage }));

        }

    };

    const handleMessageResponse = (data: { ok: boolean, _id: string, content: string, chatId: string, createdAt: string, userId: object, clientId: number }) => {

        if(data.chatId === store.getState().chat.currentChat?.id) {

            dispatch(updateMessage({
                id: data.clientId,
                info: {
                    status: data.ok ? "sent" : "failed"
                }
            }));

            if(data.ok) {

                dispatch(updateMessage({
                    id: data.clientId,
                    info: {
                        _id: data._id,
                        chatId: data.chatId,
                        createdAt: data.createdAt,
                        userId: data.userId
                    }
                }));

                dispatch(updateLastMessage({ chatId: data.chatId, content: {
                    _id: data._id,
                    content: data.content,
                    chatId: data.chatId,
                    createdAt: data.createdAt,
                    userId: data.userId,
                } }));

                dispatch(setOffset(store.getState().chat.currentChat?.offset as number+1));
                dispatch(setTotalMessageCount(store.getState().chat.currentChat?.totalMessageCount as number+1));

            }

        }

    };

    const handleDeletedMessage = (data: { chatId: string, id: string, lastMessage: object | undefined }) => {

        dispatch(delMessage(data.id));
        dispatch(updateLastMessage({
            chatId: data.chatId,
            content: data.lastMessage
        }));

        dispatch(setOffset(store.getState().chat.currentChat?.offset as number-1));
        dispatch(setTotalMessageCount(store.getState().chat.currentChat?.totalMessageCount as number-1));

    };

    const handleDelMessageResponse = (data: { ok: boolean, chatId: string, id: string, lastMessage: object | undefined }) => {

        if(data.chatId === store.getState().chat.currentChat?.id) {

            if(data.ok) {

                dispatch(delMessage(data.id));
                dispatch(updateLastMessage({
                    chatId: data.chatId,
                    content: data.lastMessage
                }));

                dispatch(setOffset(store.getState().chat.currentChat?.offset as number-1));
                dispatch(setTotalMessageCount(store.getState().chat.currentChat?.totalMessageCount as number-1));

            } else {

                dispatch(message({ type: "error", message: "There has been an error. Please try again later." }));

            }

        }

    };

    useEffect(() => {

        const socketInstance = io(envVariables.VITE_SOCKET_URL as string, {
            query: {
                uid
            }
        });

        socketInstance.on("connect", () => dispatch(setLoading(false)));

        socketInstance.on("error", handleErrors);
        socketInstance.on("connect_error", handleErrors);
        socketInstance.on("connect_failed", handleErrors);
        
        socketInstance.on("userTyping", handleUserTyping);
        socketInstance.on("userNotTyping", handleUserNotTyping);
        socketInstance.on("incomingMessage", handleIncomingMessage);
        socketInstance.on("newMessageResponse", handleMessageResponse);
        socketInstance.on("messageDeleted", handleDeletedMessage);
        socketInstance.on("delMessageResponse", handleDelMessageResponse);

        setSocket(socketInstance);

        return () => {

            socketInstance.disconnect();

        };

    }, []);

    return (
        <>
            <SocketContext.Provider value={{ socket }}>
                { children }
            </SocketContext.Provider>
        </>
    );
};
