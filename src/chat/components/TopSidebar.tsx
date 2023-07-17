import { Col, Row, Space, Button, Dropdown, MenuProps, Typography, Form, Input } from "antd";
import { CreateChatModal } from "./CreateChatModal";
import { useSelector } from "react-redux";
import { Chat } from "../../types/interfaces";
import { useDispatch } from "react-redux";
import { reset, setFilteredChats, toggleSearchingChats } from "../../store/chat/chatSlice";
import { useState } from "react";
import { UserInfoModal } from "./UserInfoModal";
import { useNavigate } from "react-router-dom";
import { logout } from "../../store/auth/authSlice";

const { Title } = Typography;

export const TopSidebar = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const searching = useSelector((state: any) => state.chat.searchingChats);
    const chats = useSelector((state: any) => state.chat.chats);
    const [createChatModalOpen, setCreateChatModalOpen] = useState(false);
    const [userInfoModalOpen, setUserInfoModalOpen] = useState(false);

    const handleLogOut = () => {

        dispatch(logout());
        dispatch(reset());
        localStorage.removeItem("token");
        navigate("/auth/login");

    };
    
    const toggleSearching = () => {
        
        dispatch(toggleSearchingChats());
        dispatch(setFilteredChats(chats));
        
    };
    
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        
        const filteredChats = chats.filter((chat: Chat) => {
            
            return chat.name.startsWith(e.target.value);
            
        });
        
        dispatch(setFilteredChats(filteredChats));
        
    };

    const items: MenuProps["items"] = [
        {
            label: <a onClick={ () => setUserInfoModalOpen(true) } style={{fontSize: "1rem", paddingRight: "2rem", width: "100%"}}>Account</a>,
            key: "0"
        },
        {
            label: <a onClick={ handleLogOut } style={{fontSize: "1rem", paddingRight: "2rem", width: "100%"}}>Log out</a>,
            key: "1"
        },
    ];

    return (
        <Col span={24} style={{flexBasis: "auto"}}>
            <Row align={"middle"} justify={"space-between"} style={{paddingInline: ".75rem", backgroundColor: "#669cf6", overflow: "hidden", height: "70px"}}>
                {
                    searching
                        ? (
                            <Form
                                className="animate__animated animate__fadeIn animate__faster"
                                name="search"
                                labelCol={{span: 24}}
                                wrapperCol={{span: 24}}
                                autoComplete="off"
                                style={{width: "100%"}}
                            >
                                <Input onChange={ handleSearch } onBlur={ toggleSearching } style={{width: "100%"}} autoFocus placeholder="Search..." suffix={
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#0505053d" width={20} height={20}>
                                        <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z" clipRule="evenodd" />
                                    </svg>
                                } />
                            </Form>
                        )
                        : (
                            <>
                                <Title className="animate__animated animate__fadeIn animate__faster" style={{marginTop: "1rem", marginBottom: "1rem"}} level={2}>Chats</Title>
                                <Space className={`animate__animated ${ searching === null ? "animate__slideInRight" : "animate__fadeIn" } animate__faster`} size={"small"} direction="horizontal">
                                    <Button onClick={ toggleSearching } type="primary" shape="circle" icon={
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width={24} height={24}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                                        </svg>
                                    }/>
                                    <Button onClick={ () => setCreateChatModalOpen(true) } type="primary" shape="circle" icon={
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width={24} height={24}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                        </svg>
                                    }/>
                                    <Dropdown menu={{items}} trigger={["click"]}>
                                        <Button type="primary" shape="circle" icon={
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width={24} height={24}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
                                            </svg>
                                        }/>
                                    </Dropdown>
                                    <CreateChatModal modalOpen={ createChatModalOpen } setModalOpen={ setCreateChatModalOpen } />
                                    <UserInfoModal modalOpen={ userInfoModalOpen } setModalOpen={ setUserInfoModalOpen } />
                                </Space>
                            </>
                        )
                }
            </Row>
        </Col>
    );
};
