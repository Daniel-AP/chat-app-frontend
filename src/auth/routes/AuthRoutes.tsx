import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { SignUp } from "../pages/SignUp";
import { LogIn } from "../pages/LogIn";

export const AuthRoutes = () => {
    return (
        <Routes>
            <Route path="signup" element={ <SignUp/> } />
            <Route path="login" element={ <LogIn/> } />
            <Route path="/*" element={ <Navigate to={"login"}/> } />
        </Routes>
    );
};
