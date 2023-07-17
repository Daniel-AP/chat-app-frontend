import { Row, Spin, Typography } from "antd";
import { useEffect, useState } from "react";
import { appApi } from "../../api/appApi";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { message, setChats, setFilteredChats } from "../../store/chat/chatSlice";
import { Chat } from "./Chat";

const { Text } = Typography;

export const ChatList = () => {

    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const chats = useSelector((state: any) => state.chat.filteredChats);
    const uid = useSelector((state: any) => state.auth.uid);

    useEffect(() => {

        const getChatsFromCurrentUser = async() => {

            try {

                const { data } = await appApi.get(`/chats/user/${uid}`);

                setLoading(false);

                if(!data.ok) return dispatch(message({ type: "error", message: "There has been an error. Please try again later." }));

                dispatch(setChats(data.chats));
                dispatch(setFilteredChats(data.chats));
                
            } catch (error) {

                setLoading(false);

                dispatch(message({ type: "error", message: "There has been an error. Please try again later." }));
                
            }

        };

        getChatsFromCurrentUser();

    }, []);

    return (
        <Row align={"middle"} justify={"center"}>
            {
                loading
                    ? (
                        <Spin style={{marginTop: "3rem"}} size="default" />
                    )
                    : chats.length > 0 ? (
                        <>
                            {
                                chats.map((value: { _id: string, name: string, members: any[], lastMessage: any, userTyping: any }, i: number) => {

                                    return <Chat key={value._id} chat={{ ...value, i }} />;

                                })
                            }
                        </>
                    )
                        : (
                            <Text className="animate__animated animate__fadeIn animate__fast" type="secondary" style={{textAlign: "center", width: "100%", fontSize: "1rem", marginTop: "1rem"}}>No chats</Text>
                        )
            }
        </Row>
    );
};
