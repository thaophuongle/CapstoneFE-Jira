import { https } from "./config";

export const createProject = {
  getCategory: () => {
    return https.get("/api/ProjectCategory");
  },
  postData: (data) => {
    return https.post("/api/Project/createProjectAuthorize", data);
  },
  getUser: () => {
    return https.get("/api/Users/getUser");
  },
  postAddUserProject: (data) => {
    return https.post("/api/Project/assignUserProject", data);
  },
  getUserByProjectId: (id) => {
    return https.get(`/api/Users/getUserByProjectId?idProject=${id}`);
  },
  postRemoveUserProject: (data) => {
    return https.post("/api/Project/removeUserFromProject", data);
  },
};
