import { TopSidebar } from "./TopSidebar";
import { ChatList } from "./ChatList";

export const Sidebar = () => {
    return (
        <div style={{display: "flex", flexDirection: "column", height: "100%", overflowX: "hidden", overflowY: "auto", borderRight: "2px solid #0505050f", zIndex: 20}}>
            <TopSidebar />
            <ChatList />
        </div>
    );
};
