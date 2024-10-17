import {
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Dropdown,
  Input,
  List,
  MenuProps,
  message,
  Popconfirm,
  Tabs,
  Tooltip,
} from "antd";
import React, { useEffect, useMemo, useState } from "react";
import FacultyModal from "../../components/users/FacultyModal";
import TeacherStudent from "../../components/users/TeacherStudent";
import { FaPlus, FaSearch } from "react-icons/fa";
import moment from "moment";
import {
  useLazyGetAllfacultiesQuery,
  useLazyGetAllStudentsQuery,
  useLazyGetAllteachersQuery,
  useUpdateRoleMutation,
  useVerifyUserMutation,
} from "../../redux/user/userAPI";
import { useSelector } from "react-redux";
import TeahcerViewModal from "../../components/users/TeahcerViewModal";

const Users = () => {
  const roleItems: MenuProps["items"] = [
    {
      key: "admin",
      label: "Admin",
    },
    {
      key: "teacher",
      label: "Teacher",
    },
    {
      key: "coordinator",
      label: "Coordinator",
    },
    {
      key: "student",
      label: "Student",
    },
  ];

  const verifyItems: MenuProps["items"] = [
    {
      key: "verify",
      label: "Verify",
    },
    {
      key: "not-verify",
      label: "Not Verify",
    },
  ];

  const { user } = useSelector((state: any) => state.auth);
  const [messageApi, contextHolder] = message.useMessage();
  const [isEditModal, setIsEditModal] = useState(false);
  const [feedBackModal, setfeedBackModal] = useState(false);
  const [editData, setEditData] = useState({} as any);

  const [getAllFaculties, { isLoading }] = useLazyGetAllfacultiesQuery();
  const [
    updateUserRole,
    { isLoading: roleLoading, isSuccess, isError, error, data: roleData },
  ] = useUpdateRoleMutation();

  const [
    verifyUser,
    {
      isLoading: verifyLoading,
      isSuccess: verifySuccess,
      isError: verifyIsError,
      error: verifyError,
      data: verifyData,
    },
  ] = useVerifyUserMutation();

  const [getAllTeachers, { isLoading: teacherLoading }] =
    useLazyGetAllteachersQuery();
  const [getAllStudents, { isLoading: studentLoading }] =
    useLazyGetAllStudentsQuery();
  const [selectedTab, setSelectedTab] = useState(
    user.role === "coordinator" ? "student" : "coordinator"
  );
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [data, setData] = useState([] as any);
  const [users, setUsers] = useState([]);

  const handleGETFaculties = async () => {
    const { data } = await getAllFaculties({});
    if (data?.status) {
      setData(data?.faculties);
      setUsers(data?.faculties);
    }
  };
  useMemo(() => {
    handleGETFaculties();
  }, []);

  const handleGetAllTeachers = async () => {
    const { data } = await getAllTeachers({});
    if (data?.status) {
      setData(data?.teachers);
      setUsers(data?.teachers);
    }
  };

  const handleGetAllStudents = async () => {
    const { data } = await getAllStudents({});
    if (data?.status) {
      setData(data?.students);
      setUsers(data?.students);
    }
  };

  const handleChnageTab = (e: string) => {
    setData([]);
    setUsers([]);
    setIsOpenModal(false);
    setSelectedTab(e);
    if (e === "student") {
      return handleGetAllStudents();
    }
    if (e === "coordinator") {
      return handleGETFaculties();
    }
    return handleGetAllTeachers();
  };

  const handleFilterUser = (searchText: string) => {
    const filtered = data.filter(
      (item: any) =>
        item.name.toLowerCase().includes(searchText) ||
        item.email.toLowerCase().includes(searchText) ||
        item.cnic.toLowerCase().includes(searchText) ||
        item.contact.toLowerCase().includes(searchText)
    );

    setUsers(filtered);
  };

  const viewData = async (items: any) => {
    setEditData(items);
    setfeedBackModal(true);
  };

  const items = [
    {
      label: "Coordinator",
      key: "coordinator",
      children: (
        <List
          grid={{
            gutter: 16,
            xs: 1,
            sm: 2,
            lg: 3,
          }}
          dataSource={users}
          loading={isLoading || roleLoading}
          renderItem={(item: any) => {
            return (
              <List.Item>
                <Card
                  // onClick={() => handleOpenViewModal(item)}
                  title={item?.title}
                  hoverable
                  className="max-w-xs"
                  actions={[
                    // <EditOutlined
                    //   key="edit"
                    //   onClick={() => handleEditCoordinator(item)}
                    // />,
                    // <Popconfirm
                    //   title="Delete the task"
                    //   description="Are you sure to delete this task?"
                    //   // onConfirm={() => handleDeleteTodo(item?._id as string)}
                    //   okText="Yes"
                    //   cancelText="No"
                    // >
                    //   <DeleteOutlined key="delete" />
                    // </Popconfirm>,
                    // <EyeOutlined
                    //   key="view"
                    //   // onClick={() => handleOpenViewModal(item)}
                    // />,
                    <Dropdown
                      menu={{
                        items: verifyItems,
                        onClick: ({ key }) =>
                          handleVerifyUser(key, item?._id as string),
                        selectedKeys: [
                          item?.isVerified ? "verify" : "not-verify",
                        ],
                      }}
                      trigger={["click"]}
                      key="ellipsis"
                    >
                      {/* <EllipsisOutlined /> */}
                      <span>Verify</span>
                    </Dropdown>,
                    <Dropdown
                      menu={{
                        items: roleItems,
                        onClick: ({ key }) =>
                          handleUpdateRole(key, item?._id as string),
                        selectedKeys: [item?.role as string],
                      }}
                      trigger={["click"]}
                      key="ellipsis"
                    >
                      {/* <EllipsisOutlined /> */}
                      <span>Role</span>
                    </Dropdown>,
                  ]}
                >
                  <div className="w-full">
                    <div className="flex items-center justify-start gap-2 my-2">
                      <h1 className=" text-gray-800 font-semibold">Name:</h1>
                      <p className="truncate capitalize">{item?.name}</p>
                    </div>
                    <div className="flex items-center justify-start gap-2 my-2">
                      <h1 className=" text-gray-800 font-semibold">Email:</h1>
                      <p className="truncate">{item?.email}</p>
                    </div>
                    <div className="flex items-center justify-start gap-2 my-2">
                      <h1 className=" text-gray-800 font-semibold">
                        Verified:
                      </h1>
                      <p className="truncate">
                        {item?.isVerified ? "Yes" : "No"}
                      </p>
                    </div>
                    <div className="flex items-center justify-start gap-2 my-2">
                      <h1 className=" text-gray-800 font-semibold ">
                        Registered Date:
                      </h1>
                      <p className="truncate">
                        {moment(item?.createdAt).format("MMMM Do YYYY")}
                      </p>
                    </div>
                  </div>
                </Card>
              </List.Item>
            );
          }}
        />
      ),
    },
    {
      label: "Teachers",
      key: "teacher",
      children: (
        <List
          grid={{
            gutter: 16,
            xs: 1,
            sm: 2,
            lg: 3,
          }}
          dataSource={users}
          loading={teacherLoading}
          renderItem={(item: any) => {
            console.log(item, "role");
            return (
              <List.Item>
                <Card
                  // onClick={() => handleOpenViewModal(item)}
                  title={item?.title}
                  hoverable
                  className="max-w-xs"
                  actions={[
                    // <EditOutlined
                    //   key="edit"
                    //   // onClick={() => handleEditTodo(item)}
                    // />,
                    // <Popconfirm
                    //   title="Delete the task"
                    //   description="Are you sure to delete this task?"
                    //   // onConfirm={() => handleDeleteTodo(item?._id as string)}
                    //   okText="Yes"
                    //   cancelText="No"
                    // >
                    //   <DeleteOutlined key="delete" />
                    // </Popconfirm>,
                    <EyeOutlined key="view" onClick={() => viewData(item)} />,
                    <Dropdown
                      menu={{
                        items: verifyItems,
                        onClick: ({ key }) =>
                          handleVerifyUser(key, item?._id as string),
                        selectedKeys: [
                          item?.isVerified ? "verify" : "not-verify",
                        ],
                      }}
                      trigger={["click"]}
                      key="ellipsis"
                    >
                      {/* <EllipsisOutlined /> */}
                      <span>Verify</span>
                    </Dropdown>,
                    <Dropdown
                      menu={{
                        items: roleItems,
                        onClick: ({ key }) =>
                          handleUpdateRole(key, item?._id as string),
                        selectedKeys: [item?.role as string],
                      }}
                      trigger={["click"]}
                      key="ellipsis"
                    >
                      {/* <EllipsisOutlined /> */}
                      <span>Role</span>
                    </Dropdown>,
                  ]}
                >
                  <div className="w-full">
                    <div className="flex items-center justify-start gap-2 my-2">
                      <h1 className=" text-gray-800 font-semibold">Name:</h1>
                      <p className="truncate capitalize">{item?.name}</p>
                    </div>
                    <div className="flex items-center justify-start gap-2 my-2">
                      <h1 className=" text-gray-800 font-semibold">Gender:</h1>
                      <p className="truncate capitalize">{item?.gender}</p>
                    </div>
                    <div className="flex items-center justify-start gap-2 my-2">
                      <h1 className=" text-gray-800 font-semibold">Email:</h1>
                      <p className="truncate">{item?.email}</p>
                    </div>
                    <div className="flex items-center justify-start gap-2 my-2">
                      <h1 className=" text-gray-800 font-semibold">CNIC:</h1>
                      <p className="truncate">{item?.cnic}</p>
                    </div>
                    <div className="flex items-center justify-start gap-2 my-2">
                      <h1 className=" text-gray-800 font-semibold">Contact:</h1>
                      <p className="truncate">{item?.contact}</p>
                    </div>
                    <div className="flex items-center justify-start gap-2 my-2">
                      <h1 className=" text-gray-800 font-semibold">
                        Verified:
                      </h1>
                      <p className="truncate">
                        {item?.isVerified ? "Yes" : "No"}
                      </p>
                    </div>
                    <div className="flex items-center justify-start gap-2 my-2">
                      <h1 className=" text-gray-800 font-semibold ">
                        Registered Date:
                      </h1>
                      <p className="truncate">
                        {moment(item?.createdAt).format("MMMM Do YYYY")}
                      </p>
                    </div>
                  </div>
                </Card>
              </List.Item>
            );
          }}
        />
      ),
    },
    {
      label: "Students",
      key: "student",
      children: (
        <List
          grid={{
            gutter: 16,
            xs: 1,
            sm: 2,
            lg: 3,
          }}
          dataSource={users}
          loading={studentLoading}
          renderItem={(item: any) => {
            return (
              <List.Item>
                <Card
                  // onClick={() => handleOpenViewModal(item)}
                  title={item?.title}
                  hoverable
                  className="max-w-xs"
                  actions={[
                    // <EditOutlined
                    //   key="edit"
                    //   // onClick={() => handleEditTodo(item)}
                    // />,
                    // <Popconfirm
                    //   title="Delete the task"
                    //   description="Are you sure to delete this task?"
                    //   // onConfirm={() => handleDeleteTodo(item?._id as string)}
                    //   okText="Yes"
                    //   cancelText="No"
                    // >
                    //   <DeleteOutlined key="delete" />
                    // </Popconfirm>,
                    // <EyeOutlined
                    //   key="view"
                    //   // onClick={() => handleOpenViewModal(item)}
                    // />,
                    <Dropdown
                      menu={{
                        items: verifyItems,
                        onClick: ({ key }) =>
                          handleVerifyUser(key, item?._id as string),
                        selectedKeys: [
                          item?.isVerified ? "verify" : "not-verify",
                        ],
                      }}
                      trigger={["click"]}
                      key="ellipsis"
                    >
                      {/* <EllipsisOutlined /> */}
                      <span>Verify</span>
                    </Dropdown>,
                    <Dropdown
                      menu={{
                        items: roleItems,
                        onClick: ({ key }) =>
                          handleUpdateRole(key, item?._id as string),
                        selectedKeys: [item?.role as string],
                      }}
                      trigger={["click"]}
                      key="ellipsis"
                    >
                      {/* <EllipsisOutlined /> */}
                      <span>Role</span>
                    </Dropdown>,
                  ]}
                >
                  <div className="w-full">
                    <div className="flex items-center justify-start gap-2 my-2">
                      <h1 className=" text-gray-800 font-semibold">Name:</h1>
                      <p className="truncate capitalize">{item?.name}</p>
                    </div>
                    <div className="flex items-center justify-start gap-2 my-2">
                      <h1 className=" text-gray-800 font-semibold">Gender:</h1>
                      <p className="truncate capitalize">{item?.gender}</p>
                    </div>
                    <div className="flex items-center justify-start gap-2 my-2">
                      <h1 className=" text-gray-800 font-semibold">Email:</h1>
                      <p className="truncate">{item?.email}</p>
                    </div>
                    <div className="flex items-center justify-start gap-2 my-2">
                      <h1 className=" text-gray-800 font-semibold">CNIC:</h1>
                      <p className="truncate">{item?.cnic}</p>
                    </div>
                    <div className="flex items-center justify-start gap-2 my-2">
                      <h1 className=" text-gray-800 font-semibold">Contact:</h1>
                      <p className="truncate">{item?.contact}</p>
                    </div>
                    <div className="flex items-center justify-start gap-2 my-2">
                      <h1 className=" text-gray-800 font-semibold">
                        Verified:
                      </h1>
                      <p className="truncate">
                        {item?.isVerified ? "Yes" : "No"}
                      </p>
                    </div>
                    <div className="flex items-center justify-start gap-2 my-2">
                      <h1 className=" text-gray-800 font-semibold ">
                        Registered Date:
                      </h1>
                      <p className="truncate">
                        {moment(item?.createdAt).format("MMMM Do YYYY")}
                      </p>
                    </div>
                  </div>
                </Card>
              </List.Item>
            );
          }}
        />
      ),
    },
  ];

  const coordinatorItems = [
    {
      label: "Students",
      key: "student",
      children: (
        <List
          grid={{
            gutter: 16,
            xs: 1,
            sm: 2,
            lg: 3,
          }}
          dataSource={users}
          loading={studentLoading}
          renderItem={(item: any) => {
            return (
              <List.Item>
                <Card
                  // onClick={() => handleOpenViewModal(item)}
                  title={item?.title}
                  hoverable
                  className="max-w-xs"
                  // actions={[
                  //   <EditOutlined
                  //     key="edit"
                  //     // onClick={() => handleEditTodo(item)}
                  //   />,
                  //   <Popconfirm
                  //     title="Delete the task"
                  //     description="Are you sure to delete this task?"
                  //     // onConfirm={() => handleDeleteTodo(item?._id as string)}
                  //     okText="Yes"
                  //     cancelText="No"
                  //   >
                  //     <DeleteOutlined key="delete" />
                  //   </Popconfirm>,
                  //   <EyeOutlined
                  //     key="view"
                  //     // onClick={() => handleOpenViewModal(item)}
                  //   />,
                  // ]}
                >
                  <div className="w-full">
                    <div className="flex items-center justify-start gap-2 my-2">
                      <h1 className=" text-gray-800 font-semibold">Name:</h1>
                      <p className="truncate capitalize">{item?.name}</p>
                    </div>
                    <div className="flex items-center justify-start gap-2 my-2">
                      <h1 className=" text-gray-800 font-semibold">Gender:</h1>
                      <p className="truncate capitalize">{item?.gender}</p>
                    </div>
                    <div className="flex items-center justify-start gap-2 my-2">
                      <h1 className=" text-gray-800 font-semibold">Email:</h1>
                      <p className="truncate">{item?.email}</p>
                    </div>
                    <div className="flex items-center justify-start gap-2 my-2">
                      <h1 className=" text-gray-800 font-semibold">CNIC:</h1>
                      <p className="truncate">{item?.cnic}</p>
                    </div>
                    <div className="flex items-center justify-start gap-2 my-2">
                      <h1 className=" text-gray-800 font-semibold">Contact:</h1>
                      <p className="truncate">{item?.contact}</p>
                    </div>
                    <div className="flex items-center justify-start gap-2 my-2">
                      <h1 className=" text-gray-800 font-semibold ">
                        Registered Date:
                      </h1>
                      <p className="truncate">
                        {moment(item?.createdAt).format("MMMM Do YYYY")}
                      </p>
                    </div>
                  </div>
                </Card>
              </List.Item>
            );
          }}
        />
      ),
    },
  ];

  const handleUpdateRole = async (role: string, userId: string) => {
    await updateUserRole({ userId, role });
  };

  const handleVerifyUser = async (isVerified: string, userId: string) => {
    await verifyUser({
      userId,
      isVerified: isVerified === "verify" ? true : false,
    });
  };
  useEffect(() => {
    if (isSuccess) {
      const message = roleData?.message || "";
      messageApi.open({
        type: "success",
        content: message,
      });
      if (selectedTab === "student") {
        handleGetAllStudents();
        return;
      }
      if (selectedTab === "coordinator") {
        handleGETFaculties();
        return;
      }
      handleGetAllTeachers();
      return;
    }
    if (isError) {
      const errordata: any = error;
      messageApi.open({
        type: "error",
        content: errordata.data.message,
      });
    }
  }, [isSuccess, error, roleData, messageApi, isError]);

  useEffect(() => {
    if (verifySuccess) {
      const message = verifyData?.message || "";
      messageApi.open({
        type: "success",
        content: message,
      });
      if (selectedTab === "student") {
        handleGetAllStudents();
        return;
      }
      if (selectedTab === "coordinator") {
        handleGETFaculties();
        return;
      }
      handleGetAllTeachers();
      return;
    }
    if (verifyIsError) {
      const errordata: any = verifyIsError;
      messageApi.open({
        type: "error",
        content: errordata.data.message,
      });
    }
  }, [verifySuccess, verifyError, verifyData, messageApi, verifyIsError]);

  return (
    <>
      {contextHolder}
      <div className="p-4">
        <Tabs
          tabBarExtraContent={
            <div className="flex items-center justify-center flex-col md:flex-row gap-3">
              <Input
                type="text"
                onChange={(e) => handleFilterUser(e.target.value)}
                className="rounded-full"
                placeholder="Search"
                suffix={
                  <Tooltip title="Search user">
                    <FaSearch style={{ color: "rgba(0,0,0,.45)" }} />
                  </Tooltip>
                }
              />
              <Button
                className="custom-button capitalize"
                shape="round"
                icon={<FaPlus />}
                onClick={() => setIsOpenModal(true)}
              >
                {`Add ${selectedTab}`}
              </Button>
            </div>
          }
          items={user?.role === "coordinator" ? coordinatorItems : items}
          onChange={handleChnageTab}
        />
      </div>
      {isOpenModal &&
        (selectedTab === "coordinator" ? (
          <FacultyModal
            isModalOpen={isOpenModal}
            setIsModalOpen={setIsOpenModal}
            loadQuery={handleGETFaculties}
            setIsEditModal={setIsEditModal}
            isEditModal={isEditModal}
            editData={editData}
            setEditData={setEditData}
          />
        ) : (
          //@ts-expect-error state
          <TeacherStudent
            isModalOpen={isOpenModal}
            setIsModalOpen={setIsOpenModal}
            isStudentModal={selectedTab === "student"}
            loadQuery={
              selectedTab === "student"
                ? handleGetAllStudents
                : handleGetAllTeachers
            }
          />
        ))}

      {feedBackModal && (
        <TeahcerViewModal
          isModalOpen={feedBackModal}
          setIsModalOpen={setfeedBackModal}
          viewData={editData}
        />
      )}
    </>
  );
};

export default Users;
