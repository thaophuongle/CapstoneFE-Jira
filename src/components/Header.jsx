import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { logoutApiAction } from "../redux/Reducers/UserReducer";
import { NavLink } from "react-router-dom";
import useResponsive from "../hook/useResponsive";
import "../assets/sass/header.scss";
import { BarsOutlined, DownOutlined } from "@ant-design/icons";
import { Dropdown, Menu } from "antd";

const Header = () => {
  const windowSize = useResponsive();
  const { userLogin } = useSelector((state) => state.userReducer);
  const dispatch = useDispatch();

  const logoutUser = () => {
    const action = logoutApiAction(userLogin);
    dispatch(action);
  };

  const projectsMenu = (
    <Menu>
      <Menu.Item key="0" className="py-2 px-3">
        <NavLink className={"text-decoration-none"} to="index">
          View all projects
        </NavLink>
      </Menu.Item>
      <Menu.Item key="1" className="py-2 px-3">
        <NavLink
          className={"text-decoration-none"}
          to="/projects/createProject"
        >
          Create projects
        </NavLink>
      </Menu.Item>
    </Menu>
  );

  const usersMenu = (
    <Menu>
      <Menu.Item key="0" className="py-2 px-3">
        <NavLink className={"text-decoration-none"} to="users-list">
          View all users
        </NavLink>
      </Menu.Item>
    </Menu>
  );

  const settingsMenu = (
    <Menu>
      <Menu.Item key="0" className="py-2 px-3" disabled="true">
        <a className={"text-decoration-none"}>ATLASSIAN ADMIN</a>
      </Menu.Item>
      <Menu.Item key="1" className="py-2 px-3">
        <NavLink className={"text-decoration-none"} to="users-list">
          User management
        </NavLink>
      </Menu.Item>
      <Menu.Item key="2" className="py-2 px-3" disabled="true">
        <a className={"text-decoration-none"}>JIRA SETTINGS</a>
      </Menu.Item>
      <Menu.Item key="3" className="py-2 px-3">
        <a className={"text-decoration-none"} to="/projects/createProject">
          Projects
        </a>
      </Menu.Item>
    </Menu>
  );
  const profilesMenu = (
    <Menu>
      <Menu.Item key="0" className="py-2 px-3" disabled="true">
        <a className={"text-decoration-none"}>
          {userLogin?.name?.toUpperCase()}
        </a>
      </Menu.Item>
      <Menu.Item key="1" className="py-2 px-3">
        <NavLink className={"text-decoration-none"} to="my-profile">
          My Profile
        </NavLink>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="2" className="py-2 px-3">
        <NavLink
          className={"text-decoration-none"}
          to={"/login"}
          onClick={logoutUser}
        >
          Logout
        </NavLink>
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="header bg-white text-primary container-fluid px-5 fixed left-0 top-0 w-full ">
      <nav className="navbar navbar-expand-sm text-primary p-0 d-flex justify-content-between w-full">
        <NavLink className="navbar-brand" to="index">
          <img
            src="https://www.ecobit.nl/portal-content-website/koppelingen/jira%20software.png"
            alt="..."
            style={{ maxWidth: "500px", maxHeight: "50px" }}
          />
        </NavLink>
        <button
          className="navbar-toggler d-lg-none"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#collapsibleNavId"
          aria-controls="collapsibleNavId"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span>
            <BarsOutlined />
          </span>
        </button>

        <div className="collapse navbar-collapse" id="collapsibleNavId">
          <ul className="navbar-nav me-auto mt-2 mt-lg-0 d-flex">
            <li className="nav-item dropdown me-1">
              <Dropdown
                overlay={projectsMenu}
                trigger={["click"]}
                overlayStyle={{ minWidth: "200px" }}
              >
                <a className="nav-link " href="#">
                  Projects <DownOutlined />
                </a>
              </Dropdown>
            </li>
            <li className="nav-item dropdown me-1">
              <Dropdown
                overlay={usersMenu}
                trigger={["click"]}
                overlayStyle={{ minWidth: "200px" }}
              >
                <a className="nav-link" href="#">
                  Users <DownOutlined />
                </a>
              </Dropdown>
            </li>
            <li className="nav-item me-1">
              <NavLink to={"/projects/createTask"} className="nav-link active">
                Create Task <span className="visually-hidden">(current)</span>
              </NavLink>
            </li>
          </ul>
        </div>
        <div
          className=" nav-right align-items-center collapse navbar-collapse justify-content-end"
          id="collapsibleNavId"
        >
          <div className="nav-item dropdown me-3">
            <Dropdown
              placement="bottomLeft"
              overlay={settingsMenu}
              trigger={["click"]}
              overlayStyle={{ minWidth: "230px" }}
            >
              <a
                style={{ cursor: "pointer" }}
                className={`nav-link ${
                  windowSize.widthWindow < 575 ? "dropdown-toggle" : ""
                }`}
              >
                <i style={{ color: "#1c4ed8" }} className="fa fa-cog me-2"></i>
              </a>
            </Dropdown>
          </div>
          <div className="nav-item dropdown item-right-user">
            <Dropdown
              placement="bottomLeft"
              overlay={profilesMenu}
              trigger={["click"]}
              overlayStyle={{ minWidth: "230px" }}
            >
              <a className="text-decoration-none" style={{ cursor: "pointer" }}>
                <img
                  src={userLogin.avatar}
                  alt=""
                  className="mx-2"
                  style={{ borderRadius: "50%", width: "2.5rem" }}
                />
                <span>{userLogin.email}</span>
              </a>
            </Dropdown>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Header;
