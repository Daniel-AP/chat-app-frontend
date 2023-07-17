export interface CurrentChat {

    id: string,
    name: string,
    admin: string,
    lastMessage: string,
    userTyping: {
        uid: string,
        name: string
    },
    createdAt: string,
    offset: number,
    totalMessageCount: number,
    members: Array<{
        _id: string,
        name: string,
        email: string,
        photoURL: string
    }>,
    messages: Message[]

}

export interface Message {
    _id: string,
    content: string,
    chatId: string,
    createdAt: string,
    status: "sent" | "loading" | "failed"
    userId: {
        _id: string,
        name: string,
        photoURL: string
    }
}

export interface Chat {

    _id: string,
    name: string,
    lastMessage: object | undefined,
    userTyping: {
        uid: string,
        name: string
    }

}