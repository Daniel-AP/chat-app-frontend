import { Col, Row, Spin } from "antd";

export const Loading = () => {
    return (
        
        <Row style={{height: "100%"}}>
            <Col span={24} style={{height: "100%", display: "flex", justifyContent: "center", alignItems: "center"}}>
                <Spin size="large" />
            </Col>
        </Row>

    );
};
