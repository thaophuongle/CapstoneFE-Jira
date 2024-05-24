import React, { useRef, useEffect, useState } from "react";
import { InputNumber, Slider, Select, Space, message } from "antd";
import { Editor } from "@tinymce/tinymce-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { createTask } from "./../utils/createTask";
import { NavLink } from "react-router-dom";
import useResponsive from "./../hook/useResponsive";
import { useNavigate } from "react-router-dom";

const CreateTask = () => {
  const editorRef = useRef(null);
  const he = require("he");
  const [allProject, setAllProject] = useState([]);
  const [status, setStatus] = useState([]);
  const [priority, setPriority] = useState([]);
  const [taskType, setTaskType] = useState([]);
  const [assigner, setAssigner] = useState([]);
  const [idProjectFirst, setIdProjectFirst] = useState();
  const [disabled, setDisabled] = useState(false);
  const [estimatedHours, setEstimatedHours] = useState(0);
  const [hoursSpent, setHoursSpent] = useState(0);
  const [remainHours, setRemainHours] = useState(0);
  const [listUserAssigner, setListUserAssigner] = useState();
  const [messageApi, contextHolder] = message.useMessage();
  const windowSize = useResponsive();
  const navigate = useNavigate();

  const info = (content) => {
    messageApi.info(content);
  };

  const handleChange2 = (value) => {
    const listUser = [];
    listUser.push(value);
    setListUserAssigner(listUser);
  };

  const handleChange3 = (event) => {
    console.log(event.target.value);
  };

  const onChange = (value, checked) => {
    console.log("changed", value);
    setDisabled(checked);
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const [projectRes, statusRes, priorityRes, taskTypeRes] =
          await Promise.all([
            createTask.getAllProject(),
            createTask.getStatus(),
            createTask.getPriority(),
            createTask.getTaskType(),
          ]);

        setAllProject(projectRes.data.content);
        if (projectRes.data.content.length > 0) {
          setIdProjectFirst(projectRes.data.content[0].id);
        }
        setStatus(statusRes.data.content);
        setPriority(priorityRes.data.content);
        setTaskType(taskTypeRes.data.content);
      } catch (err) {
        console.log(err);
      }
    };

    getData();
  }, []);

  const handleChange1 = (event) => {
    const selectedId = event.target.value;
    setIdProjectFirst(selectedId);
  };

  useEffect(() => {
    if (idProjectFirst) {
      createTask
        .getUserById(idProjectFirst)
        .then((res) => {
          // console.log(res);
          setAssigner(res.data.content);
        })
        .catch((err) => console.log(err));
    }
  }, [idProjectFirst]);

  const options = [];
  {
    assigner.map((item, index) => {
      return options.push({
        label: item.name,
        value: item.userId,
      });
    });
  }

  const updateTimeRemain = (estimatedHours, hoursSpent) => {
    const timeRemain = estimatedHours - hoursSpent;
    setRemainHours(timeRemain);
  };

  useEffect(() => {
    updateTimeRemain(estimatedHours, hoursSpent);
  }, [estimatedHours, hoursSpent]);

  const timeEst = (value) => {
    const timeEst = value * 1;
    setEstimatedHours(timeEst);
  };

  const timeSpent = (value) => {
    const timeSpent = value * 1;
    setHoursSpent(timeSpent);
  };

  const valueSlider = (remainHours * 100) / timeEst;

  const formik = useFormik({
    initialValues: {
      taskName: "",
    },
    onSubmit: (value) => {
      // xử lý giá trị của description
      const desContent = document.getElementById("description").value;
      const decodedContent = he.decode(desContent);
      const valueD = decodedContent.replace(/<[^>]*>/g, "");
      value.description = valueD;
      // xử lý các giá trị khác
      const status = document.getElementById("status").value;
      value.statusId = status;
      const estimatedHours = document.getElementById("estimatedHours").value;
      value.originalEstimate = estimatedHours;
      const hoursSpent = document.getElementById("hoursSpent").value;
      value.timeTrackingSpent = hoursSpent;
      value.timeTrackingRemaining = remainHours;
      value.projectId = idProjectFirst;
      const type = document.getElementById("taskType").value;
      value.typeId = type;
      const priority = document.getElementById("priority").value;
      value.priorityId = priority;
      value.listUserAsign = listUserAssigner[0];
      console.log(value);

      createTask
        .postCreateTask(value)
        .then((res) => {
          console.log(res);
          navigate("/projects");
          info("Bạn đã tạo task thành công");
        })
        .catch((err) => {
          console.log(err);
          info(err.response.data.message);
        });
    },
    validationSchema: Yup.object({
      taskName: Yup.string().required("Task name is required"),
    }),
  });

  const { handleChange, handleSubmit, handleBlur, touched, errors } = formik;

  return (
    <>
      {contextHolder}
      <div className="container py-5">
        <h2>Create Task</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 fw-bold">Project</label>
            <select id="project" onChange={handleChange1} class="form-control">
              {allProject.map((item, index) => {
                return (
                  <>
                    <option value={item.id}> {item.projectName} </option>
                  </>
                );
              })}
            </select>
            <p className="fw-bold text-warning">
              * You can only create tasks of your own projects!
            </p>
          </div>
          <div className="row">
            <div className="col">
              <div className="form-group">
                <label className="mb-2 fw-bold">Task name</label>
                <input
                  onChange={handleChange}
                  onBlur={handleBlur}
                  type="text"
                  name="taskName"
                  className="form-control"
                  id="taskName"
                  placeholder="Task name"
                />
                {errors.taskName && touched.taskName && (
                  <p className="text-danger fs-6 mt-1">{errors.taskName}</p>
                )}
              </div>
            </div>
            <div
              className={`col-2 ${
                windowSize.widthWindow < 768 ? "d-none" : " d-block"
              }`}
            ></div>
            <div className="col">
              <label className="mb-2 fw-bold">Status</label>
              <select id="status" onChange={handleChange3} class="form-control">
                {status.map((item, index) => {
                  return (
                    <>
                      <option value={item.statusId} key={index}>
                        {item.statusName}
                      </option>
                    </>
                  );
                })}
              </select>
            </div>
          </div>
          <div className="row mt-2">
            <div className="col">
              <label className="mb-2 fw-bold">Priority</label>
              <select id="priority" class="form-control">
                {priority.map((item, index) => {
                  return (
                    <>
                      <option value={item.priorityId}>{item.priority}</option>
                    </>
                  );
                })}
              </select>
            </div>
            <div
              className={`col-2 ${
                windowSize.widthWindow < 768 ? "d-none" : " d-block"
              }`}
            ></div>
            <div className="col">
              <label className="mb-2 fw-bold">Task Type</label>
              <select id="taskType" class="form-control">
                {taskType.map((item, index) => {
                  return (
                    <>
                      <option value={item.id}>{item.taskType}</option>
                    </>
                  );
                })}
              </select>
            </div>
          </div>
          <label className="mb-2 fw-bold">Assigners</label>
          <div>
            <Space
              style={{
                width: "100%",
              }}
              direction="vertical"
            >
              <Select
                mode="multiple"
                allowClear
                style={{
                  width: "100%",
                }}
                onChange={handleChange2}
                options={options}
              />
            </Space>
          </div>
          <div className="row my-2">
            <label className="mb-2 fw-bold">Time Tracking</label>
            <div className="col">
              {windowSize.widthWindow < 375 ? (
                <label className="mb-2 fw-bold">Total Estimated</label>
              ) : (
                <label className="mb-2 fw-bold">Total Estimated Hours</label>
              )}
              <InputNumber
                className="d-block w-100 fs-6"
                id="estimatedHours"
                min={0}
                max={100}
                value={estimatedHours}
                defaultValue={0}
                onChange={timeEst}
              />
            </div>
            <div
              className={`col-2 ${
                windowSize.widthWindow < 768 ? "d-none" : " d-block"
              }`}
            ></div>
            <div className="col">
              <label className="mb-2 fw-bold">Hours spent</label>
              <InputNumber
                id="hoursSpent"
                className="d-block w-100 fs-6"
                min={0}
                max={100}
                value={hoursSpent}
                defaultValue={0}
                onChange={timeSpent}
              />
            </div>
            <div className="px-2 mt-2">
              <Slider
                max={estimatedHours}
                value={hoursSpent}
                defaultValue={[remainHours, estimatedHours]}
                disabled={disabled}
              />
              <div className="d-flex justify-content-between">
                <p> {hoursSpent} hour(s) spent</p>
                <p> {remainHours} hour(s) remaining</p>
              </div>
            </div>
          </div>
          <div className="mt-3">
            <label className="mb-2 fw-bold">Description</label>
            <Editor
              id="description"
              class="form-control"
              apiKey="9o0gtndzvm3cr870417b05dbgszexdivpnbmdnwwf0ydi4z2"
              onInit={(evt, editor) => (editorRef.current = editor)}
              initialValue={""}
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
          <div>
            <NavLink to={"/projects"} className="btn btn-secondary mt-3 me-2 ">
              Cancel
            </NavLink>
            <button type="submit" className="btn btn-primary mt-3">
              Submit
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default CreateTask;
