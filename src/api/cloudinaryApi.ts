import axios from "axios";
import { getEnvVariables } from "../helpers/getEnvVariables";

const envVariables = getEnvVariables();

export const cloudinaryApi = axios.create({
    baseURL: envVariables.VITE_CLOUDINARY_URL,
});

cloudinaryApi.interceptors.request.use(config => {

    config.headers["Content-Type"] = "multipart/form-data";

    return config;
    
});