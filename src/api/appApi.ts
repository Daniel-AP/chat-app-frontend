import axios from "axios";
import { getEnvVariables } from "../helpers/getEnvVariables";

const envVariables = getEnvVariables();

export const appApi = axios.create({
    baseURL: envVariables.VITE_API_URL,
});

appApi.interceptors.request.use(config => {

    config.headers["x-token"] = localStorage.getItem("token");

    return config;
    
});