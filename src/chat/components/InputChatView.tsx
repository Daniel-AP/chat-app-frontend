import { Button, Form, Input, Row } from "antd";
import { useDispatch } from "react-redux";
import { pushNewMessage } from "../../store/chat/chatSlice";
import { useSelector } from "react-redux";
import { useContext, useRef, useState } from "react";
import { SocketContext } from "../../socket/SocketContext";

interface Props {
    goDownButton: boolean | null,
    scrollDown: () => void
}

interface FormData {
    message: string
}

export const InputChatView = ({ goDownButton, scrollDown }: Props) => {

    const dispatch = useDispatch();
    const socketContext = useContext(SocketContext);
    const socket = socketContext?.socket;
    const [form] = Form.useForm();
    const { uid, name } = useSelector((state: any) => state.auth);
    const { id: chatId, name: chatName } = useSelector((state: any) => state.chat.currentChat);
    const [timeoutTyping, setTimeoutTyping] = useState<ReturnType<typeof setTimeout> | undefined>(undefined);
    const inputValueRef = useRef<string>("");

    const handleSubmit = (values: FormData) => {

        if(!values.message) return;
        if(!values.message.trim().length) return;

        form.resetFields();

        const clientId = Date.now();

        dispatch(pushNewMessage({
            _id: clientId,
            content: values.message,
            status: "loading",
            createdAt: Date.now(),
            userId: {
                _id: uid,
                name
            }          
        }));

        socket?.emit("newMessage", {
            uid,
            chat: {
                id: chatId,
                name: chatName
            },
            jwt: localStorage.getItem("token"),
            message: {
                clientId,
                content: values.message
            }
        });

        requestAnimationFrame(() => {

            scrollDown();

        });

    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {

        if(inputValueRef.current.length > e.target.value.length) {
            inputValueRef.current = e.target.value;
            return;
        }

        socket?.emit("userTyping", {
            uid,
            chatId,
            name,
            jwt: localStorage.getItem("token")
        });

        inputValueRef.current = e.target.value;

        clearTimeout(timeoutTyping);

        setTimeoutTyping(setTimeout(() => {

            socket?.emit("userNotTyping", {
                uid,
                chatId: chatId,
                jwt: localStorage.getItem("token")
            });

        }, 1000));

    };

    return (
        <div style={{position: "relative"}}>
            <Row align={"middle"} style={{ border: "2px solid #0505050f", borderLeft: 0, paddingTop: ".5rem", paddingBottom: ".5rem", paddingRight: ".5rem"}}>
                <Form
                    form={ form }
                    name="chat"
                    labelCol={{span: 24}}
                    wrapperCol={{span: 24}}
                    autoComplete="off"
                    style={{width: "100%"}}
                    onFinish={ handleSubmit }
                >
                    <Row style={{flexWrap: "nowrap"}} align={"middle"}>
                        <Form.Item
                            name={"message"}
                            style={{width: "100%", margin: 0, marginRight: ".5rem"}}
                        >
                            <Input.TextArea
                                onChange={ handleChange }
                                bordered={false}
                                autoSize={{minRows: 1, maxRows: 3}}
                                autoFocus
                                placeholder="Message..."
                                style={{width: "100%"}}
                            />
                        </Form.Item>
                        <Button type="primary" htmlType="submit" shape="circle" icon={
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width={24} height={24}>
                                <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                            </svg>
                        } />
                    </Row>
                </Form>
            </Row>
            <div className={`animate__animated animate__faster ${ goDownButton ? "animate__fadeIn" : "animate__fadeOut" }`} style={{pointerEvents: !goDownButton ? "none" : "auto", position: "absolute", right: 30, bottom: "calc(100% + 1.5rem)"}}>
                <Button style={{border: "1px solid #7fafff"}} onClick={ scrollDown } type="primary" shape="circle" icon={
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width={24} height={24}>
                        <path fillRule="evenodd" d="M12 3.75a.75.75 0 01.75.75v13.19l5.47-5.47a.75.75 0 111.06 1.06l-6.75 6.75a.75.75 0 01-1.06 0l-6.75-6.75a.75.75 0 111.06-1.06l5.47 5.47V4.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
                    </svg>
                } />
            </div>
        </div>
    );
};
