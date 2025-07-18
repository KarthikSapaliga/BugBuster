import axios from "axios";
import { HOST } from "./routes.js";

const apiClient = axios.create({
    baseURL: HOST,
    headers: {
        "Content-Type": "application/json",
    },
});

apiClient.interceptors.request.use((request) => {
    console.log("Axios Request:\n", request);
    return request;
});

apiClient.interceptors.response.use(
    (response) => {
        console.log("Axios Response:\n", response);
        return response;
    },
    (error) => {
        console.error("Axios Error Response:\n", error.response);
        return Promise.reject(error);
    }
);

export { apiClient };
