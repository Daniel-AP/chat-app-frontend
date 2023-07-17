import { useSelector } from "react-redux";
import { Message as IMessage } from "../../types/interfaces";
import { Button, Grid, Image, Popconfirm, Row, Skeleton, Typography } from "antd";
import { useContext, useState } from "react";
import { SocketContext } from "../../socket/SocketContext";
import { isMessageWithEmoji } from "../../helpers/isMessageWithEmoji";

interface Props {
    message: IMessage,
    prev: IMessage | undefined
}

const { useBreakpoint } = Grid;
const { Paragraph, Text } = Typography;

export const Message = ({ message, prev }: Props) => {

    const socketContext = useContext(SocketContext);
    const socket = socketContext?.socket;

    const uid = useSelector((state: any) => state.auth.uid);
    const currentChatId = useSelector((state: any) => state.chat.currentChat.id);

    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const screens = useBreakpoint();

    const hasEmojis = isMessageWithEmoji(message.content);
    const prevAndCurrentSameUser = prev?.userId._id === message.userId._id;
    const prevMessageOwn = prev?.userId._id === uid;
    const ownMessage = message.userId._id === uid;
    const messageDate = new Date(message.createdAt);
    const timeString = `${messageDate.toLocaleTimeString(undefined, { minute: "2-digit", hour: "2-digit", hour12: true })}`.toLowerCase();

    const handleOk = () => {

        setLoading(true);

        socket?.emit("delMessage", {
            uid,
            chatId: currentChatId,
            messageId: message._id,
            jwt: localStorage.getItem("token")
        });

        setTimeout(() => setOpen(false), 200);

    };

    const handleCancel = () => {

        setOpen(false);

    };

    return (
        <div style={{display: "flex", maxWidth: screens.lg ? "55%" : "85%", marginLeft: ownMessage ? "auto" : prevAndCurrentSameUser ? "40px" : "", marginRight: !ownMessage ? "auto" : "initial", marginTop: !prev ? "0" : (prevMessageOwn === ownMessage) && prevAndCurrentSameUser ? ".25rem" : "1rem"}}>
            {
                !prevAndCurrentSameUser && !ownMessage
                    ? (
                        <Image
                            width={35}
                            height={35}
                            preview={false}
                            wrapperStyle={{
                                marginRight: "5px"
                            }}
                            style={{marginBottom: "auto", minWidth: "35px", borderRadius: "50%"}}
                            src={message.userId.photoURL}
                            placeholder={
                                <Skeleton.Avatar active size={35} shape="circle" />
                            }
                        />
                    )
                    : null
            }
            <div style={{display: "flex", width: "100%", flexDirection: "column", gap: ".15rem"}}>
                {
                    !prevAndCurrentSameUser && !ownMessage
                        ? (
                            <span>{ message.userId.name }</span>
                        )
                        : null
                }
                <div style={{backgroundColor: ownMessage ? "#669cf6" : "whitesmoke", padding: ".75rem", paddingBottom: ".5rem", borderRadius: "5px", display: "flex", flexDirection: "column", border: !ownMessage ? "1px solid #e8e8e873" : ""}}>
                    <Paragraph style={{margin: 0, textAlign: hasEmojis && message.content.length <= 2 ? "center" : "left", fontSize: hasEmojis && message.content.length <= 2 ? "2.5rem" : hasEmojis ? "18px" : "14px"}} ellipsis={{rows: 25, expandable: true, symbol: <span style={{color: ownMessage ? "white" : "#1677ff"}}>more</span>}}>
                        { message.content }
                    </Paragraph>
                    <Row align={"middle"} justify={ownMessage ? "space-between" : "end"}>
                        {
                            ownMessage && message.status !== "failed"
                                ? (
                                    <Popconfirm open={open} okButtonProps={{loading}} onCancel={ handleCancel } onConfirm={handleOk} title="Delete message" description="Are you sure to delete this message?">
                                        <Button disabled={message.status === "loading"} onClick={() => setOpen(true)} style={{marginRight: ".5rem"}} size="middle" type="primary" shape="circle" icon={
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width={15} height={15}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                            </svg>
                                        } />
                                    </Popconfirm>
                                )
                                : (
                                    null
                                )
                        }
                        <Row align={"middle"}>
                            <Text style={{textAlign: "right", color: ownMessage ? "#dbe9ff" : "#00000073", marginRight: ".25rem", fontSize: "12px"}}>{ timeString }</Text>
                            {
                                ownMessage
                                    ? (
                                        message.status === "loading"
                                            ? (
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke={ownMessage ? "#afcdff" : "#00000073"} width={15} height={15}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            )
                                            : (
                                                (message.status === "sent") || !message.status
                                                    ? (
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke={ownMessage ? "#afcdff" : "#00000073"} width={15} height={15}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                                        </svg>
                                                    )
                                                    : (
            
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke={ownMessage ? "#afcdff" : "#00000073"} width={15} height={15}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                                                        </svg>
                                                    )
                                            )
                                    )
                                    : null
                            }
                        </Row>
                    </Row>
                </div>
            </div>
        </div>
    );
};
