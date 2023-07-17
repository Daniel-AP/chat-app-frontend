import { Button, Col, Dropdown, Grid, Image, MenuProps, Row, Skeleton, Typography } from "antd";
import { useDispatch } from "react-redux";
import { setCurrentChat } from "../../store/chat/chatSlice";
import { useSelector } from "react-redux";
import { CurrentChat } from "../../types/interfaces";
import React, { useMemo, useState } from "react";
import { ChatInfoModal } from "./ChatInfoModal";

const { useBreakpoint } = Grid;
const { Title, Text } = Typography;

export const TopChatView = () => {

    const dispatch = useDispatch();
    const screens = useBreakpoint();
    const [modalOpen, setModalOpen] = useState(false);
    const uid = useSelector((state: any) => state.auth.uid);
    const { id, name, userTyping, members } = useSelector((state: any) => state.chat.currentChat) as CurrentChat;
    const sortedMembers = useMemo(() => {

        return [...members].sort((a: any, b: any) => {

            if (a._id === uid && b._id !== uid) return 1;
            else if (a._id !== uid && b._id === uid) return -1;
            else return a.name.localeCompare(b.name);

        });

    }, [members]);
    const participantsText = useMemo(() => sortedMembers.map((member: { _id: string, name: string }) => member._id !== uid ? `~${member.name}` : "You").join(", "), [members]);

    const items: MenuProps["items"] = [
        {
            label: <a onClick={ () => setModalOpen(true) } style={{fontSize: "1rem", paddingRight: "2rem"}}>Chat information</a>,
            key: "0"
        },
        {
            label: <a onClick={ () => dispatch(setCurrentChat(null)) } style={{fontSize: "1rem", paddingRight: "2rem"}}>Close</a>,
            key: "1"
        }
    ];

    const handleBack = () => {

        dispatch(setCurrentChat(undefined));

    };

    return (
        <div style={{ zIndex: "10", border: 0, borderBottom: "1px solid #7fafff", }}>
            <Row align={"middle"} style={{backgroundColor: "#669cf6", height: "70px", paddingLeft: ".5rem", paddingRight: ".5rem", flexWrap: "nowrap"}}>
                <Col style={{marginRight: ".5rem"}}>
                    {
                        screens.md
                            ? (
                                <Row style={{flexWrap: "nowrap"}}>
                                    {
                                        members.slice(0, 3).map((member, i) => {

                                            return <React.Fragment key={i}>
                                                {
                                                    member.photoURL
                                                        ? (
                                                            <Image
                                                                width={50}
                                                                height={50}
                                                                preview={false}
                                                                wrapperStyle={{marginLeft: i > 0 ? "-2.5rem" : "0"}}
                                                                style={{borderRadius: "50%", border: "1px solid #ffffffba"}}
                                                                src={member.photoURL}
                                                                placeholder={
                                                                    <Skeleton.Avatar active size={50} shape="circle" />
                                                                }
                                                            />
                                                        )
                                                        : (
                                                            <svg style={{marginLeft: i > 0 ? "-2.5rem" : "0"}} viewBox="0 0 212 212" height="50" width="50">
                                                                <path fill="#DFE5E7" d="M106.251,0.5C164.653,0.5,212,47.846,212,106.25S164.653,212,106.25,212C47.846,212,0.5,164.654,0.5,106.25 S47.846,0.5,106.251,0.5z"></path>
                                                                <g>
                                                                    <path fill="#FFFFFF" d="M173.561,171.615c-0.601-0.915-1.287-1.907-2.065-2.955c-0.777-1.049-1.645-2.155-2.608-3.299 c-0.964-1.144-2.024-2.326-3.184-3.527c-1.741-1.802-3.71-3.646-5.924-5.47c-2.952-2.431-6.339-4.824-10.204-7.026 c-1.877-1.07-3.873-2.092-5.98-3.055c-0.062-0.028-0.118-0.059-0.18-0.087c-9.792-4.44-22.106-7.529-37.416-7.529 s-27.624,3.089-37.416,7.529c-0.338,0.153-0.653,0.318-0.985,0.474c-1.431,0.674-2.806,1.376-4.128,2.101 c-0.716,0.393-1.417,0.792-2.101,1.197c-3.421,2.027-6.475,4.191-9.15,6.395c-2.213,1.823-4.182,3.668-5.924,5.47 c-1.161,1.201-2.22,2.384-3.184,3.527c-0.964,1.144-1.832,2.25-2.609,3.299c-0.778,1.049-1.464,2.04-2.065,2.955 c-0.557,0.848-1.033,1.622-1.447,2.324c-0.033,0.056-0.073,0.119-0.104,0.174c-0.435,0.744-0.79,1.392-1.07,1.926 c-0.559,1.068-0.818,1.678-0.818,1.678v0.398c18.285,17.927,43.322,28.985,70.945,28.985c27.678,0,52.761-11.103,71.055-29.095 v-0.289c0,0-0.619-1.45-1.992-3.778C174.594,173.238,174.117,172.463,173.561,171.615z"></path>
                                                                    <path fill="#FFFFFF" d="M106.002,125.5c2.645,0,5.212-0.253,7.68-0.737c1.234-0.242,2.443-0.542,3.624-0.896 c1.772-0.532,3.482-1.188,5.12-1.958c2.184-1.027,4.242-2.258,6.15-3.67c2.863-2.119,5.39-4.646,7.509-7.509 c0.706-0.954,1.367-1.945,1.98-2.971c0.919-1.539,1.729-3.155,2.422-4.84c0.462-1.123,0.872-2.277,1.226-3.458 c0.177-0.591,0.341-1.188,0.49-1.792c0.299-1.208,0.542-2.443,0.725-3.701c0.275-1.887,0.417-3.827,0.417-5.811 c0-1.984-0.142-3.925-0.417-5.811c-0.184-1.258-0.426-2.493-0.725-3.701c-0.15-0.604-0.313-1.202-0.49-1.793 c-0.354-1.181-0.764-2.335-1.226-3.458c-0.693-1.685-1.504-3.301-2.422-4.84c-0.613-1.026-1.274-2.017-1.98-2.971 c-2.119-2.863-4.646-5.39-7.509-7.509c-1.909-1.412-3.966-2.643-6.15-3.67c-1.638-0.77-3.348-1.426-5.12-1.958 c-1.181-0.355-2.39-0.655-3.624-0.896c-2.468-0.484-5.035-0.737-7.68-0.737c-21.162,0-37.345,16.183-37.345,37.345 C68.657,109.317,84.84,125.5,106.002,125.5z"></path>
                                                                </g>
                                                            </svg>
                                                        )
                                                }
                                            </React.Fragment>;
                                        })
                                    }
                                </Row>
                            )
                            : (
                                <Button onClick={ handleBack } style={{backgroundColor: "transparent", border: 0, boxShadow: "none", color: "white"}} shape="circle" icon={
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width={24} height={24}>
                                        <path fillRule="evenodd" d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z" clipRule="evenodd" />
                                    </svg>
                                } />
                            )
                    }
                </Col>
                <Col flex={"auto"} style={{minWidth: 0}}>
                    <Row>
                        <Col span={24}>
                            <Title style={{margin: 0}} ellipsis level={4}>{ name }</Title>
                        </Col>
                        <Col span={24}>
                            <Text key={ userTyping.uid || id } className="animate__animated animate__fadeIn animate__faster" style={{color: "#efefef", width: "100%"}} ellipsis>
                                {
                                    userTyping.uid
                                        ? (
                                            `${userTyping.name} is typing...`
                                        )
                                        : (
                                            participantsText
                                        )
                                }
                            </Text>
                        </Col>
                    </Row>
                </Col>
                <Col style={{marginLeft: "1rem"}}>
                    <Dropdown menu={{items}} trigger={["click"]}>
                        <Button type="primary" shape="circle" icon={
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width={24} height={24}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
                            </svg>
                        }/>
                    </Dropdown>
                </Col>
                <ChatInfoModal modalOpen={ modalOpen } setModalOpen={ setModalOpen } />
            </Row>
        </div>
    );
};