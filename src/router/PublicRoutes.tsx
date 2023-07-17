import React, { PropsWithChildren } from "react";
import { useSelector } from "react-redux";
import { AuthStatus } from "../types/enums";
import { Navigate } from "react-router-dom";

export const PublicRoutes = ({ children }: PropsWithChildren) => {

    const authStatus = useSelector((state: any) => state.auth.status);
    const isAuthenticated = authStatus === AuthStatus.authenticated;

    return (
        !isAuthenticated
            ? (
                <>{ children }</>
            )
            : (
                <Navigate to={"/"} />
            )
    );
};
