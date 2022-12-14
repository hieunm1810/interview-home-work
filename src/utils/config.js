import axios from "axios";

export const http = axios.create({
    baseURL: "https://jsonplaceholder.typicode.com",
    timeout: 6000
});

http.interceptors.request.use(configs => {
    configs.headers = {
        ...configs.headers,
    }

    return configs;
}, err => {
    return Promise.reject(err);
})