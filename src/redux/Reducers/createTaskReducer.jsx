import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  arrProject: [],
};

const createTaskReducer = createSlice({
  name: "createTaskReducer",
  initialState,
  reducers: {
    getIdProject: (state, action) => {
      console.log(action.payload);
      state.arrProject = action.payload;
    },
  },
});

export const { getIdProject } = createTaskReducer.actions;

export default createTaskReducer.reducer;
