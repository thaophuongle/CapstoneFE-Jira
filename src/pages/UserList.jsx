import React, { useEffect, useRef, useState } from "react";
import { Table, Button, Input, Space, Popconfirm } from "antd";
import {
  SearchOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteUserApiAction,
  getAllUsersApiAction,
} from "../redux/Reducers/UserReducer";
import EditUserModal from "../components/EditUserModal";

const UserList = () => {
  const { userArr } = useSelector((state) => state.userReducer);
  const dispatch = useDispatch();

  const getAllUser = async () => {
    const action = getAllUsersApiAction();
    dispatch(action);
  };

  const handleUpdate = () => {
    getAllUser() //re-render the user list after any user detail is updated
  }

  useEffect(() => {
    getAllUser();
    console.log("user array",userArr)
  }, []);

  //searching and sorting on the table
  const [sortedInfo, setSortedInfo] = useState({});
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);


  //delete confirm
  const confirm = (userId) => {
    // Dispatch the action with the userId
    dispatch(deleteUserApiAction(userId));
  };
  const cancel = (e) => {
    console.log(e);
    // message.error("Click on No");
  };

  const handleChange = (pagination, filters, sorter) => {
    setSortedInfo(sorter);
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const clearAll = () => {
    setSortedInfo({});
  setSearchText(""); 
  handleSearch([], () => {}, searchedColumn);
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => {clearFilters && handleReset(clearFilters);
              handleSearch(selectedKeys, confirm, dataIndex)}}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1677ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const columns = [
    {
      title: "No.",
      dataIndex: "no",
      name: "no",
      render: (text, record, index) => <p>{userArr.indexOf(record) + 1}</p>,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      name: "name",
      ...getColumnSearchProps("name"),
      sorter: (a, b) => a.name.localeCompare(b.name),
      sortOrder: sortedInfo.columnKey === "name" ? sortedInfo.order : null,
      ellipsis: true,
    },
    {
      title: "User ID",
      dataIndex: "userId",
      key: "userId",
      name: "userId",
      sorter: (a, b) => a.userId - b.userId,
      sortOrder: sortedInfo.columnKey === "userId" ? sortedInfo.order : null,
      ellipsis: true,
    },
    {
      title: "Email",
      dataIndex: "email",
      name: "email",
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      name: "phoneNumber",
    },
    {
      title: "Action",
      dataIndex: "action",
      name: "action",
      render: (text, record, index) => {
        return (
          <div className="d-flex flex-column flex-md-row">
            <EditUserModal record={record} handleUpdate={handleUpdate}/>
            <div className="mt-3 mt-md-0 mx-0 mx-md-3">
            <Popconfirm
              title="Delete the user"
              description="Are you sure to delete this user?"
              onConfirm={() => confirm(record.userId)}
              onCancel={cancel}
              okText="Yes"
              cancelText="No"
            >
              <a>
                <DeleteOutlined
                  style={{ color: "#ff0000", fontSize: "1.2rem" }}
                />
              </a>
            </Popconfirm>
            </div>
          </div>
        );
      },
    },
  ];
  

  return (
    <div className="container">
      <h2 className="text-center pt-5 pb-4">Users Management</h2>
      <Button onClick={clearAll}>Clear filters and sorters</Button>
      <Table
        className="mt-4"
        columns={columns}
        dataSource={userArr}
        onChange={handleChange}
      />
    </div>
  );
};

export default UserList;
