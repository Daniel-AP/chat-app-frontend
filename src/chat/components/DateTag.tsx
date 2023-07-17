import { Tag } from "antd";
import { isSameDay } from "../../helpers/isSameDay";

interface Props {
    date: Date
}

export const DateTag = ({ date }: Props) => {

    const today = new Date();

    return (
        <Tag style={{fontWeight: "normal", marginLeft: ".5rem", color: "black"}} color="#c9ddff">
            { isSameDay(today, date) ? "Today" : date.toLocaleDateString() }
        </Tag>
    );
};