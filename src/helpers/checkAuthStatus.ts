import { useDispatch } from "react-redux";
import { appApi } from "../api/appApi";
import { login, logout } from "../store/auth/authSlice";
import { useEffect } from "react";

export const checkAuthStatus = async() => {

    const dispatch = useDispatch();

    const check = async() => {

        try {

            const { data } = await appApi.get("/auth/logged");
        
            if(!data.ok) return dispatch(logout());
        
            dispatch(login({
                uid: data._id,
                name: data.name,
                email: data.email,
                photoURL: data.photoURL,
                createdAt: data.createdAt
            }));
            
        } catch (error) {
    
            dispatch(logout());
            
        }

    };

    useEffect(() => {

        check();

    }, []);

};