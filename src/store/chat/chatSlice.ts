import { createSlice } from "@reduxjs/toolkit";
import { Chat, CurrentChat } from "../../types/interfaces";

interface InitialState {
    currentChat: CurrentChat | null | undefined,
    chats: Chat[] | null | undefined,
    filteredChats: Chat[] | null | undefined,
    searchingChats: boolean | null | undefined,
    message: { type: string, content: string } | null | undefined,
    loading: boolean,
}

const initialState = {

    currentChat: null,
    chats: null,
    filteredChats: null,
    searchingChats: null,
    message: null,
    loading: true,

} as InitialState;

export const chatSlice = createSlice({

    name: "chat",

    initialState,

    reducers: {

        setCurrentChat: (state, { payload: chat }) => {

            state.currentChat = chat;

        },

        setTypingUser: (state, { payload: typingUser }) => {

            if(state.chats && state.filteredChats) {

                const index = state.chats.findIndex((value: Chat) => typingUser.chatId === value._id);

                state.chats[index].userTyping = typingUser.user;
                state.filteredChats[index].userTyping = typingUser.user;

                if(typingUser.chatId === state.currentChat?.id && state.currentChat) {

                    state.currentChat.userTyping = typingUser.user;

                }

            }

        },

        delTypingUser: (state, { payload: chatId }) => {

            if(state.chats && state.filteredChats) {

                const index = state.chats.findIndex((value: Chat) => chatId === value._id);

                state.chats[index].userTyping = {} as any;
                state.filteredChats[index].userTyping = {} as any;

                if(chatId === state.currentChat?.id && state.currentChat) {

                    state.currentChat.userTyping = {} as any;

                }

            }

        },

        updateLastMessage: (state, { payload: message }) => {

            if(state.chats && state.filteredChats) {

                const index = state.chats.findIndex((value: Chat) => message.chatId === value._id);
                
                state.chats[index].lastMessage = message.content;
                state.filteredChats[index].lastMessage = message.content;

            }

            const sortedChats = state.chats?.sort((a: any, b: any) => new Date(b.lastMessage?.createdAt).getTime() - new Date(a.lastMessage?.createdAt).getTime());
            
            state.chats = sortedChats;
            state.filteredChats = sortedChats;

        },

        delMessage: (state, { payload: id }) => {

            if(state.currentChat) {

                const filteredMessages = state.currentChat.messages.filter((message: any) => message._id !== id);

                state.currentChat.messages = filteredMessages;

            }


        },

        pushNewMessage: (state, { payload: message }) => {

            state.currentChat?.messages.push(message);

        },

        pushOlderMessages: (state, { payload: messages}) => {

            state.currentChat?.messages.unshift(...messages);

        },

        updateMessage: (state, { payload: update }) => {

            if(state.currentChat) {

                const index = state.currentChat.messages.findIndex((value: any) => value._id === update.id);

                state.currentChat.messages[index] = {
                    ...state.currentChat.messages[index],
                    ...update.info
                };

            }

        },

        setChats: (state, { payload: chats }) => {

            const sortedChats = chats.sort((a: any, b: any) => new Date(b.lastMessage?.createdAt).getTime() - new Date(a.lastMessage?.createdAt).getTime());
            state.chats = sortedChats;

        },

        addChat: (state, { payload: chat }) => {

            const newChats = [...state.chats as Chat[], chat];
            const sortedChats = newChats.sort((a: any, b: any) => new Date(b.lastMessage?.createdAt).getTime() - new Date(a.lastMessage?.createdAt).getTime());
            state.chats = sortedChats;
            state.filteredChats = sortedChats;

        },

        updateChat: (state, { payload: chat}) => {

            const index = state.chats?.findIndex((value: Chat) => value._id === chat.id);

            if(state.chats && index) state.chats[index] = chat;

        },

        delChat: (state, { payload: id }) => {

            const filteredChats = state.chats?.filter((value: Chat) => {

                return value._id !== id;

            });

            const sortedChats = [...filteredChats as []].sort((a: any, b: any) => new Date(b.lastMessage?.createdAt).getTime() - new Date(a.lastMessage?.createdAt).getTime());

            state.chats = sortedChats;  
            state.filteredChats = sortedChats;  

        },

        addMembers: (state, { payload: members }) => {

            if(state.currentChat) {

                state.currentChat.members = [...state.currentChat.members, ...members];

            }

        },

        delMember: (state, { payload: id }) => {

            if(state.currentChat) {

                state.currentChat.members = state.currentChat.members.filter((value) => value._id !== id);

            }

        },

        message: (state, { payload: error }) => {

            state.message = error;

        },

        toggleSearchingChats: (state) => {

            state.searchingChats = !state.searchingChats;

        },

        setFilteredChats: (state, { payload: chats}) => {

            state.filteredChats = chats;

        },

        setLoading: (state, { payload: status}) => {

            state.loading = status;

        },

        setTotalMessageCount: (state, { payload: amount }) => {

            if(state.currentChat) {
                
                state.currentChat.totalMessageCount = amount;

            }

        },

        setOffset: (state, { payload: amount }) => {

            if(state.currentChat) {

                state.currentChat.offset = amount;

            }

        },

        reset: () => {

            return initialState;

        }

    }

});

export const {
    setCurrentChat,
    setChats,
    addChat,
    updateChat,
    delChat,
    delMember,
    addMembers,
    message,
    toggleSearchingChats,
    setFilteredChats,
    setLoading,
    setTypingUser,
    delTypingUser,
    updateLastMessage,
    pushNewMessage,
    pushOlderMessages,
    updateMessage,
    delMessage,
    setTotalMessageCount,
    setOffset,
    reset
} = chatSlice.actions;