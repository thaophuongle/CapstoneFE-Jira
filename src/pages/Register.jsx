import { useFormik } from 'formik';
import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom'
import * as yup from "yup";
import { registerApiAction } from '../redux/Reducers/UserReducer';
import { UserOutlined, LockOutlined, CheckCircleOutlined, PhoneOutlined} from '@ant-design/icons';
import { Input } from 'antd';
import "../assets/sass/register.scss"


const Register = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const dispatch = useDispatch()

  const registerForm = useFormik({
    initialValues: {
      email: "",
      passWord: "",
      name: "",
      phoneNumber: "",
      "confirmPassword": ""
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
        .matches(/^0\d{9}$/, "Please enter a valid 10-digit phone number starting with 0."),
        passWord: yup
        .string()
        .required("Password must not be blank.")
        .min(8, "Password must contain at least 8 characters.")
        .matches(
          /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-])(?=.*[0-9]).{8,}$/,
          "Password must be at least 8 characters long and includes at least one uppercase letter, one lowercase letter, one number, and one special character."
        ),
        "confirmPassword": yup
        .string()
        .required("Confirm password must not be blank")
        .oneOf([yup.ref("passWord"), null], "Please ensure that the password and confirm password fields are the same."),
    }),
    onSubmit: (userRegister) => {
      const action = registerApiAction(userRegister);
      dispatch(action)
    }
  })
  return (
    <div className='container px-5 register-page'>
      <h2 className="text-center mt-5">Register with JiraClone</h2>
      <form className='mt-5 register-form' onSubmit={registerForm.handleSubmit}>
      <div className="form-group">
          <Input size="large"
            id="name"
            name="name"
            placeholder="Name"
            onChange={registerForm.handleChange} prefix={<UserOutlined />} />
          <p className="text text-danger">
          {registerForm.errors.name && registerForm.errors.name}
          </p>
        </div>
        <div className="form-group">
          <Input size="large" id="email"
            name="email"
            placeholder="Email"
            onChange={registerForm.handleChange} prefix={<i className="fa-regular fa-envelope"></i>} />
          <p className="text text-danger">
          {registerForm.errors.email && registerForm.errors.email}
          </p>
        </div>
        <div className="form-group">
          <Input size="large" id="phoneNumber"
            name="phoneNumber"
            placeholder="Phone Number"
            onChange={registerForm.handleChange} prefix={<PhoneOutlined />} />
          <p className="text text-danger">
          {registerForm.errors.phoneNumber && registerForm.errors.phoneNumber}
          </p>
        </div>
        <div className="form-group">
          <Input.Password
            size="large"
            placeholder="Password"
            visibilityToggle={{
              visible: passwordVisible,
              onVisibleChange: setPasswordVisible,
            }}
            id="passWord"
            name="passWord"
            onChange={registerForm.handleChange}
            prefix={<LockOutlined />}
          />
          <p className="text text-danger">
          {registerForm.errors.passWord && registerForm.errors.passWord}
          </p>
        </div>
        <div className="form-group">
          <Input size="large" type='password'
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Confirm Password"
            onChange={registerForm.handleChange} prefix={<CheckCircleOutlined />} />
          <p className="text text-danger">
          {registerForm.errors["confirmPassword"] &&
                    registerForm.errors["confirmPassword"]}
          </p>
        </div>
        <div className="form-group">
          <button type="submit" className="btn btn-primary my-3 w-100">Register</button>
        </div>
        <div className="form-group text-center login-account">
              <span>If you already have an account? </span>
              <NavLink className={"login-link"} to={"/login"}>Login now</NavLink>
            </div>
      </form>
    </div>
  )
}

export default Register