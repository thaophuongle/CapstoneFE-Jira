import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Button, Flex } from "antd";
import { Input, Tooltip } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as yup from "yup";
import { InfoCircleOutlined } from "@ant-design/icons";
import { updateProfileApiAction } from "../redux/Reducers/UserReducer";

const UpdateProfile = () => {
  const { userLogin } = useSelector((state) => state.userReducer);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const dispatch = useDispatch();

  const updateUserForm = useFormik({
    initialValues: {
      id: userLogin.id,
      email: userLogin.email || "",
      passWord: "",
      name: userLogin.name || "",
      phoneNumber: userLogin.phoneNumber || "",
      confirmPassword: "",
    },

    validationSchema: yup.object().shape({
      name: yup
        .string()
        .required("Name must not be blank")
        .matches(
          /^[a-zA-Zàáảãạăắằẳẵặâấầẩẫậèéẻẽẹêếềểễệđìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵ\s]+$/u,
          "Name must be alphabetic characters."
        ),
      email: yup
        .string()
        .required("Email must not be blank.")
        .email("Please enter a valid email address."),
      phoneNumber: yup
        .string()
        .required("Phone number must not be blank.")
        .matches(
          /^0\d{9}$/,
          "Please enter a valid 10-digit phone number starting with 0."
        ),
      passWord: yup
        .string()
        .required("Password must not be blank.")
        .min(8, "Password must contain at least 8 characters.")
        .matches(
          /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-])(?=.*[0-9]).{8,}$/,
          "Password must be at least 8 characters long and includes at least one uppercase letter, one lowercase letter, one number, and one special character."
        ),
      confirmPassword: yup
        .string()
        .required("Confirm password must not be blank")
        .oneOf(
          [yup.ref("passWord"), null],
          "Please ensure that the password and confirm password fields are the same."
        ),
    }),
    onSubmit: (values) => {
      dispatch(updateProfileApiAction(values)).then(() => {
        // Update localStorage after profile update
        const updatedUserLogin = {
          ...userLogin,
          email: values.email,
          name: values.name,
          phoneNumber: values.phoneNumber,
        };
        localStorage.setItem("userLogin", JSON.stringify(updatedUserLogin));
      });
    },
  });

  return (
    <div className="container py-4 px-5">
      <p>
        <NavLink
          className="text-decoration-none text-secondary me-2 "
          to={"/projects/my-profile"}
        >
          My Profile
        </NavLink>
        <span>/ Update Profile</span>
      </p>
      <h2 className="text-center pb-4">Update Profile</h2>
      <div className="row mt-3">
        <div className="col-md-4">
          <img
            src={userLogin.avatar}
            alt="Avatar"
            className="img-fluid rounded-circle mb-3"
            width={200}
          />
        </div>
        <div className="col-md-8">
          <form onSubmit={updateUserForm.handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="name" className="form-label">
                  ID
                </label>
                <Input
                  size="large"
                  type="text"
                  className="form-control"
                  id="id"
                  name="id"
                  disabled={true}
                  value={userLogin.id}
                />
                <p className="text text-danger"></p>
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="email" className="form-label">
                  Name
                </label>
                <Input
                  size="large"
                  id="name"
                  name="name"
                  value={updateUserForm.values.name}
                  onChange={updateUserForm.handleChange}
                />
                <p className="text text-danger">{updateUserForm.errors.name && updateUserForm.errors.name}</p>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="phone" className="form-label">
                  Email
                </label>
                <Input
                  size="large"
                  id="email"
                  name="email"
                  value={updateUserForm.values.email}
                  onChange={updateUserForm.handleChange}
                />
                <p className="text text-danger">{updateUserForm.errors.email && updateUserForm.errors.email}</p>
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="password" className="form-label">
                  Phone Number
                </label>
                <Input
                  size="large"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={updateUserForm.values.phoneNumber}
                  onChange={updateUserForm.handleChange}
                />
                <p className="text text-danger">{updateUserForm.errors.phoneNumber && updateUserForm.errors.phoneNumber}</p>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="phone" className="form-label">
                  Password{" "}
                  <Tooltip title="Enter your current password or if you want to change password, enter a new one.">
                    <InfoCircleOutlined
                      style={{
                        color: "rgba(0,0,0,.45)",
                      }}
                    />
                  </Tooltip>
                </label>
                <Input.Password
                  size="large"
                  visibilityToggle={{
                    visible: passwordVisible,
                    onVisibleChange: setPasswordVisible,
                  }}
                  id="passWord"
                  name="passWord"
                  onChange={updateUserForm.handleChange}
                />
                <p className="text text-danger">{updateUserForm.errors.passWord && updateUserForm.errors.passWord}</p>
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="password" className="form-label">
                  Confirm password
                </label>
                <Input
                  size="large"
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={updateUserForm.values.confirmPassword}
                  onChange={updateUserForm.handleChange}
                />
                <p className="text text-danger">
                  {updateUserForm.errors["confirmPassword"] &&
                    updateUserForm.errors["confirmPassword"]}
                </p>
              </div>
            </div>
            <Flex gap="small" wrap="wrap">
              <Button htmlType="submit" size="large" type="primary">
                Update
              </Button>
              <Button size="large">
                <NavLink
                  style={{ textDecoration: "none" }}
                  to={"/projects/my-profile"}
                >
                  Cancel
                </NavLink>
              </Button>
            </Flex>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfile;
