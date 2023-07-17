import { Col, Row, notification, Grid, Spin } from "antd";
import { PropsWithChildren, useEffect } from "react";
import { useSelector } from "react-redux";
import { Sidebar } from "../components/Sidebar";

const { useBreakpoint } = Grid;

export const ChatLayout = ({ children }: PropsWithChildren) => {

    const currentChat = useSelector((state: any) => state.chat.currentChat);
    const loading = useSelector((state: any) => state.chat.loading);
    const messageApp = useSelector((state: any) => state.chat.message);
    const [notificationApi, contextHolder] = notification.useNotification({
        maxCount: 1
    });
    const screens = useBreakpoint();

    useEffect(() => {

        if(messageApp) notificationApi.open({

            type: messageApp.type,
            message: messageApp.message,
            placement: screens.lg ? "topRight" : "top",
            closeIcon: (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width={24} height={24}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            ),
            icon: messageApp.type === "error" ?
                (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#FF0000" width={27} height={27}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                )
                : undefined
        });

    }, [messageApp]);

    return (
        <>
            { contextHolder }
            <Row className="animate__animated animate__fadeIn animate__fast" style={{height: "100%"}}>
                <Spin size="large" spinning={loading}>
                    <Row style={{height: "100%"}}>
                        <Col style={{height: "100%"}} xs={currentChat ? 0 : 24} md={10} lg={8} xl={6}>
                            <Sidebar />
                        </Col>
                        <Col style={{height: "100%"}} xs={currentChat ? 24 : 0} md={14} lg={16} xl={18}>
                            { children }
                        </Col>
                    </Row>
                </Spin>
            </Row>
        </>
    );
};
