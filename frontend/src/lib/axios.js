import axios from "axios";
import { HOST } from "./routes.js";

export const apiClient = axios.create({
    baseURL: HOST,
    headers: {
        "Content-Type": "application/json",
    },
});
