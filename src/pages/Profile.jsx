import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { getAllProjectApiAction } from "../redux/Reducers/HomeReducer";
import { Table, Avatar, Tooltip } from "antd";

const Profile = () => {
  const dispatch = useDispatch();

  const { userLogin } = useSelector((state) => state.userReducer);
  const { arrData } = useSelector((state) => state.homeReducer);

  useEffect(() => {
    dispatch(getAllProjectApiAction());
  }, [dispatch]);

  useEffect(() => {
    //console.log("userLogin", userLogin);
    //console.log("arrData", arrData);
  }, [arrData, userLogin]);

  const filteredProjects = arrData.filter(project => project.creator.id === userLogin.id);

  console.log("Filtered Projects", filteredProjects); 

  const columns = [
    {
      title: 'Project ID',
      dataIndex: 'id',
      key: 'id',
      width: '10%',
    },
    {
      title: 'Project Name',
      dataIndex: 'projectName',
      key: 'projectName',
      render: (text, record) => (
        <NavLink to={`/projects/projectDetail/${record.id}`}>
          {text}
        </NavLink>
      ),
    },
    {
      title: 'Members',
      dataIndex: 'members',
      key: 'members',
      render: (members) => (
        <Avatar.Group
          maxCount={2}
          maxStyle={{ color: '#f56a00', backgroundColor: '#fde3cf' }}
        >
          {members.map((member, index) => (
            <Tooltip title={member.name} key={index} placement="top">
              <Avatar src={member.avatar} alt={member.name} />
            </Tooltip>
          ))}
        </Avatar.Group>
      ),
    },
  ];

  return (
    <div className="container py-4 px-5">
      <h2 className="text-center pt-5 pb-4">My Profile</h2>
      <div className="row mt-5 justify-content-center">
        <div className="col-md-6">
          <div className="mb-3 text-center">
            <img
              src={userLogin.avatar}
              alt="Avatar"
              className="rounded-circle img-fluid"
              style={{ width: "100px", height: "100px" }}
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="mb-3">
            <p>ID: {userLogin.id}</p>
          </div>
          <div className="mb-3">
            <p>Name: {userLogin.name}</p>
          </div>
          <div className="mb-3">
            <p>Email: {userLogin.email}</p>
          </div>
          <div className="mb-3">
            <p>Phone Number: {userLogin.phoneNumber}</p>
          </div>
          <div className="mt-5">
            <NavLink to={"/projects/update-profile"} className={"btn btn-primary"}>Update Profile</NavLink>
          </div>
        </div>
      </div>

      <div className="mt-5">
        <h5 className="pb-4">My Projects</h5>
        <Table columns={columns} dataSource={filteredProjects} rowKey="id" />
      </div>
    </div>
  );
};

export default Profile;
