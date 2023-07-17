import { Empty, Row } from "antd";

export const EmptyView = () => {
    return (
        <Row className="animate__animated animate__fadeIn animate__faster" style={{height: "100%"}} align={"middle"} justify={"center"}>
            <Empty
                description={"Select a chat and start messaging"}
            />
        </Row>
    );
}
;