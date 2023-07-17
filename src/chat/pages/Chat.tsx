import { useSelector } from "react-redux";
import { ChatLayout } from "../layout/ChatLayout";
import { CurrentChatView } from "../views/CurrentChatView";
import { EmptyView } from "../views/EmptyView";
import { SocketConnection } from "../../socket/SocketConnection";

export const Chat = () => {

    const currentChat = useSelector((state: any) => state.chat.currentChat);

    return (
        <SocketConnection>
            <ChatLayout>
                {
                    currentChat
                        ? (
                            <CurrentChatView />
                        )
                        : (
                            <EmptyView />
                        )
                }
            </ChatLayout>
        </SocketConnection>
    );
};
