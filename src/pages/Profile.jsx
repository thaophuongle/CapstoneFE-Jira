import React, { useEffect, useState } from "react";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";


const Profile = () => {
  const { userLogin } = useSelector((state) => state.userReducer);
  const dispatch = useDispatch();




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
    </div>
  );
};

export default Profile;
