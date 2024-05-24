import ReactDOM from "react-dom/client";
import {
  Navigate,
  Route,
  Routes,
  unstable_HistoryRouter as HistoryRouter,
} from "react-router-dom";

//cấu hình redux
import { Provider } from "react-redux";

import HomeTemplate from "./templates/HomeTemplate";

//Cấu hình chuyển hướng trang thông qua history
import { createBrowserHistory } from "history";
import Home from "./pages/Home";
import { store } from "./redux/store.js";
import CreateProject from "./pages/CreateProject/CreateProject.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Profile from "./pages/Profile.jsx";
import LoginTemplate from "./templates/LoginTemplate.jsx";
import UpdateProject from "./pages/UpdateProject.jsx";
import CreateTask from "./pages/CreateTask.jsx";
import "./assets/sass/index.scss";
import UpdateProfile from "./pages/UpdateProfile.jsx";
import UserList from "./pages/UserList.jsx";
import ProjectDetail from "./pages/ProjectDetail.jsx";

//history giúp chuyển hướng trang
export const history = createBrowserHistory();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <HistoryRouter history={history}>
      <Routes>
        <Route path="projects" element={<HomeTemplate />}>
          <Route index element={<Home />}></Route>
          <Route path="createProject" element={<CreateProject />}></Route>
          <Route
            path="updateProject/:projectId"
            element={<UpdateProject />}
          ></Route>
          <Route path="createTask" element={<CreateTask />}></Route>

          <Route
            path="projectDetail/:projectId"
            element={<ProjectDetail />}
          ></Route>
          <Route path="*" element={<Navigate to="" />}></Route>
          <Route path="my-profile" element={<Profile />}></Route>
          <Route path="update-profile" element={<UpdateProfile />}></Route>
          <Route path="users-list" element={<UserList />}></Route>
        </Route>
        <Route path="/" element={<LoginTemplate />}>
          <Route index element={<Login />}></Route>
          <Route path="login" element={<Login />}></Route>
          <Route path="register" element={<Register />}></Route>
        </Route>
      </Routes>
    </HistoryRouter>
  </Provider>
);
