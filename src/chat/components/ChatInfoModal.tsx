import { Button, Col, Divider, Form, Image, List, Modal, Popconfirm, Row, Skeleton, Typography } from "antd";
import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { CurrentChat } from "../../types/interfaces";
import { useDispatch } from "react-redux";
import { appApi } from "../../api/appApi";
import { addMembers, delChat, delMember, message, setCurrentChat } from "../../store/chat/chatSlice";
import { AdminTag } from "./AdminTag";
import { SearchUsers } from "./SearchUsers";

interface Props {
    modalOpen: boolean,
    setModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}

interface FormData {
    newMembers: []
}

interface SelectOption {
    _id: string,
    name: string,
    email: string,
    photoURL: string
}

const { Title, Text } = Typography;

export const ChatInfoModal = ({ modalOpen, setModalOpen }: Props) => {

    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const uid = useSelector((state: any) => state.auth.uid);
    const chat = useSelector((state: any) => state.chat.currentChat) as CurrentChat;
    const [loading, setLoading] = useState(false);
    const [popLoading, setPopLoading] = useState(false);
    const [loadingSelect, setLoadingSelect] = useState(false);
    const [selectOptions, setSelectOptions] = useState<Array<SelectOption>>([]);
    const [searching, setSearching] = useState<boolean | null>(null);
    const sortedMembers = useMemo(() => {

        return [...chat.members].sort((a: any, b: any) => {

            if (a._id === chat.admin && b._id !== chat.admin) return -1;
            else if (a._id !== chat.admin && b._id === chat.admin) return 1;
            if (a._id === uid && b._id !== uid) return 1;
            else if (a._id !== uid && b._id === uid) return -1;
            else return a.name.localeCompare(b.name);

        });
          

    }, [chat.members]);
    const [data, setData] = useState(sortedMembers.slice(0, 10));
    const createdAt = new Date(chat.createdAt);
    const userAdmin = chat.admin === uid;

    const selectProps = {} as any;
    
    if(!loadingSelect) selectProps.suffixIcon = (
        <svg className="animate__animated animate__fadeIn animate__faster" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width={20} height={20}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
    );

    const handleSubmit = async(values: FormData) => {

        if(!values.newMembers?.length) return;

        try {

            setLoadingSelect(true);

            const newMembersUids = values.newMembers.map((value: string) => {

                const parsedValue = JSON.parse(value);

                return parsedValue.id;

            });

            const newMembers = values.newMembers.map((value: string) => {

                const parsedValue = JSON.parse(value);

                return {
                    ...parsedValue,
                    _id: parsedValue.id
                };

            });

            const { data } = await appApi.put(`/chats/update/${chat.id}`, {
                members: [...chat.members.map((value) => value._id), ...newMembersUids]
            });

            setLoadingSelect(false);

            if(!data.ok) return dispatch(message({ type: "error", message: "There has been an error. Please try again later." }));
            
            setSearching(false);

            setData([...chat.members, ...newMembers].sort((a: any, b: any) => {

                if (a._id === chat.admin && b._id !== chat.admin) return -1;
                else if (a._id !== chat.admin && b._id === chat.admin) return 1;
                if (a._id === uid && b._id !== uid) return 1;
                else if (a._id !== uid && b._id === uid) return -1;
                else return a.name.localeCompare(b.name);
    
            }));

            dispatch(addMembers(newMembers));

        } catch (error) {

            dispatch(message({ type: "error", message: "There has been an error. Please try again later." }));
            
        }

    };

    const handleSearch = async(value: string) => {

        if(!value) return;

        try {

            setLoadingSelect(true);

            const { data } = await appApi.get(`/search/${value}`);

            setLoadingSelect(false);

            if(!data.ok) return dispatch(message({ type: "error", message: "There has been an error. Please try again later." }));

            const members = chat.members.map((member) => member._id);
            const options = data.users.filter((value: SelectOption) => !(members.includes(value._id)));

            setSelectOptions(options);
            
        } catch (error) {

            setLoadingSelect(false);

            dispatch(message({ type: "error", message: "There has been an error. Please try again later." }));
            
        }

    };

    const handleBlur = () => {

        setSelectOptions([]);

    };

    const handleLeave = async() => {

        try {

            setLoading(true);

            const { data } = await appApi.delete(`chats/del/${chat.id}/user/${uid}`);

            setLoading(false);

            if(!data.ok) return dispatch(message({ type: "error", message: "There has been an error. Please try again later." }));
            
            dispatch(delChat(chat.id));
            setModalOpen(false);

            setTimeout(() => {

                dispatch(setCurrentChat(null));

            }, 300);


        } catch (error) {

            dispatch(message({ type: "error", message: "There has been an error. Please try again later." }));
            
        }

    };

    const handleCancel = () => {

        setModalOpen(false);
        setSearching(false);
        form.resetFields();

    };

    const handleRemoveParticipant = async(id: string) => {

        try {

            setPopLoading(true);

            const { data } = await appApi.delete(`chats/del/${chat.id}/user/${id}`);

            setPopLoading(false);

            if(!data.ok) return dispatch(message({ type: "error", message: "There has been an error. Please try again later." }));
            
            dispatch(delMember(id));
            setData((data) => sortedMembers.filter((value) => value._id !== id).slice(0, data.length));

        } catch (error) {

            dispatch(message({ type: "error", message: "There has been an error. Please try again later." }));
            
        }

    };

    const handleActions = (item: { _id: string, name: string, email: string, photoURL: string }) => {

        if(userAdmin && item._id !== uid) return [
            <Popconfirm onConfirm={ () => handleRemoveParticipant(item._id) } okButtonProps={{loading: popLoading}} title="Remove participant" description="Are you sure to remove this participant?" icon={
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="red" width={20} height={20}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
    
            }>
                <Button shape="circle" type="ghost" size="middle">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width={17} height={17}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                </Button>
            </Popconfirm>
        ];

        return [];

    };

    const loadMore = (
        <>
            {
                data.length < chat.members.length
                    ? (
                        <Row justify={"center"} align={"middle"}>
                            <Button onClick={() => setData(chat.members)}>Show more</Button>
                        </Row>
                    )
                    : (
                        null
                    )
            }
        </>
    );

    return (
        <Modal
            style={{marginTop: "2rem", marginBottom: "1rem"}}
            title="Chat information"
            open={ modalOpen }
            centered
            footer={null}
            onCancel={ handleCancel }
            closeIcon={ <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width={24} height={24}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            }
        >
            <Row>
                <Col span={24}>
                    <Row justify={"center"}>
                        {
                            chat.members.slice(0, 3).map((member, i) => {

                                return <React.Fragment key={i}>
                                    {
                                        member.photoURL
                                            ? (
                                                <Image
                                                    key={i}
                                                    width={100}
                                                    height={100}
                                                    preview={false}
                                                    wrapperStyle={{marginLeft: i > 0 ? "-5rem" : "0"}}
                                                    style={{borderRadius: "50%", border: "1px solid #ffffffba"}}
                                                    src={member.photoURL}
                                                    placeholder={
                                                        <Skeleton.Avatar active size={100} shape="circle" />
                                                    }
                                                />
                                            )
                                            : (
                                                <svg style={{marginLeft: i > 0 ? "-5rem" : "0"}} viewBox="0 0 212 212" height="100" width="100">
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
                </Col>
                <Col span={24}>
                    <Row justify={"center"}>
                        <Title level={4}>{ chat.name }</Title>
                    </Row>
                </Col>
                <Col span={24}>
                    <Row justify={"center"}>
                        <Text type="secondary">{ chat.members.length > 2 ? "Group" : "Chat" } • { chat.members.length } participants</Text>
                    </Row>
                </Col>
            </Row>
            <Divider />
            <Row style={{minHeight: 40}}>
                {
                    searching
                        ? (
                            <Col span={24}>
                                <Form
                                    form={form}
                                    className="animate__animated animate__fadeIn animate__faster"
                                    name="searchParticipants"
                                    labelCol={{span: 24}}
                                    wrapperCol={{span: 24}}
                                    autoComplete="off"
                                    style={{width: "100%"}}
                                    onFinish={ handleSubmit }
                                >
                                    <Row style={{flexWrap: "nowrap"}}>
                                        <Button style={{marginRight: ".5rem"}} onClick={() => setSearching(false)} htmlType="button" type="ghost" icon={
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width={24} height={24}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75" />
                                            </svg>
                                          
                                        }/>
                                        <Form.Item style={{width: "100%", margin: 0}} name="newMembers">
                                            <SearchUsers
                                                props={{
                                                    autoFocus: true,
                                                    loading: loadingSelect,
                                                    maxLength: 1,
                                                    onSearch: handleSearch,
                                                    onBlur: handleBlur,
                                                    onChange: (selected: any) => form.setFieldsValue({ newMembers: selected?.slice(0, 25-chat.members.length) }),
                                                    ...selectProps
                                                }}
                                                options={selectOptions}
                                            />
                                        </Form.Item>
                                        <Button htmlType="submit" style={{marginLeft: ".5rem"}} type="primary" shape="circle" icon={
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width={24} height={24}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                            </svg>
                                        }/>
                                    </Row>
                                </Form>
                            </Col>
                        )
                        : (
                            <Col span={24} className={"animate__animated animate__fadeIn animate__faster"}>
                                <Row align={"middle"} justify={"space-between"}>
                                    <Text type="secondary">{`Created ${ createdAt.toLocaleDateString() }`}</Text>
                                    <Button onClick={ () => setSearching(true) } type="primary" shape="circle" icon={
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width={24} height={24}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
                                        </svg>
                                    }/>
                                </Row>
                            </Col>
                        )
                }
            </Row>
            <Row style={{marginTop: "1rem"}}>
                <Col span={24}>
                    <List
                        itemLayout="horizontal"
                        loadMore={ loadMore }
                        dataSource={ data }
                        renderItem={(item) => (
                            <List.Item
                                actions={ handleActions(item) }
                            >
                                <List.Item.Meta
                                    avatar={<>
                                        {
                                            item.photoURL
                                                ? (
                                                    <Image
                                                        preview={{mask: null}}
                                                        onClick={ (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => e.stopPropagation() }
                                                        style={{borderRadius: "50%", cursor: "pointer"}}
                                                        width={45}
                                                        height={45}
                                                        src={item.photoURL}
                                                        placeholder={
                                                            <Skeleton.Avatar active size={45} shape="circle" />
                                                        }
                                                    />
                                                )
                                                : (
                                                    <svg viewBox="0 0 212 212" height="45" width="45">
                                                        <path fill="#DFE5E7" d="M106.251,0.5C164.653,0.5,212,47.846,212,106.25S164.653,212,106.25,212C47.846,212,0.5,164.654,0.5,106.25 S47.846,0.5,106.251,0.5z"></path>
                                                        <g>
                                                            <path fill="#FFFFFF" d="M173.561,171.615c-0.601-0.915-1.287-1.907-2.065-2.955c-0.777-1.049-1.645-2.155-2.608-3.299 c-0.964-1.144-2.024-2.326-3.184-3.527c-1.741-1.802-3.71-3.646-5.924-5.47c-2.952-2.431-6.339-4.824-10.204-7.026 c-1.877-1.07-3.873-2.092-5.98-3.055c-0.062-0.028-0.118-0.059-0.18-0.087c-9.792-4.44-22.106-7.529-37.416-7.529 s-27.624,3.089-37.416,7.529c-0.338,0.153-0.653,0.318-0.985,0.474c-1.431,0.674-2.806,1.376-4.128,2.101 c-0.716,0.393-1.417,0.792-2.101,1.197c-3.421,2.027-6.475,4.191-9.15,6.395c-2.213,1.823-4.182,3.668-5.924,5.47 c-1.161,1.201-2.22,2.384-3.184,3.527c-0.964,1.144-1.832,2.25-2.609,3.299c-0.778,1.049-1.464,2.04-2.065,2.955 c-0.557,0.848-1.033,1.622-1.447,2.324c-0.033,0.056-0.073,0.119-0.104,0.174c-0.435,0.744-0.79,1.392-1.07,1.926 c-0.559,1.068-0.818,1.678-0.818,1.678v0.398c18.285,17.927,43.322,28.985,70.945,28.985c27.678,0,52.761-11.103,71.055-29.095 v-0.289c0,0-0.619-1.45-1.992-3.778C174.594,173.238,174.117,172.463,173.561,171.615z"></path>
                                                            <path fill="#FFFFFF" d="M106.002,125.5c2.645,0,5.212-0.253,7.68-0.737c1.234-0.242,2.443-0.542,3.624-0.896 c1.772-0.532,3.482-1.188,5.12-1.958c2.184-1.027,4.242-2.258,6.15-3.67c2.863-2.119,5.39-4.646,7.509-7.509 c0.706-0.954,1.367-1.945,1.98-2.971c0.919-1.539,1.729-3.155,2.422-4.84c0.462-1.123,0.872-2.277,1.226-3.458 c0.177-0.591,0.341-1.188,0.49-1.792c0.299-1.208,0.542-2.443,0.725-3.701c0.275-1.887,0.417-3.827,0.417-5.811 c0-1.984-0.142-3.925-0.417-5.811c-0.184-1.258-0.426-2.493-0.725-3.701c-0.15-0.604-0.313-1.202-0.49-1.793 c-0.354-1.181-0.764-2.335-1.226-3.458c-0.693-1.685-1.504-3.301-2.422-4.84c-0.613-1.026-1.274-2.017-1.98-2.971 c-2.119-2.863-4.646-5.39-7.509-7.509c-1.909-1.412-3.966-2.643-6.15-3.67c-1.638-0.77-3.348-1.426-5.12-1.958 c-1.181-0.355-2.39-0.655-3.624-0.896c-2.468-0.484-5.035-0.737-7.68-0.737c-21.162,0-37.345,16.183-37.345,37.345 C68.657,109.317,84.84,125.5,106.002,125.5z"></path>
                                                        </g>
                                                    </svg>
                                                )
                                        }
                                    </>
                                    }
                                    title={
                                        <>
                                            <span>
                                                {
                                                    item._id !== uid
                                                        ? `~${item.name}`
                                                        : "You"
                                                }
                                            </span>
                                            {
                                                item._id === chat.admin
                                                    ? <AdminTag />
                                                    : null
                                            }
                                        </>
                                    }
                                    description={item.email}
                                />
                            </List.Item>
                        )}
                    />
                </Col>
            </Row>
            <Row style={{marginTop: "1.5rem"}}>
                <Button
                    onClick={ handleLeave }
                    loading={loading ? {delay: 200} : false}
                    style={{display: "flex", alignItems: "center", justifyContent: "center", width: "100%"}}
                    danger
                    icon={
                        <svg style={{marginRight: ".5rem"}} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width={20} height={20}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                        </svg>
                    }
                >
                    Leave
                </Button>
            </Row>
        </Modal>
    );
};