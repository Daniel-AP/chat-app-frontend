import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from "./auth/authSlice";
import { chatSlice } from "./chat/chatSlice";

export const store = configureStore({
    reducer: {
        auth: authSlice.reducer,
        chat: chatSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        })
});