import { Col, Row, Grid, notification } from "antd";
import React, { PropsWithChildren, useEffect } from "react";
import { useSelector } from "react-redux";

const { useBreakpoint } = Grid;

export const AuthLayout = ({ children }: PropsWithChildren) => {

    const errorMessage = useSelector((state: any) => state.auth.errorMessage);
    const screens = useBreakpoint();
    const [notificationApi, contextHolder] = notification.useNotification({
        maxCount: 1
    });

    useEffect(() => {

        if(errorMessage) notificationApi.error({

            message: errorMessage.message,

            placement: screens.lg ? "topRight" : "top",

            closeIcon: (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width={24} height={24}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            ),

            icon: (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#FF0000" width={27} height={27}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            )

        });

    }, [errorMessage]);

    return (
        <>
            { contextHolder }
            <Row className="animate__animated animate__fadeIn animate__fast" style={{height: "100%"}} align={"middle"} justify={"center"}>
                <Col xs={24} sm={18} md={12} lg={10} xl={8}
                    style={{
                        backgroundColor: "white",
                        borderRadius: "1rem",
                        boxShadow: "0px 10px 28px 0px rgba(0,0,0,0.2)"
                    }}
                >
                    { children }
                </Col>
            </Row>
        </>
    );
};
