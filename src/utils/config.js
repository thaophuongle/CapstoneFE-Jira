import axios from "axios";

const TokenCybersoft =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5Mb3AiOiJCb290Y2FtcCA1NyIsIkhldEhhblN0cmluZyI6IjE1LzA2LzIwMzAiLCJIZXRIYW5UaW1lIjoiMTcxODQwOTYwMDAwMCIsImlhdCI6MTcxNzY5MTc5NiwiZXhwIjoxODkwNDkxNzk2fQ.-xVWTAyxXwrWqb3rk5RFAul5x-t5qMPd2amKpjq3bkk";

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
