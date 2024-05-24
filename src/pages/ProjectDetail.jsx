import React, { useEffect, useState } from "react";
import {
  Avatar,
  Tooltip,
  Modal,
  Select,
  Collapse,
  Space,
  Input,
  message,
  InputNumber,
  Slider,
} from "antd";
import "../assets/sass/projectDetail.scss";
import { NavLink, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  addUserProjectApiAction,
  deleteCommentApi,
  deleteTaskApiAction,
  getAllStatusApiAction,
  getAllUserApiAction,
  getProjectDetailApiAction,
  getTaskDetailApiAction,
  postComment,
  postCommentApi,
  putCommentApi,
  removeUserProjectApiAction,
  setTaskDetailAction,
  updateArrProjectDetailApiAction,
  updateTaskApiAction,
} from "../redux/Reducers/HomeReducer";
import {
  PlusOutlined,
  BugFilled,
  SnippetsFilled,
  DeleteOutlined,
  CloseOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";
import Search from "antd/es/input/Search";
import useResponsive from "./../hook/useResponsive.js";
import { https } from "../utils/config.js";

const ProjectDetail = () => {
  const windowSize = useResponsive();
  // const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [taskName, setTaskName] = useState("");
  const [taskType, setTaskType] = useState("bug");

  // const handleCreate = () => {
  //   setIsCreatingTask(false);
  //   setTaskName("");
  //   setTaskType("bug");
  // };

  // const handleCancelCreateTask = () => {
  //   setIsCreatingTask(false);
  //   setTaskName("");
  //   setTaskType("bug"); // Reset task type to default
  // };

  // set modal add member
  const [isModalOpen, setIsModalOpen] = useState({
    modalAddMember: false,
    modalViewTaskDetail: false,
  });
  const onSearch = (value, _e, info) => console.log(info?.source, value);
  const showModal = (modalName) => {
    setIsModalOpen({
      ...isModalOpen,
      [modalName]: true,
    });
  };

  const handleCancel = (modalName) => {
    setIsModalOpen({
      ...isModalOpen,
      [modalName]: false,
    });
  };
  const { arrProjectDetail, arrUser, arrTaskDetail, arrStatus } = useSelector(
    (state) => state.homeReducer
  );

  const { userLogin } = useSelector((state) => state.userReducer);

  const params = useParams();
  const dispatch = useDispatch();

  const getAllUserApi = async () => {
    const action = getAllUserApiAction();
    dispatch(action);
  };

  useEffect(() => {
    getAllUserApi();
  }, []);
  const getProjectDetailApi = async (projectId) => {
    const action = getProjectDetailApiAction(projectId);
    dispatch(action);
  };
  useEffect(() => {
    getProjectDetailApi(params.projectId);
  }, [params.projectId]);

  const getTaskDetailApi = async (taskId) => {
    const action = await getTaskDetailApiAction(taskId);
    dispatch(action);
    showModal("modalViewTaskDetail");
  };

  const getAllStatusApi = async () => {
    const action = getAllStatusApiAction();
    dispatch(action);
  };

  useEffect(() => {
    getAllStatusApi();
  }, []);

  const [taskDeleted, setTaskDeleted] = useState(false);

  const deleteTaskApi = async (taskId) => {
    const action = await deleteTaskApiAction(taskId);
    dispatch(action);
    setTaskDeleted(true);
  };

  const handleDelete = async (taskId) => {
    Modal.confirm({
      title: `Are you sure to delete this task?`,
      icon: <ExclamationCircleFilled />,
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancle",
      async onOk() {
        await deleteTaskApi(taskId);
        setTaskDeleted(true);
        handleCancel("modalViewTaskDetail");
      },
      onCancel() {
        setTaskDeleted(false);
      },
      width: 500,
    });
  };
  useEffect(() => {
    if (taskDeleted) {
      getProjectDetailApi(arrProjectDetail.id);
      setTaskDeleted(false);
    }
  }, [taskDeleted, arrProjectDetail]);

  const checkTaskType = (taskType) => {
    if (taskType === "bug") {
      return <BugFilled className="text-danger me-2" />;
    } else if (taskType === "new task") {
      return <SnippetsFilled className="text-primary-emphasis me-2" />;
    }
  };
  const checkPriority = (priority) => {
    switch (priority) {
      case "Lowest":
        return "rounded px-1 pb-0.5 text-dark-subtle border border-dark-subtle";
      case "Low":
        return "rounded px-1 pb-0.5 text-primary border border-primary";
      case "Medium":
        return "rounded px-1 pb-0.5 text-success border border-success-subtle";
      case "High":
        return "rounded px-1 pb-0.5 text-danger border border-danger";
      default:
        return null;
    }
  };
  const checkStatus = (statusId) => {
    switch (statusId) {
      case "1":
        return "BACKLOG";
      case "2":
        return "SELECTED FOR DEVELOPMENT";
      case "3":
        return "IN PROGRESS";
      case "4":
        return "DONE";
    }
  };
  const checkSelectPriority = (priorityId) => {
    switch (priorityId) {
      case 1:
        return "High";
      case 2:
        return "Medium";
      case 3:
        return "Low";
      case 4:
        return "Lowest";
    }
  };
  const checkSelectPriorityName = (priorityName) => {
    switch (priorityName) {
      case "High":
        return 1;
      case "Medium":
        return 2;
      case "Low":
        return 3;
      case "Lowest":
        return 4;
    }
  };

  //add member
  const [remainingUsers, setRemainingUsers] = useState([]);

  const handleAddMember = (user) => {
    if (user) {
      dispatch(addUserProjectApiAction(arrProjectDetail.id, user));
    } else {
      message.error("Please select a user to add.");
    }
  };

  const handleRemoveMember = (user) => {
    dispatch(removeUserProjectApiAction(arrProjectDetail.id, user.userId));
  };
  useEffect(() => {
    const usersNotAdded = arrUser.filter((user) => {
      return !arrProjectDetail.members.find(
        (member) => member.userId === user.userId
      );
    });
    setRemainingUsers(usersNotAdded);
  }, [arrUser, arrProjectDetail.members]);

  //drag and drop
  const [arrProjectDetails, setArrProjectDetails] = useState(arrProjectDetail);
  useEffect(() => {
    setArrProjectDetails(arrProjectDetail);
  }, [arrProjectDetail]);
  const filterTasksByStatus = (statusId) => {
    if (!arrProjectDetails || !arrProjectDetails?.lstTask) return [];
    const updatedArrProjectDetail = { ...arrProjectDetails };
    updatedArrProjectDetail.lstTask = updatedArrProjectDetail.lstTask?.filter(
      (task) => task.statusId === statusId
    );
    return updatedArrProjectDetail.lstTask;
  };

  const handleDragStart = (event, taskId) => {
    event.dataTransfer.setData("taskId", taskId);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const checkStatusName = (statusName) => {
    switch (statusName) {
      case "BACKLOG":
        return "1";
      case "SELECTED FOR DEVELOPMENT":
        return "2";
      case "IN PROGRESS":
        return "3";
      case "DONE":
        return "4";
    }
  };

  const handleDrop = async (event, status) => {
    event.preventDefault();
    const taskId = event.dataTransfer.getData("taskId");

    const res = await https.get(`/api/Project/getTaskDetail?taskId=${taskId}`);
    const action = setTaskDetailAction(res.data.content);

    const task = action.payload;

    if (!arrProjectDetails || !arrProjectDetails?.lstTask) {
      console.error("arrProjectDetail is not defined or has invalid structure");
      return;
    }
    // Tạo một bản sao của arrProjectDetail để cập nhật dữ liệu
    const updatedArrProjectDetail = JSON.parse(
      JSON.stringify(arrProjectDetails)
    );

    const dropStatusIndex = updatedArrProjectDetail.lstTask.findIndex(
      (taskItem) => taskItem.statusName === status
    );

    if (dropStatusIndex === -1) {
      console.error("Invalid drop status:", status);
      return;
    }

    const taskExists = updatedArrProjectDetail.lstTask[
      dropStatusIndex
    ].lstTaskDeTail.some((detail) => detail?.taskId === task.taskId);

    if (!taskExists) {
      updatedArrProjectDetail.lstTask[dropStatusIndex].lstTaskDeTail.push(task);
    }

    // Xóa task khỏi danh sách tasks của status gốc
    updatedArrProjectDetail.lstTask.forEach((taskItem) => {
      if (taskItem.statusName !== status) {
        taskItem.lstTaskDeTail = taskItem.lstTaskDeTail.filter(
          (detail) => detail?.taskId !== task.taskId
        );
      }
    });

    const statusId = checkStatusName(status);
    const updateRes = await https.put("/api/Project/updateStatus", {
      taskId: task.taskId,
      statusId: statusId,
    });

    if (updateRes.status === 200) {
      setArrProjectDetails(updatedArrProjectDetail);
    } else {
      console.error("Failed to update task");
    }
  };

  useEffect(() => {
    dispatch(updateArrProjectDetailApiAction(arrProjectDetails));
  }, [arrProjectDetails, dispatch]);

  const [buttonCmt, setButtonCmt] = useState("d-none");
  const [editCmtId, setEditCmtId] = useState(null);
  const [commentContent, setCommentContent] = useState("");

  const handleCommentChange = (e) => {
    setCommentContent(e.target.value);
  };

  console.log(arrTaskDetail.lstComment);
  const [comments, setComments] = useState(arrTaskDetail.lstComment);
  const reversedComments = comments ? [...comments].reverse() : [];

  useEffect(() => {
    setComments(arrTaskDetail.lstComment);
    setButtonCmt("d-none");
    setEditCmtId(null);
  }, [arrTaskDetail]);

  const postComment = () => {
    const dataPostComment = {
      taskId: arrTaskDetail.taskId,
      contentComment: addComment,
    };
    dispatch(postCommentApi(dataPostComment));
  };

  const putComment = (commentId, comment) => {
    dispatch(putCommentApi(commentId, comment));
  };

  //search
  const [searchValue, setSearchValue] = useState("");
  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };
  useEffect(() => {
    const filteredUsers = arrUser.filter((user) =>
      user.name.toLowerCase().includes(searchValue.toLowerCase())
    );
    setRemainingUsers(filteredUsers);
  }, [searchValue, arrUser]);

  //set update task detail
  const [isEditable, setIsEditable] = useState(false);
  const [contentDes, setContentDes] = useState(arrTaskDetail.description);
  const [addComment, setAddComment] = useState();
  const [selectedStatus, setSelectedStatus] = useState(
    checkStatus(arrTaskDetail.statusId)
  );
  const [selectedPriority, setSelectedPriority] = useState(
    checkSelectPriority(arrTaskDetail.priorityId)
  );

  const [estimate, setEstimate] = useState(arrTaskDetail.originalEstimate);

  const [trackingRemaining, setTrackingRemaining] = useState(
    arrTaskDetail.timeTrackingRemaining
  );
  const [trackingSpent, setTrackingSpent] = useState(
    arrTaskDetail.timeTrackingSpent
  );
  const [sliderValue, setSliderValue] = useState(
    arrTaskDetail.timeTrackingSpent
  );

  const handleSelectChange = (type, value) => {
    if (type === "status") {
      setSelectedStatus(value);
    } else if (type === "priority") {
      setSelectedPriority(value);
    }
  };

  const handleTimeTracking = (value, setTitle) => {
    setTitle(value);
    updateSliderValue();
  };

  const updateSliderValue = () => {
    const total = estimate;
    const spentPercentage = (trackingSpent / total) * 100;
    // const remainingPercentage = 100 - spentPercentage;
    const spentValue = (spentPercentage / 100) * total;
    // const remainingValue = (remainingPercentage / 100) * total;

    setSliderValue(spentValue);
  };

  const handleEditorClick = () => {
    setIsEditable(true);
  };

  const handleEditorBlur = () => {
    setIsEditable(false);
  };

  const handleEditorChange = (e, setTitle) => {
    setTitle(e.target.value);
  };

  const [updateCmt, setUpdateCmt] = useState("");

  useEffect(() => {
    setContentDes(arrTaskDetail.description);
    setSelectedStatus(checkStatus(arrTaskDetail.statusId));
    setSelectedPriority(checkSelectPriority(arrTaskDetail.priorityId));
    setEstimate(arrTaskDetail.originalEstimate);
    setTrackingRemaining(arrTaskDetail.timeTrackingRemaining);
    setTrackingSpent(arrTaskDetail.timeTrackingSpent);
    setSliderValue(arrTaskDetail.timeTrackingSpent);
  }, [arrTaskDetail]);
  useEffect(() => {
    updateSliderValue();
  }, [trackingSpent]);

  const updateTaskApi = async (updateTask) => {
    const action = await updateTaskApiAction(updateTask);
    dispatch(action);
  };

  const hanleSaveUpdateTask = async (updateTask) => {
    try {
      const updatedTask = {
        ...updateTask,
        description: contentDes || "",
        statusId: selectedStatus ? checkStatusName(selectedStatus) : "",
        originalEstimate: estimate || 0,
        timeTrackingSpent: trackingSpent || 0,
        timeTrackingRemaining: trackingRemaining || 0,
        priorityId: checkSelectPriorityName(selectedPriority) || 0,
      };

      await updateTaskApi(updatedTask);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  return (
    <div className="project-detail container mt-4">
      <p>
        <NavLink
          className={"text-decoration-none text-secondary me-2 next-detail"}
          to={"index"}
        >
          Projects
        </NavLink>
        <span>/ {arrProjectDetail.projectName}</span>
      </p>
      <div
        className={`${
          windowSize.widthWindow < 375
            ? "project-header"
            : "project-header d-flex"
        }`}
      >
        <h3 className="w-25">Board</h3>
        <div
          className={`${
            windowSize.widthWindow < 375
              ? "d-flex align-items-center"
              : "member d-flex align-items-center"
          }`}
        >
          <p className="m-0">Members</p>
          <div>
            {arrProjectDetail.members &&
              arrProjectDetail.members.map((detail, index) => {
                return (
                  <Tooltip title={detail.name} placement="top" key={index}>
                    <Avatar src={detail.avatar} alt={detail.name} />
                  </Tooltip>
                );
              })}
            <Tooltip title="Add member" placement="top">
              <Avatar
                onClick={() => showModal("modalAddMember")}
                style={{
                  backgroundColor: "#fde3cf",
                  color: "#f56a00",
                  cursor: "pointer",
                }}
                icon={<PlusOutlined />}
              />
            </Tooltip>
          </div>
        </div>
      </div>

      <div className="project-content d-flex justify-content-around px-5 row">
        <div
          className="col mb-4 col-lg-3 col-md-12 col-sm-12 col-12 project-item"
          onDragOver={(event) => handleDragOver(event)}
          onDrop={(event) => handleDrop(event, "BACKLOG")}
        >
          <p>
            <span className="title-detail item1">BACKLOG</span>
          </p>
          <div className="detail-info">
            {filterTasksByStatus("1")?.map((task) => (
              <div
                className="task-detail"
                key={task?.alias}
                style={{ cursor: "pointer" }}
              >
                {task?.lstTaskDeTail?.map((detail, index) => (
                  <div
                    onClick={() => getTaskDetailApi(detail.taskId)}
                    className="task-detail-item bg-white"
                    key={index}
                    draggable="true"
                    onDragStart={(event) =>
                      handleDragStart(event, detail.taskId)
                    }
                  >
                    <p className="m-0">{detail?.taskName}</p>
                    <div className="task-bottom">
                      <div className="task-left">
                        {checkTaskType(detail?.taskTypeDetail?.taskType)}
                        <span
                          className={checkPriority(
                            detail?.priorityTask?.priority
                          )}
                        >
                          {detail?.priorityTask?.priority}
                        </span>
                      </div>
                      <div className="task-right">
                        <Avatar.Group
                          size={25}
                          maxCount={2}
                          maxStyle={{
                            color: "#f56a00",
                            backgroundColor: "#fde3cf",
                          }}
                        >
                          {detail?.assigness?.map((member) => (
                            <Tooltip title={member.name} placement="top">
                              <Avatar src={member.avatar} alt={member.name} />
                            </Tooltip>
                          ))}
                        </Avatar.Group>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
            <div>
              <NavLink
                to={"/projects/createTask"}
                className="w-100 text-decoration-none text-blackrounded border p-2 d-block btn btn-light"
                style={{
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <PlusOutlined /> Create
              </NavLink>
            </div>
          </div>
        </div>
        <div
          className="col mb-4 col-lg-3 col-md-12 col-sm-12 col-12 project-item"
          onDragOver={(event) => handleDragOver(event)}
          onDrop={(event) => handleDrop(event, "SELECTED FOR DEVELOPMENT")}
        >
          <p>
            <span className="title-detail item2">SELECTED FOR DEVELOPMENT</span>
          </p>
          <div className="detail-info">
            {filterTasksByStatus("2")?.map((task) => (
              <div
                className="task-detail "
                key={task?.alias}
                style={{ cursor: "pointer" }}
              >
                {task.lstTaskDeTail?.map((detail, index) => (
                  <div
                    onClick={() => getTaskDetailApi(detail.taskId)}
                    className="task-detail-item bg-white"
                    key={index}
                    draggable="true"
                    onDragStart={(event) =>
                      handleDragStart(event, detail?.taskId)
                    }
                  >
                    <p className="m-0">{detail?.taskName}</p>
                    <div className="task-bottom">
                      <div className="task-left">
                        {checkTaskType(detail?.taskTypeDetail?.taskType)}
                        <span
                          className={checkPriority(
                            detail?.priorityTask?.priority
                          )}
                        >
                          {detail?.priorityTask?.priority}
                        </span>
                      </div>
                      <div className="task-right">
                        <Avatar.Group
                          size={25}
                          maxCount={2}
                          maxStyle={{
                            color: "#f56a00",
                            backgroundColor: "#fde3cf",
                          }}
                        >
                          {detail?.assigness?.map((member) => (
                            <Tooltip title={member.name} placement="top">
                              <Avatar src={member.avatar} alt={member.name} />
                            </Tooltip>
                          ))}
                        </Avatar.Group>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div
          className="col mb-4 col-lg-3 col-md-12 col-sm-12 col-12 project-item"
          onDragOver={(event) => handleDragOver(event)}
          onDrop={(event) => handleDrop(event, "IN PROGRESS")}
        >
          <p>
            <span className="title-detail item3">IN PROGRESS</span>
          </p>
          <div className="detail-info">
            {filterTasksByStatus("3")?.map((task) => (
              <div
                className="task-detail "
                key={task?.alias}
                style={{ cursor: "pointer" }}
              >
                {task?.lstTaskDeTail?.map((detail, index) => (
                  <div
                    onClick={() => getTaskDetailApi(detail.taskId)}
                    className="task-detail-item bg-white"
                    key={index}
                    draggable="true"
                    onDragStart={(event) =>
                      handleDragStart(event, detail.taskId)
                    }
                  >
                    <p className="m-0">{detail?.taskName}</p>
                    <div className="task-bottom">
                      <div className="task-left">
                        {checkTaskType(detail?.taskTypeDetail?.taskType)}
                        <span
                          className={checkPriority(
                            detail?.priorityTask?.priority
                          )}
                        >
                          {detail?.priorityTask?.priority}
                        </span>
                      </div>
                      <div className="task-right">
                        <Avatar.Group
                          size={25}
                          maxCount={2}
                          maxStyle={{
                            color: "#f56a00",
                            backgroundColor: "#fde3cf",
                          }}
                        >
                          {detail?.assigness?.map((member) => (
                            <Tooltip title={member.name} placement="top">
                              <Avatar src={member.avatar} alt={member.name} />
                            </Tooltip>
                          ))}
                        </Avatar.Group>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div
          className="col mb-4 col-lg-3 col-md-12 col-sm-12 col-12 project-item"
          onDragOver={(event) => handleDragOver(event)}
          onDrop={(event) => handleDrop(event, "DONE")}
        >
          <p>
            <span className="title-detail item4">DONE</span>
          </p>
          <div className="detail-info">
            {filterTasksByStatus("4")?.map((task) => (
              <div
                className="task-detail "
                key={task.alias}
                style={{ cursor: "pointer" }}
              >
                {task?.lstTaskDeTail?.map((detail, index) => (
                  <div
                    onClick={() => getTaskDetailApi(detail.taskId)}
                    className="task-detail-item bg-white"
                    key={index}
                    draggable="true"
                    onDragStart={(event) =>
                      handleDragStart(event, detail.taskId)
                    }
                  >
                    <p className="m-0">{detail?.taskName}</p>
                    <div className="task-bottom">
                      <div className="task-left">
                        {checkTaskType(detail?.taskTypeDetail?.taskType)}
                        <span
                          className={checkPriority(
                            detail?.priorityTask?.priority
                          )}
                        >
                          {detail?.priorityTask?.priority}
                        </span>
                      </div>
                      <div className="task-right">
                        <Avatar.Group
                          size={25}
                          maxCount={2}
                          maxStyle={{
                            color: "#f56a00",
                            backgroundColor: "#fde3cf",
                          }}
                        >
                          {detail?.assigness?.map((member) => (
                            <Tooltip title={member.name} placement="top">
                              <Avatar src={member.avatar} alt={member.name} />
                            </Tooltip>
                          ))}
                        </Avatar.Group>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="modal-add-member w-100 ">
        <Modal
          className="modal-content p-4"
          open={isModalOpen.modalAddMember}
          onCancel={() => handleCancel("modalAddMember")}
          width={1000}
          height={1000}
          maskClosable={false}
          style={{ top: "50", maxWidth: "100%", maxHeight: "90%" }}
          footer=""
        >
          <div className="px-3 modal-header">
            <h5
              className="pt-3"
              style={{ fontSize: windowSize.widthWindow < 585 ? "18px" : "" }}
            >
              Add members to project
              <span className="text-primary">
                {" "}
                {arrProjectDetail.projectName}
              </span>
            </h5>
            <hr />
          </div>
          <div
            className={`${windowSize.widthWindow < 768 ? "pt-0" : "p-3 pt-0"}`}
          >
            <div className="d-flex justify-content-start align-items-baseline p-3 pb-0">
              <p className="d-inline-block me-5 fw-medium">Search users</p>
              <Search
                placeholder="search members"
                allowClear
                onSearch={onSearch}
                onChange={handleSearchChange}
                className="d-inline-block ms-5"
                style={{
                  width: 200,
                }}
              />
            </div>
            <div
              className={` ${
                windowSize.widthWindow < 768
                  ? "h-100"
                  : "justify-content-between p-3 d-flex"
              }  `}
            >
              <div
                className={` ${
                  windowSize.widthWindow < 768 ? "" : "w-50 me-3"
                }`}
                style={{
                  overflow: "auto",
                  height: windowSize.widthWindow < 375 ? "170px" : "390px",
                }}
              >
                <h6 className="mb-3">Not yet added</h6>
                <div>
                  {remainingUsers.map((user) => (
                    <div className="d-flex justify-content-between mb-2 py-2 border-bottom">
                      <div className="d-flex justify-content-start">
                        <div>
                          <img
                            className={`${
                              windowSize.widthWindow < 375
                                ? "w-50 rounded-circle"
                                : "w-75 rounded-circle"
                            }`}
                            src={user.avatar}
                          />
                        </div>
                        <div className="text-truncate">
                          <p className="mb-0 ">{user.name}</p>
                          <p
                            className="mb-0 text-secondary"
                            style={{ fontSize: "12px" }}
                          >
                            User ID: {user.userId}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleAddMember(user)}
                        className="btn px-3 bg-primary me-2 ms-2 text-white"
                        style={{
                          height: "35px",
                          fontSize: windowSize.widthWindow < 920 ? "13px" : "",
                        }}
                      >
                        Add
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div
                style={{
                  width: windowSize.widthWindow < 710 ? "100%" : "45%",
                }}
              >
                <h6 className="mb-3">Already in project</h6>
                <div
                  style={{
                    maxHeight: "300px",
                    overflowY: "auto",
                    fontSize: windowSize.widthWindow < 920 ? "13px" : "",
                  }}
                >
                  {arrProjectDetail.members.map((userExist) => (
                    <div className="d-flex justify-content-between mb-2 py-2 border-bottom">
                      <div className="d-flex justify-content-start">
                        <div>
                          <img
                            className={`${
                              windowSize.widthWindow < 375
                                ? "w-50 rounded-circle"
                                : "w-75 rounded-circle"
                            }`}
                            src={userExist.avatar}
                          />
                        </div>
                        <div>
                          <p className="mb-0">{userExist.name}</p>
                          <p
                            className="mb-0 text-secondary"
                            style={{ fontSize: "12px" }}
                          >
                            User ID: {userExist.userId}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveMember(userExist)}
                        className="btn py-1 px-2 bg-danger text-white ms-2 ms-2"
                        style={{
                          height: "35px",
                          fontSize: windowSize.widthWindow < 920 ? "13px" : "",
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Modal>
      </div>
      <div className="modal-view-task-detail w-100">
        <Modal
          className="modal-view-content p-4"
          open={isModalOpen.modalViewTaskDetail}
          onCancel={() => handleCancel("modalViewTaskDetail")}
          width={1000}
          maskClosable={false}
          style={{ top: "50" }}
          footer={
            <div className="">
              <hr className="mx-3" />
              <button
                className="btn btn-success px-4 me-3"
                onClick={() => {
                  hanleSaveUpdateTask(arrTaskDetail);
                }}
              >
                Save
              </button>
            </div>
          }
        >
          <div className="">
            <div className="d-flex justify-content-between align-items-start">
              <h6>
                {checkTaskType(arrTaskDetail?.taskTypeDetail?.taskType)}
                {arrTaskDetail?.taskTypeDetail?.taskType
                  .charAt(0)
                  .toUpperCase() +
                  arrTaskDetail?.taskTypeDetail?.taskType.slice(1)}
              </h6>
              <DeleteOutlined
                onClick={() => handleDelete(arrTaskDetail?.taskId)}
                className="text-danger me-4 fs-5"
              />
            </div>
            <div
              className={`${
                windowSize.widthWindow < 768
                  ? ""
                  : "view-task-info d-flex justify-content-between p-3"
              }`}
            >
              <div
                className="task-info-left"
                style={{ width: windowSize.widthWindow < 768 ? "" : "55%" }}
              >
                <h4>{arrTaskDetail.taskName}</h4>
                <div>
                  <p>Description</p>
                  <div>
                    <p className="">
                      <Input
                        placeholder="Add a description..."
                        value={contentDes}
                        onClick={handleEditorClick}
                        onBlur={handleEditorBlur}
                        onChange={(e) => {
                          handleEditorChange(e, setContentDes);
                        }}
                      />
                    </p>
                  </div>
                </div>
                <div>
                  <p>Comments</p>
                  <div className="d-flex align-items-baseline">
                    <p className="m-0 py-2">
                      <img
                        style={{ width: "55%" }}
                        className="rounded-circle"
                        src={userLogin.avatar}
                        alt="..."
                      />
                    </p>
                    <p className="w-100">
                      <Input
                        className="py-2"
                        placeholder="Add a comment..."
                        value={addComment}
                        onFocus={() => {
                          setButtonCmt("d-flex");
                        }}
                        onClick={handleEditorClick}
                        onBlur={handleEditorBlur}
                        onChange={(e) => {
                          handleEditorChange(e, setAddComment);
                        }}
                      />
                    </p>
                  </div>
                  <div className={`${buttonCmt} justify-content-end`}>
                    <button
                      className="btn btn-warning"
                      onClick={() => setButtonCmt("d-none")}
                    >
                      Cancel
                    </button>
                    <button
                      className="btn btn-primary mx-2 px-3"
                      onClick={async () => {
                        await postComment();
                        dispatch(getTaskDetailApiAction(arrTaskDetail.taskId));
                      }}
                    >
                      Save
                    </button>
                  </div>
                  <div
                    style={{
                      maxHeight: "170px",
                      overflowY: "auto",
                      marginTop: "10px",
                    }}
                  >
                    {reversedComments?.map((comment) => (
                      <div>
                        <div
                          className="d-flex align-items-baseline"
                          key={comment.id}
                        >
                          <p className="m-0">
                            <img
                              className="rounded-circle w-50"
                              src={comment.avatar}
                              alt="..."
                            />
                          </p>
                          <div className="">
                            <p className="m-0">{comment.name}</p>
                            {editCmtId === comment.id ? (
                              <div>
                                <div className="d-flex align-items-baseline">
                                  <p className="w-100">
                                    <Input
                                      className="py-2"
                                      placeholder="Add a comment..."
                                      value={commentContent}
                                      onClick={handleEditorClick}
                                      onBlur={handleEditorBlur}
                                      onChange={handleCommentChange}
                                    />
                                  </p>
                                </div>
                                <div className={`d-flex justify-content-end`}>
                                  <button
                                    className="btn btn-warning"
                                    onClick={() => setEditCmtId(null)}
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    className="btn btn-primary mx-2 px-3"
                                    onClick={async () => {
                                      await putComment(
                                        comment.id,
                                        commentContent
                                      );
                                      dispatch(
                                        getTaskDetailApiAction(
                                          arrTaskDetail.taskId
                                        )
                                      );
                                    }}
                                  >
                                    Save
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div>
                                <p className="m-0 fw-light">
                                  {comment.commentContent}
                                </p>
                                <div className="text-secondary mt-3">
                                  <span
                                    className="me-3"
                                    onClick={() => {
                                      setEditCmtId(comment.id);
                                      setCommentContent(comment.commentContent);
                                    }}
                                  >
                                    Edit
                                  </span>
                                  <span
                                    onClick={async () => {
                                      await dispatch(
                                        deleteCommentApi(comment.id)
                                      );
                                      dispatch(
                                        getTaskDetailApiAction(
                                          arrTaskDetail.taskId
                                        )
                                      );
                                    }}
                                  >
                                    Delete
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div
                className="task-info-right"
                style={{ width: windowSize.widthWindow < 768 ? "" : "40%" }}
              >
                <Select
                  value={selectedStatus}
                  className="mb-3"
                  style={{
                    width: windowSize.widthWindow < 768 ? "100%" : 250,
                  }}
                  onChange={(value) => {
                    handleSelectChange("status", value);
                  }}
                  options={arrStatus.map((sta) => ({
                    value: sta.statusName,
                    label: sta.statusName,
                  }))}
                />

                <div>
                  <Collapse
                    items={[
                      {
                        key: "1",
                        label: "Detail",
                        children: (
                          <div className="">
                            <div
                              className={`${
                                windowSize.widthWindow < 768 ? "" : "d-flex"
                              }`}
                            >
                              <p className="me-2">Assigness</p>

                              <div>
                                {arrTaskDetail?.assigness?.map((ass) => (
                                  <div className="d-flex align-items-center mb-2 border p-2 rounded ">
                                    <p className="m-0">
                                      <img
                                        className="rounded-circle w-50"
                                        src={ass.avatar}
                                        alt="..."
                                      />
                                    </p>
                                    <p
                                      className={`${
                                        windowSize.widthWindow < 1032
                                          ? "fs-7 mb-0"
                                          : "mb-0 me-2"
                                      }`}
                                    >
                                      {ass.name}
                                    </p>
                                    <CloseOutlined />
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div className="d-flex">
                              <p className="me-4">Priority</p>
                              <div>
                                <Select
                                  value={selectedPriority}
                                  className="mb-3"
                                  style={{
                                    width: 110,
                                  }}
                                  onChange={(value) => {
                                    handleSelectChange("priority", value);
                                  }}
                                  options={[
                                    {
                                      value: "high",
                                      label: "High",
                                    },
                                    {
                                      value: "low",
                                      label: "Low",
                                    },
                                    {
                                      value: "lowest",
                                      label: "Lowest",
                                    },
                                    {
                                      value: "medium",
                                      label: "Medium",
                                    },
                                  ]}
                                />
                              </div>
                            </div>
                            <div className="d-flex">
                              <p className="me-3">Estimate</p>
                              <div>
                                <Input
                                  value={estimate}
                                  onClick={handleEditorClick}
                                  onBlur={handleEditorBlur}
                                  onChange={(e) => {
                                    handleEditorChange(e, setEstimate);
                                  }}
                                />
                              </div>
                            </div>

                            <div className="row my-2">
                              <label className="mb-2 fw-bold">
                                Time Tracking
                              </label>
                              <div className="d-flex">
                                <div className="col">
                                  <Input
                                    id="timeTrackingspent"
                                    className="d-block w-100 fs-6"
                                    value={trackingSpent}
                                    onChange={(e) => {
                                      handleTimeTracking(
                                        e.target.value,
                                        setTrackingSpent
                                      );
                                    }}
                                    onClick={handleEditorClick}
                                    onBlur={handleEditorBlur}
                                  />
                                  <label className="mb-2">Time spent</label>
                                </div>

                                <div className="col ms-2">
                                  <Input
                                    id="timeTrackingRemaining"
                                    className="d-block w-100 fs-6"
                                    value={trackingRemaining}
                                    onChange={(e) => {
                                      handleTimeTracking(
                                        e.target.value,
                                        setTrackingRemaining
                                      );
                                    }}
                                    onClick={handleEditorClick}
                                    onBlur={handleEditorBlur}
                                  />
                                  <label className="mb-2">Time remaining</label>
                                </div>
                              </div>
                              <div className="px-2 mt-2">
                                <Slider max={estimate} value={sliderValue} />
                                <div className="d-flex justify-content-between">
                                  <p>{trackingSpent}m logged</p>
                                  <p>{trackingRemaining}m remaining</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ),
                      },
                    ]}
                  />
                </div>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default ProjectDetail;
