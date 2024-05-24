import { configureStore } from "@reduxjs/toolkit";
import UserReducer from "./Reducers/UserReducer";
import CreateProjectReducer from "./Reducers/CreateProjectReducer";
import createTaskReducer from "./Reducers/createTaskReducer";
import HomeReducer from "./Reducers/HomeReducer";

export const store = configureStore({
  reducer: {
    userReducer: UserReducer,
    CreateProjectReducer,
    createTaskReducer,
    homeReducer: HomeReducer,
  },
});
