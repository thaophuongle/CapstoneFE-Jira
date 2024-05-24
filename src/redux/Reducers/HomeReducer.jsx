import { createSlice } from "@reduxjs/toolkit";
import { https } from "../../utils/config";
import { message } from "antd";

const initialState = {
  arrData: [],
  arrUser: [],
  arrProjectDetail: { members: [] },
  arrTaskDetail: {},
  arrStatus: [],
};

const HomeReducer = createSlice({
  name: "HomeReducer",
  initialState,
  reducers: {
    setArrProjectAction: (state, action) => {
      state.arrData = action.payload;
    },
    setArrUserAction: (state, action) => {
      state.arrUser = action.payload;
    },
    setProjectDetailAction: (state, action) => {
      state.arrProjectDetail = action.payload;
    },
    deleteProjectAction: (state, action) => {
      state.arrData = state.arrData.filter(
        (project) => project.id !== action.payload
      );
    },
    addUserProjectAction: (state, action) => {
      state.arrProjectDetail.members.push(action.payload);
    },
    removeUserProjectAction: (state, action) => {
      state.arrProjectDetail.members = state.arrProjectDetail.members.filter(
        (member) => member.userId !== action.payload
      );
    },
    setTaskDetailAction: (state, action) => {
      state.arrTaskDetail = action.payload;
    },

    setStatusGetAllAction: (state, action) => {
      state.arrStatus = action.payload;
    },
    deleteTaskAction: (state, action) => {
      state.arrProjectDetail.lstTask = state.arrProjectDetail.lstTask.filter(
        (task) => task.taskId !== action.payload
      );
    },
  },
});

export const {
  setArrProjectAction,
  setArrUserAction,
  setProjectDetailAction,
  deleteProjectAction,
  addUserProjectAction,
  removeUserProjectAction,
  setTaskDetailAction,
  setStatusGetAllAction,
  deleteTaskAction,
} = HomeReducer.actions;

export default HomeReducer.reducer;

/* ---------- ACTION THUNK ---------- */
export const getAllProjectApiAction = () => {
  return async (dispatch) => {
    try {
      const res = await https.get("/api/Project/getAllProject");

      const action = setArrProjectAction(res.data.content);
      dispatch(action);
    } catch (error) {
      console.error("Error getAllProject project:", error);
    }
  };
};

export const getAllUserApiAction = () => {
  return async (dispatch) => {
    try {
      const res = await https.get("/api/Users/getUser");

      const action = setArrUserAction(res.data.content);
      dispatch(action);
    } catch (error) {
      console.error("Error getAllUser project:", error);
    }
  };
};

export const getProjectDetailApiAction = (projectId) => {
  return async (dispatch) => {
    try {
      const res = await https.get(
        `/api/Project/getProjectDetail?id=${projectId}`
      );

      const action = setProjectDetailAction(res.data.content);
      dispatch(action);
    } catch (error) {
      console.error("Error getProjectDetail project:", error);
    }
  };
};

export const putCommentApi = (commentId, comment) => {
  return async (dispatch) => {
    try {
      const res = await https.put(
        `https://jiranew.cybersoft.edu.vn/api/Comment/updateComment?id=${commentId}&contentComment=${comment}`
      );

      console.log(res);
    } catch (error) {
      console.error("Error getProjectDetail project:", error);
    }
  };
};

export const postCommentApi = (data) => {
  return async (dispatch) => {
    try {
      const res = await https.post(`/api/Comment/insertComment`, data);

      console.log(res);
    } catch (error) {
      console.error("Error getProjectDetail project:", error);
    }
  };
};

export const deleteCommentApi = (commentId) => {
  return async (dispatch) => {
    try {
      const res = await https.delete(
        `https://jiranew.cybersoft.edu.vn/api/Comment/deleteComment?idComment=${commentId}`
      );

      console.log(res);
    } catch (error) {
      console.error("Error getProjectDetail project:", error);
    }
  };
};

export const deleteProjectApiAction = (projectId) => {
  return async (dispatch) => {
    try {
      const res = await https.delete(
        `api/Project/deleteProject?projectId=${projectId}`
      );

      const action = deleteProjectAction(res.data.content);
      dispatch(action);

      message.success("Xoá thành công !");
    } catch (error) {
      if (error.response?.status === 403) {
        message.error("Bạn không được phép xoá dữ liệu của người khác !");
      }
    }
  };
};

export const addUserProjectApiAction = (projectId, user) => {
  return async (dispatch) => {
    try {
      const res = await https.post("/api/Project/assignUserProject", {
        projectId,
        userId: user.userId,
      });

      const action = addUserProjectAction(user);

      dispatch(action);
    } catch (error) {
      // Handle error
      if (error.response?.status === 403) {
        message.error(
          "Bạn không có quyền truy cập vào dữ liệu của người khác !"
        );
      }
    }
  };
};

export const removeUserProjectApiAction = (projectId, userId) => {
  return async (dispatch) => {
    try {
      await https.post("api/Project/removeUserFromProject", {
        projectId,
        userId,
      });
      dispatch(removeUserProjectAction(userId));
    } catch (error) {
      if (error.response?.status === 403) {
        message.error(
          "Bạn không có quyền truy cập vào dữ liệu của người khác !"
        );
      }
    }
  };
};

export const getTaskDetailApiAction = (taskId) => {
  return async (dispatch) => {
    try {
      const res = await https.get(
        `/api/Project/getTaskDetail?taskId=${taskId}`
      );
      const action = setTaskDetailAction(res.data.content);
      dispatch(action);
      console.log(res);
    } catch (error) {
      console.error("Error getTaskDetail project:", error);
    }
  };
};

export const getAllStatusApiAction = () => {
  return async (dispatch) => {
    try {
      const res = await https.get("/api/Status/getAll");

      const action = setStatusGetAllAction(res.data.content);
      dispatch(action);
    } catch (error) {
      console.error("Error getAllstatus project:", error);
    }
  };
};

export const deleteTaskApiAction = (taskId) => {
  return async (dispatch) => {
    try {
      const res = await https.delete(
        `/api/Project/removeTask?taskId=${taskId}
        `
      );
      const action = deleteTaskAction(res.data.content);
      dispatch(action);

      message.success("Xoá thành công !");
    } catch (error) {
      if (error.response?.status === 403) {
        message.error("Bạn không được phép xoá dữ liệu của người khác !");
      }
    }
  };
};

export const updateArrProjectDetailApiAction = (newArrProjectDetail) => {
  return (dispatch) => {
    dispatch(setProjectDetailAction(newArrProjectDetail));
  };
};

export const updateTaskApiAction = (updateTask) => {
  return async (dispatch) => {
    console.log(updateTask);
    try {
      const res = await https.post("/api/Project/updateTask", {
        listUserAsign: updateTask.listUserAsign || [],
        taskId: updateTask.taskId,
        taskName: updateTask.taskName || "",
        description: updateTask.description || "",
        statusId: updateTask.statusId || "",
        originalEstimate: updateTask.originalEstimate || 0,
        timeTrackingSpent: updateTask.timeTrackingSpent || 0,
        timeTrackingRemaining: updateTask.timeTrackingRemaining || 0,
        projectId: updateTask.projectId || "",
        typeId: updateTask.typeId || 0,
        priorityId: updateTask.priorityId || 0,
      });
      const action = setTaskDetailAction(res.data.content);

      dispatch(action);
    } catch (error) {
      if (error.response?.status === 403) {
        message.error("Bạn không được chỉ định để thay đổi tác vụ này !");
      }
    }
  };
};
