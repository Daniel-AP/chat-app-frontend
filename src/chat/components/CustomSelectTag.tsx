import { Row, Tag, Typography } from "antd";
import type { CustomTagProps } from "rc-select/lib/BaseSelect";

const { Text } = Typography;

export const CustomSelectTag = ({ value, onClose }: CustomTagProps) => {

    return (
        <Tag
            onClose={onClose}
            style={{backgroundColor: "white", border: "1px solid #ededed"}}
        >
            <Row align={"middle"} style={{padding: ".3rem", backgroundColor: "white"}}>
                <Text>{ JSON.parse(value).label }</Text>
                <div style={{display: "flex", alignItems: "center", marginLeft: ".5rem", cursor: "pointer"}} onClick={ onClose }>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width={15} height={15}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </div>
            </Row>
        </Tag>
    );
};
