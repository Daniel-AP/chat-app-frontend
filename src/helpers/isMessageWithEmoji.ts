export const isMessageWithEmoji = (str: string) => {

    const emojiRanges = [
        [0x1F300, 0x1F5FF],
        [0x1F600, 0x1F64F],
        [0x1F680, 0x1F6FF],
        [0x1F1E6, 0x1F1FF],
    ];
  
    for (let i = 0; i < str.length; i++) {

        const charCode = str.charCodeAt(i);

        if (charCode > 127 && !emojiRanges.some(([start, end]) => charCode >= start && charCode <= end)) return true;
        
    }

    return false;

};
  