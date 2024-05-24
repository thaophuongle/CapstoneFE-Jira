import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import * as yup from "yup";
import { loginApiAction } from "../redux/Reducers/UserReducer";
import { useFormik } from "formik";
import {
  UserOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  LockOutlined,
} from "@ant-design/icons";
import { Input, Button } from "antd";
import LoginUsingFacebook from "./LoginUsingFacebook";
import { TOKEN, USER_LOGIN } from "../utils/config";
import "../assets/sass/login.scss"

const Login = () => {
  localStorage.removeItem(TOKEN);
    localStorage.removeItem(USER_LOGIN);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const dispatch = useDispatch();
  const loginForm = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: yup.object().shape({
      email: yup
        .string()
        .required("Email cannot blank")
        .email("Email is not valid"),
      password: yup
        .string()
        .required("Password cannot be blank")
    }),
    onSubmit: async (userLogin) => {
      const action = loginApiAction(userLogin);

      dispatch(action);
    },
  });
  useEffect(() => {}, []);
  return (
    <div className="container px-5 login-page">
      <h2 className="text-center mt-5">Login to start with JiraClone</h2>
      <form className="mt-5 login-form" onSubmit={loginForm.handleSubmit}>
        <div className="form-group">
          <Input
            size="large"
            id="email"
            name="email"
            placeholder="Email"
            onChange={loginForm.handleChange}
            prefix={<i className="fa-regular fa-envelope"></i>}
          />
          <p className="text text-danger">
            {loginForm.errors.email && loginForm.errors.email}
          </p>
        </div>
        <div className="form-group password-eye">

          <Input.Password
            size="large"
            placeholder="Password"
            visibilityToggle={{
              visible: passwordVisible,
              onVisibleChange: setPasswordVisible,
            }}
            id="password"
            name="password"
            onChange={loginForm.handleChange}
            prefix={<LockOutlined />}
          />
          <p className="text text-danger">
            {loginForm.errors.password && loginForm.errors.password}
          </p>
        </div>
        <div className="form-group">
          <button type="submit" className="btn btn-primary my-2 w-100">
            Login
          </button>
        </div>
        <div className="form-group login-facebook text-center">
            Or you can continue with <LoginUsingFacebook/>
        </div>
        <div className="form-group text-center register-account mt-3">
          <span>Don't have an account yet? </span>
          <NavLink className={"register-link"} to={"/register"}>Register here</NavLink>
        </div>
      </form>
    </div>
  );
};

export default Login;
