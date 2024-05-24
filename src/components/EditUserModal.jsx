import React, { useEffect, useRef, useState } from "react";
import { Table, Button, Input, Space, Modal, Tooltip, Popconfirm, Flex } from "antd";
import {
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as yup from "yup";
import { editUserApiAction } from "../redux/Reducers/UserReducer";


const EditUserModal = (props) => {
    const userDetail = props.record
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const dispatch = useDispatch();

     // Use useEffect to update form values when props.record changes
     useEffect(() => {
        editUserForm.setValues((prevValues) => ({
          ...prevValues,
          userId: userDetail.userId,
          email: userDetail.email || "",
          passWord: "",
          name: userDetail.name || "",
          phoneNumber: userDetail.phoneNumber || "",
          confirmPassword: "",
        }));
      }, [userDetail.userId, userDetail.email, userDetail.name, userDetail.phoneNumber]);

    const editUserForm = useFormik({
        initialValues: {
            userId: userDetail.userId,
            email: userDetail.email || "",
            passWord: "",
            name: userDetail.name || "",
            phoneNumber: userDetail.phoneNumber || "",
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
            const action = editUserApiAction(values);
            dispatch(action)
            setModalOpen(false)
            props.handleUpdate() 
        },
    })
  return (
    <>
    <a onClick={() => setModalOpen(true)}>
              <EditOutlined style={{ color: "#3671fc", fontSize: "1.2rem" }} />
            </a>
        <Modal
              title="Edit user"
              centered
              visible={modalOpen}
              onOk={editUserForm.handleSubmit}
              okText="Update"
              onCancel={() => setModalOpen(false)}
              mask={true}
              maskClosable={true}
              okButtonProps={{
                htmlType: "submit",
              }}
            >
              <form onSubmit={editUserForm.handleSubmit}>
            <div className="row">
            <div className="col mb-3">
              <div>
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
                  value={editUserForm.values.userId}
                />
                <p className="text text-danger"></p>
              </div>
              <div >
                <label htmlFor="email" className="form-label">
                  Name
                </label>
                <Input
                  size="large"
                  id="name"
                  name="name"
                  value={editUserForm.values.name}
                  onChange={editUserForm.handleChange}
                />
                <p className="text text-danger">{editUserForm.errors.name && editUserForm.errors.name}</p>
              </div>
              <div>
                <label htmlFor="phone" className="form-label">
                  Email
                </label>
                <Input
                  size="large"
                  id="email"
                  name="email"
                  value={editUserForm.values.email}
                  onChange={editUserForm.handleChange}
                />
                <p className="text text-danger">{editUserForm.errors.email && editUserForm.errors.email}</p>
              </div>
              <div>
                <label htmlFor="password" className="form-label">
                  Phone Number
                </label>
                <Input
                  size="large"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={editUserForm.values.phoneNumber}
                  onChange={editUserForm.handleChange}
                />
                <p className="text text-danger">{editUserForm.errors.phoneNumber && editUserForm.errors.phoneNumber}</p>
              </div>
              <div>
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
                  onChange={editUserForm.handleChange}
                />
                <p className="text text-danger">{editUserForm.errors.passWord && editUserForm.errors.passWord}</p>
              </div>
              <div>
                <label htmlFor="password" className="form-label">
                  Confirm password
                </label>
                <Input
                  size="large"
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  onChange={editUserForm.handleChange}
                />
                <p className="text text-danger">
                {editUserForm.errors.confirmPassword && editUserForm.errors.confirmPassword}
                </p>
              </div>
            </div>
            </div>
          </form>
            </Modal>
    </>
  )
}

export default EditUserModal