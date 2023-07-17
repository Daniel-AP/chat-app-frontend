import { Route, Routes } from "react-router-dom";
import { Chat } from "../pages/Chat";

export const ChatRoutes = () => {
    return (
        <Routes>
            <Route path="/*" element={ <Chat/> } />
        </Routes>
    );
};
