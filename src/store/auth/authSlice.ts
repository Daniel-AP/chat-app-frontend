import { createSlice } from "@reduxjs/toolkit";
import { AuthStatus } from "../../types/enums";

export const authSlice = createSlice({

    name: "auth",

    initialState: {

        status: AuthStatus.checking,
        uid: null,
        name: null,
        email: null,
        photoURL: null,
        createdAt: null,
        errorMessage: null

    },

    reducers: {
        
        login: (state, { payload: user }) => {

            state.status = AuthStatus.authenticated;
            state.uid = user.uid;
            state.name = user.name;
            state.email = user.email;
            state.photoURL = user.photoURL;
            state.createdAt = user.createdAt;
            state.errorMessage = null;

        },

        logout: (state) => {

            state.status = AuthStatus.notAuthenticated;
            state.uid = null;
            state.name = null;
            state.email = null;
            state.photoURL = null;
            state.createdAt = null;
            state.errorMessage = null;

        },

        checkCredentials: (state) => {

            state.status = AuthStatus.checking;

        },

        updateUser: (state, { payload: user }) => {

            return user;

        },

        clearErrorMessage: (state) => {

            state.errorMessage = null;

        },

        error: (state, { payload: error }) => {

            state.errorMessage = error;

        }

    }

});

export const { login, logout, checkCredentials, updateUser, clearErrorMessage , error} = authSlice.actions;