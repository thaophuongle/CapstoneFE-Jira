import React, { useEffect, useState } from "react";
import {
  Avatar,
  Space,
  Table,
  Tag,
  Tooltip,
  Button,
  Modal,
  Popover,
  AutoComplete,
  Spin,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";
import Search from "antd/es/input/Search";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteProjectApiAction,
  getAllProjectApiAction,
} from "../redux/Reducers/HomeReducer";
import { NavLink } from "react-router-dom";
import "../assets/sass/home.scss";
import useResponsive from "../hook/useResponsive";

//set search

const Home = () => {
  const windowSize = useResponsive();
  const { arrData } = useSelector((state) => state.homeReducer);

  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);

  const getAllProjectApi = async () => {
    try {
      const action = getAllProjectApiAction();
      dispatch(action);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 2500);
    }
  };

  const deleteProjectApi = async (projectId) => {
    const action = deleteProjectApiAction(projectId);
    await dispatch(action);
    getAllProjectApi();
  };

  useEffect(() => {
    getAllProjectApi();
  }, []);

  const [selectedProject, setSelectedProject] = useState(null);

  const handleDelete = (project) => {
    setSelectedProject(project);
    Modal.confirm({
      title: `Are you sure to delete ${project.projectName}?`,
      icon: <ExclamationCircleFilled />,

      okText: "Delete",
      okType: "danger",
      cancelText: "Cancle",
      async onOk() {
        await deleteProjectApi(project.id);
      },
      onCancel() {
        setSelectedProject(null);
      },
      width: 500,
    });
  };

  const onSearch = (value, _e, info) => console.log(info?.source, value);
  const [searchValue, setSearchValue] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };
  useEffect(() => {
    const results = arrData.filter((project) =>
      project.projectName.toLowerCase().includes(searchValue.toLowerCase())
    );

    setSearchResult(results);
  }, [searchValue, arrData]);

  const columns = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
      width: "10%",
      fixed: "left",
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Project name",
      dataIndex: "projectName",
      key: "projectName",
      width: "25%",
      sorter: (a, b) => a.projectName.localeCompare(b.projectName),
      sortDirections: ["ascend", "descend"],
      render: (text, record, index) => (
        <NavLink
          to={`/projects/projectDetail/${record.id}`}
          className="text-primary text-decoration-none"
        >
          {text}
        </NavLink>
      ),
    },
    {
      title: "Category name",
      dataIndex: "categoryName",
      key: "categoryName",
      sorter: (a, b) => a.categoryName.localeCompare(b.categoryName),
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Creator",
      dataIndex: "creatorName",
      key: "creatorName",
      sorter: (a, b) => a.creator.name.localeCompare(b.creator.name),
      sortDirections: ["ascend", "descend"],
      render: (text, record, index) => (
        <Tag color="geekblue" className="py-1 px-2">
          {record.creator.name}
        </Tag>
      ),
    },
    {
      title: "Members",
      dataIndex: "membersAvatar",
      key: "membersAvatar",
      render: (text, record, index) => (
        <Avatar.Group
          maxCount={2}
          maxStyle={{ color: "#f56a00", backgroundColor: "#fde3cf" }}
        >
          {record.members.map((member, index) => (
            <Tooltip title={member.name} key={index} placement="top">
              <Avatar src={member.avatar} alt={member.name} />
            </Tooltip>
          ))}
        </Avatar.Group>
      ),
    },
    {
      title: "Actions",
      key: "action",
      fixed: "right",
      render: (text, record, index) => (
        <Space size={"middle"}>
          <NavLink
            to={`/projects/updateProject/${record.id}`}
            style={{
              background: "#1890ff",
              borderRadius: "5px",
              padding: "7px",
            }}
          >
            <EditOutlined style={{ color: "#fff" }} />
          </NavLink>
          <NavLink
            style={{
              background: "#ff4d4f",
              borderRadius: "5px",
              padding: "7px",
            }}
            onClick={() => handleDelete(record)}
          >
            <DeleteOutlined style={{ color: "#fff" }} />
          </NavLink>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Spin spinning={loading} size="large">
        <div
          style={
            windowSize.widthWindow < 768
              ? {
                  margin: "0 auto",
                  overflowX: "auto",
                }
              : {}
          }
          className="container"
        >
          <h2 className="text-center py-5">Projects Management</h2>
          <div className="project-top d-flex justify-content-between mb-4">
            <Search
              className="search-project"
              placeholder="Search project name"
              allowClear
              onChange={handleSearchChange}
              style={{
                width: 250,
              }}
            />
            <NavLink
              to={"/projects/createProject"}
              className="create-task btn btn-primary"
            >
              Create Project
            </NavLink>
          </div>

          <div
            style={
              windowSize.widthWindow < 768
                ? {
                    overflowX: "auto",
                  }
                : {}
            }
          >
            <Table columns={columns} dataSource={searchResult} />
          </div>
        </div>
      </Spin>
    </div>
  );
};

export default Home;
