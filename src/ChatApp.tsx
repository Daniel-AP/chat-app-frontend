import { ConfigProvider } from "antd";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { AppRouter } from "./router/AppRouter";

export const ChatApp = () => {
    return (

        <ConfigProvider componentSize="large" theme={{
            token: {
                colorPrimary: "#4287f5",
            },
        }}>
            <Provider store={store}>
                <AppRouter />
            </Provider>
        </ConfigProvider>

    );
};