export const isSameDay = (date: Date, date2: Date) => {

    return (
        date.getDate() === date2.getDate() &&
        date.getMonth() === date2.getMonth() &&
        date.getFullYear() === date2.getFullYear()
    );

};