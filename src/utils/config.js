import axios from "axios";

const TokenCybersoft =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5Mb3AiOiJCb290Y2FtcCA1NyIsIkhldEhhblN0cmluZyI6IjI5LzA2LzIwMjQiLCJIZXRIYW5UaW1lIjoiMTcxOTYxOTIwMDAwMCIsIm5iZiI6MTY4ODkyMjAwMCwiZXhwIjoxNzE5NzY2ODAwfQ.9MKEqdjyd8nN84l6J6hg-XfkLpmaY_aBPozV_TXxusM";

export const USER_LOGIN = "userLogin";
export const TOKEN = "accessToken";

export const https = axios.create({
  baseURL: "https://jiranew.cybersoft.edu.vn",
  headers: {
    TokenCybersoft,
  },
});

https.interceptors.request.use(
  (config) => {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${localStorage.getItem(TOKEN)}`,
    };
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
