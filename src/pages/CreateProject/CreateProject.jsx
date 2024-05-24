import React, { useRef, useEffect, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { NavLink, useNavigate } from "react-router-dom";
import { createProject } from "../../utils/createProject";
import { useSelector, useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toAliasString } from "./Alias";
import { Modal, Input } from "antd";
import "./../../assets/sass/createProject.scss";
import removeVietnameseTones from "./removeVietnamese";
import { getArrUser } from "./../../redux/Reducers/CreateProjectReducer";
import useResponsive from "./../../hook/useResponsive";

const CreateProject = () => {
  const editorRef = useRef(null);
  const [projectCategory, setProjectCategory] = useState([]);
  const he = require("he");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [arrUserProject, setArrUserProject] = useState([]);
  const dispatch = useDispatch();
  const { Search } = Input;
  const [proId, setProId] = useState([]);
  const windowSize = useResponsive();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const onSearch = (value, _e, info) => console.log(info?.source, value);

  const formik = useFormik({
    initialValues: {
      projectName: "",
      categoryId: "",
      description: "",
      alias: "",
    },
    onSubmit: (value) => {
      value.alias = toAliasString(value.projectName);
      const desContent = document.getElementById("description").value;
      const decodedContent = he.decode(desContent);
      const valueD = decodedContent.replace(/<[^>]*>/g, "");
      value.description = valueD;
      createProject
        .postData(value)
        .then((res) => {
          console.log(res);
          setProId(res.data.content);
        })
        .catch((err) => {
          console.log(err);
        });
      showModal();
    },
    validationSchema: Yup.object({
      projectName: Yup.string().required("Project name is required"),
      categoryId: Yup.string()
        .test("selectCheck", "Project category is required", function (value) {
          if (value !== "Select a project category") {
            return value !== "Select a project category";
          }
        })
        .required("Project category is required"),
    }),
  });

  const projectId = proId.id;

  const { handleChange, handleSubmit, handleBlur, touched, errors, resetForm } =
    formik;

  useEffect(() => {
    createProject
      .getCategory()
      .then((res) => {
        console.log(res);
        setProjectCategory(res.data.content);
      })
      .catch((err) => console.log(err));
  }, []);

  const [user, setUser] = useState([]);
  const usersRef = useRef();
  const arrUser = usersRef.current;

  const { arrUserD } = useSelector((state) => state.CreateProjectReducer);

  useEffect(() => {
    createProject
      .getUser()
      .then((res) => {
        console.log(res);
        dispatch(getArrUser(res.data.content));
        usersRef.current = res.data.content;
        setUser(res.data.content);
      })
      .catch((err) => console.log(err));
  }, []);

  // chức năng tìm kiếm members
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (event) => {
    const searchTerm = event.target.value;
    const searchTermWithoutAccents = removeVietnameseTones(searchTerm);
    setSearchTerm(searchTerm);
    filterUsers(searchTermWithoutAccents);
  };

  const filterUsers = (searchTerm) => {
    if (searchTerm) {
      const filteredUsers = arrUser.filter((arrUser) =>
        removeVietnameseTones(arrUser.name.toLowerCase()).includes(
          searchTerm.toLowerCase()
        )
      );
      setUser(filteredUsers);
    } else {
      setUser(arrUser);
    }
  };

  // chức năng thêm xóa thành viên vào project
  const arrUserProjectRef = useRef([]);

  const addUserProject = (projectID, userID) => {
    const data = {
      projectId: projectID,
      userID: userID,
    };
    const indexD = arrUserD.findIndex((item) => item.userId === userID);
    createProject
      .postAddUserProject(data)
      .then((res) => {
        console.log(res);
        const index = user.findIndex((item) => item.userId === userID);
        const newUser = [...user];
        const removedUser = newUser.splice(index, 1);
        const arr = [...arrUserProjectRef.current];
        arrUserProjectRef.current.push([...removedUser, indexD]);
        setUser(newUser);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const arrUserR = arrUserProjectRef.current;

  const removeUserProject = (projectID, userID) => {
    const data = {
      projectId: projectID,
      userID: userID,
    };
    createProject
      .postRemoveUserProject(data)
      .then((res) => {
        console.log(res);
        const index2 = arrUserProject.findIndex(
          (item) => item.userId === userID
        );
        const removedUser1 = arrUserProject.splice(index2, 1);
        const removedUser2 = arrUserR.splice(index2, 1);
        const newUser = [...user];
        setArrUserProject(arrUserProject);
        newUser.splice(removedUser2[0][1], 0, removedUser2[0][0]);
        setUser(newUser);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (projectId) {
      createProject
        .getUserByProjectId(projectId)
        .then((res) => {
          console.log(res);
          setArrUserProject(res.data.content);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [user]);

  return (
    <>
      <div className="container py-4 px-5">
        <p>
          <NavLink
            className="text-decoration-none text-secondary me-2 "
            to={"/projects"}
          >
            Projects
          </NavLink>
          <span>/ New project</span>
        </p>
        <h3>New project</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group my-3">
            <label htmlFor="exampleInputEmail1" className="mb-2 fw-semibold">
              Project name <span className="text-danger">*</span>
            </label>
            <input
              onChange={handleChange}
              onBlur={handleBlur}
              className="form-control"
              id="projectName"
              value={formik.values.projectName}
            />
            {errors.projectName && touched.projectName && (
              <p className="text-danger fs-6 mt-1">{errors.projectName}</p>
            )}
          </div>
          <div className="form-group">
            <label className="mb-2 fw-semibold">
              Project category <span className="text-danger">*</span>
            </label>
            <select
              onChange={handleChange}
              onBlur={handleBlur}
              class="form-control"
              id="categoryId"
              value={formik.values.categoryId}
            >
              <option value={0}>Select a project category</option>
              {projectCategory.map((item, index) => {
                return (
                  <option value={item.id}>{item.projectCategoryName}</option>
                );
              })}
            </select>
            {errors.categoryId && touched.categoryId && (
              <p className="text-danger fs-6 mt-1">{errors.categoryId}</p>
            )}
          </div>
          <div className="mt-3">
            <label className="mb-2 fw-semibold">Descriptions</label>
            <Editor
              onChange={handleChange}
              onBlur={handleBlur}
              id="description"
              class="form-control"
              apiKey="9o0gtndzvm3cr870417b05dbgszexdivpnbmdnwwf0ydi4z2"
              onInit={(editor) => (editorRef.current = editor)}
              initialValue={formik.values.description}
              init={{
                height: 250,
                menubar: false,
                plugins: [
                  "advlist",
                  "autolink",
                  "lists",
                  "link",
                  "image",
                  "charmap",
                  "preview",
                  "anchor",
                  "searchreplace",
                  "visualblocks",
                  "code",
                  "fullscreen",
                  "insertdatetime",
                  "media",
                  "table",
                  "code",
                  "help",
                  "wordcount",
                ],
                toolbar:
                  "undo redo | blocks | " +
                  "bold italic forecolor | alignleft aligncenter " +
                  "alignright alignjustify | bullist numlist outdent indent | " +
                  "removeformat | help",
                content_style:
                  "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
              }}
            />
            {errors.description && touched.description && (
              <p className="text-danger fs-6 mt-1">{errors.description}</p>
            )}
          </div>
          <NavLink
            className="text-decoration-none btn bg-secondary text-white fs-6 my-3 me-2 "
            to={"/projects"}
          >
            Cancel
          </NavLink>
          <button type="submit" class="btn btn-primary fs-6 my-3">
            Create
          </button>
        </form>
      </div>
      <Modal
        open={isModalOpen}
        onCancel={handleCancel}
        width={1000}
        maskClosable={false}
        style={{ top: "50" }}
        footer=""
      >
        <div>
          <h3>Add members to project {formik.values.projectName} </h3>
          <hr />
        </div>
        <div>
          <div className="my-4">
            <h4 className="d-inline-block me-5">Search users</h4>
            <Search
              onSearch={onSearch}
              value={searchTerm}
              onChange={handleSearchChange}
              className="d-inline-block"
              style={{
                width: 200,
              }}
            />
          </div>
          <div
            className={` ${
              windowSize.widthWindow < 768
                ? "h-100"
                : "d-flex justify-content-between"
            }`}
          >
            <div
              className={` ${windowSize.widthWindow < 768 ? "" : "w-50 me-3"}`}
              style={{
                overflow: "auto",
                height: windowSize.widthWindow < 375 ? "170px" : "390px",
              }}
            >
              <h6>Not yet added</h6>
              {user.map((item, index) => {
                return (
                  <div className="d-flex justify-content-between mb-2 py-2 border-bottom">
                    <div className="d-flex justify-content-start">
                      <div>
                        <img
                          src={item.avatar}
                          className={`${
                            windowSize.widthWindow < 375
                              ? "w-50 rounded-circle"
                              : "w-75 rounded-circle"
                          }`}
                        />
                      </div>
                      <div>
                        <p className="mb-0">{item.name}</p>
                        <p className="mb-0">User ID: {item.userId}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        addUserProject(projectId, item.userId);
                      }}
                      className="btn py-1 px-3 bg-primary me-2"
                    >
                      Add
                    </button>
                  </div>
                );
              })}
            </div>
            <div className={` ${windowSize.widthWindow < 768 ? "" : "w-50"}`}>
              <h6>Already in project</h6>
              {arrUserProject
                ? arrUserProject.map((item, index) => {
                    return (
                      <div className="d-flex justify-content-between mb-2 py-2 border-bottom">
                        <div className="d-flex justify-content-start">
                          <div>
                            <img
                              src={item.avatar}
                              className={`${
                                windowSize.widthWindow < 375
                                  ? "w-50 rounded-circle"
                                  : "w-75 rounded-circle"
                              }`}
                            />
                          </div>
                          <div>
                            <p className="mb-0">{item.name}</p>
                            <p className="mb-0">User ID: {item.userId}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            removeUserProject(projectId, item.userId);
                          }}
                          className="btn py-1 px-3 bg-warning me-2"
                        >
                          Remove
                        </button>
                      </div>
                    );
                  })
                : ""}
            </div>
          </div>
        </div>
        <div className="mt-4">
          <hr />
          <dir className="d-flex justify-content-end">
            <NavLink
              to={"/projects"}
              className="btn py-1 px-3 bg-primary me-2 text-white"
            >
              Go to projects
            </NavLink>
          </dir>
        </div>
      </Modal>
    </>
  );
};

export default CreateProject;
