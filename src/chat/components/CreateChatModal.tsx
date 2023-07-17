import { Button, Form, Input, Modal } from "antd";
import { appApi } from "../../api/appApi";
import { addChat, message } from "../../store/chat/chatSlice";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { useSelector } from "react-redux";
import { SearchUsers } from "./SearchUsers";

interface FormData {
    name: string,
    members: []
}

interface SelectOption {
    _id: string,
    name: string,
    email: string,
    photoURL: string
}

interface Props {
    modalOpen: boolean,
    setModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export const CreateChatModal = ({ modalOpen, setModalOpen }: Props) => {

    const dispatch = useDispatch();
    const uid = useSelector((state: any) => state.auth.uid);
    const [loadingSelect, setLoadingSelect] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectOptions, setSelectOptions] = useState<Array<SelectOption>>([]);
    const [form] = Form.useForm();

    const selectProps = {} as any;
    
    if(!loadingSelect) selectProps.suffixIcon = (
        <svg className="animate__animated animate__fadeIn animate__faster" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width={20} height={20}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
    );

    const handleSubmit = async(values: FormData) => {

        try {

            setLoading(true);

            const members = values.members.map((value: string) => {

                const parsedValue = JSON.parse(value);

                return parsedValue.id;

            });

            const { data } = await appApi.post("chats/new", {
                name: values.name,
                members: [...members, uid]
            });

            setLoading(false);

            if(!data.ok) return dispatch(message({ type: "error", message: "There has been an error. Please try again later." }));

            dispatch(addChat({
                _id: data._id,
                name: data.name,
                members: data.members
            }));

            dispatch(message({type: "success", message: "Your new chat has been successfully created."}));

            handleCancel();
            
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

            setSelectOptions(data.users);
            
        } catch (error) {

            setLoadingSelect(false);

            dispatch(message({ type: "error", message: "There has been an error. Please try again later." }));
            
        }

    };

    const handleBLur = async() => {

        setSelectOptions([]);

    };

    const handleCancel = () => {

        setModalOpen(false);
        form.resetFields();

    };

    return (
        <Modal
            title="Create new chat"
            open={modalOpen}
            centered
            footer={null}
            onCancel={ handleCancel }
            closeIcon={ <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width={24} height={24}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            }
        >
            <Form
                form={form}
                name="new"
                labelCol={{span: 24}}
                wrapperCol={{span: 24}}
                autoComplete="off"
                onFinish={handleSubmit}
            >
                <Form.Item
                    style={{marginTop: "1rem"}}
                    name="name"
                    rules={[
                        { required: true, message: "This field is required." },
                        { min: 6, message: "The name needs to have at least 6 characters." },
                        { max: 15, message: "The name can have at most 15 characters."}
                    ]}
                >
                    <Input placeholder="Name" />
                </Form.Item>
                <Form.Item
                    name="members"
                    rules={[
                        { required: true, message: "This field is required."}
                    ]}
                >
                    <SearchUsers
                        props={{
                            loading: loadingSelect,
                            onSearch: handleSearch,
                            onBlur: handleBLur,
                            onChange: (selected: any) => form.setFieldsValue({ members: selected?.slice(0, 25) }),
                            ...selectProps
                        }}
                        options={ selectOptions }
                    />
                </Form.Item>
                <Button loading={loading ? {delay: 200} : false} style={{width: "100%"}} type="primary" htmlType="submit">Create</Button>
            </Form>
        </Modal>
    );
};
