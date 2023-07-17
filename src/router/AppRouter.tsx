import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { PrivateRoutes } from "./PrivateRoutes";
import { PublicRoutes } from "./PublicRoutes";
import { checkAuthStatus } from "../helpers/checkAuthStatus";
import { appApi } from "../api/appApi";
import { useSelector } from "react-redux";
import { AuthStatus } from "../types/enums";
import { Loading } from "../ui/Loading";
import { AuthRoutes } from "../auth/routes/AuthRoutes";
import { ChatRoutes } from "../chat/routes/ChatRoutes";

export const AppRouter = () => {

    checkAuthStatus();
    
    useEffect(() => {

        setInterval(async() => {

            try {

                const { data } = await appApi.get("/auth/renew");

                localStorage.setItem("token", data.jwt);
                
            } catch (error) {

                localStorage.setItem("token", localStorage.getItem("token") as string);
                
            }

        }, (1000*60*60*2));

    }, []);

    const authStatus = useSelector((state: any) => state.auth.status);
    const loading = authStatus === AuthStatus.checking;

    if(loading) return <Loading />;

    return (
        <Routes>
            <Route path="/auth/*" element={
                <PublicRoutes>
                    <AuthRoutes />
                </PublicRoutes>
            }/>
            <Route path="/*" element={
                <PrivateRoutes>
                    <ChatRoutes />
                </PrivateRoutes>
            }/>
        </Routes>
    );
};
