import { Button, Form, Input, Typography } from "antd";
import { AuthLayout } from "../layout/AuthLayout";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { error, login } from "../../store/auth/authSlice";
import { appApi } from "../../api/appApi";

const { Title, Text } = Typography;

interface FormData {
    email: string,
    password: string
}

export const LogIn = () => {

    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async(values: FormData) => {

        try {

            setLoading(true);

            const { data } = await appApi.post("/auth/login", {
                email: values.email,
                password: values.password
            });

            setLoading(false);

            if(!data.ok) return dispatch(error({id: Date.now(), message: "There has been an error. Please try again later."}));

            dispatch(login({
                uid: data._id,
                name: data.name,
                email: data.email,
                photoURL: data.photoURL,
                createdAt: data.createdAt
            }));

            localStorage.setItem("token", data.jwt);
            
        } catch (e) {

            dispatch(error({id: Date.now(), message: "There has been an error. Please try again later."}));
            
        }

    };
    
    return (
        <AuthLayout>
            <Title style={{textAlign: "center"}} level={2}>Log in</Title>
            <Form
                style={{padding: "2rem"}}
                name="login"
                labelCol={{span: 24}}
                wrapperCol={{span: 24}}
                autoComplete="off"
                onFinish={handleSubmit}
            >
                <Form.Item
                    label={ <span style={{fontSize: "1.1rem"}}>Email</span> }
                    name="email"
                    rules={[
                        { required: true, message: "This field is required." },
                        { pattern: /^\w+([-+."]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/, message: "E-mail not valid." }
                    ]}
                >
                    <Input placeholder="email@gmail.com" />
                </Form.Item>
                <Form.Item
                    label={ <span style={{fontSize: "1.1rem"}}>Password</span> }
                    name="password"
                    rules={[
                        { required: true, message: "This field is required." },
                        { min: 6, message: "The name needs to have at least 6 characters." },
                        { max: 15, message: "The name can have at most 15 characters."}
                    ]}
                >
                    <Input.Password placeholder="Password" />
                </Form.Item>
                <Button loading={loading ? {delay: 200} : false} htmlType="submit" type="primary" style={{width: "100%", marginBottom: "1rem"}}>Log in</Button>
                <Text style={{width: "100%", display: "block", textAlign: "end"}}>Don't have an account? <Link to={"/auth/signup"}>Sign up</Link></Text>
            </Form>
        </AuthLayout>
    );
};
