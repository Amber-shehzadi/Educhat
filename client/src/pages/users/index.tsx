import {
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { Button, Card, Dropdown, List, Popconfirm, Tabs } from "antd";
import React, { useEffect, useState } from "react";
import FacultyModal from "../../components/users/FacultyModal";
import TeacherStudent from "../../components/users/TeacherStudent";
import { FaPlus } from "react-icons/fa";
import moment from "moment";
import {
 useLazyGetAllfacultiesQuery,
 useLazyGetAllStudentsQuery,
 useLazyGetAllteachersQuery,
} from "../../redux/user/userAPI";
import { useSelector } from "react-redux";

const Users = () => {
  const { user} = useSelector((state: any) => state.auth);
  const [getAllFaculties, { isLoading }] = useLazyGetAllfacultiesQuery();

  const [getAllTeachers, { isLoading: teacherLoading }] =
    useLazyGetAllteachersQuery();
  const [getAllStudents, { isLoading: studentLoading }] =
    useLazyGetAllStudentsQuery();
  const [selectedTab, setSelectedTab] = useState(user.role==="coordinator"?"student":"coordinator");
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [data, setData] = useState([] as any);
  const [editData, serEditData] = useState({} as any);

  const handleGETFaculties = async () => {
    const { data } = await getAllFaculties({});
    if (data?.status) {
      setData(data?.faculties);
    }
  };
  useEffect(() => {
    handleGETFaculties();
  }, [getAllFaculties]);

  const handleGetAllTeachers = async () => {
    const { data } = await getAllTeachers({});
    if (data?.status) {
      setData(data?.teachers);
    }
  };

  const handleGetAllStudents = async () => {
    const { data } = await getAllStudents({});
    if (data?.status) {
      setData(data?.students);
    }
  };

  const handleChnageTab = (e: string) => {
    setData([]);
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
          dataSource={data}
          loading={isLoading}
          renderItem={(item: any) => {
            return (
              <List.Item>
                <Card
                  // onClick={() => handleOpenViewModal(item)}
                  title={item?.title}
                  hoverable
                  className="max-w-xs"
                  actions={[
                    <EditOutlined
                      key="edit"
                      // onClick={() => handleEditTodo(item)}
                    />,
                    <Popconfirm
                      title="Delete the task"
                      description="Are you sure to delete this task?"
                      // onConfirm={() => handleDeleteTodo(item?._id as string)}
                      okText="Yes"
                      cancelText="No"
                    >
                      <DeleteOutlined key="delete" />
                    </Popconfirm>,
                    <EyeOutlined
                      key="view"
                      // onClick={() => handleOpenViewModal(item)}
                    />,
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
          dataSource={data}
          loading={teacherLoading}
          renderItem={(item: any) => {
            return (
              <List.Item>
                <Card
                  // onClick={() => handleOpenViewModal(item)}
                  title={item?.title}
                  hoverable
                  className="max-w-xs"
                  actions={[
                    <EditOutlined
                      key="edit"
                      // onClick={() => handleEditTodo(item)}
                    />,
                    <Popconfirm
                      title="Delete the task"
                      description="Are you sure to delete this task?"
                      // onConfirm={() => handleDeleteTodo(item?._id as string)}
                      okText="Yes"
                      cancelText="No"
                    >
                      <DeleteOutlined key="delete" />
                    </Popconfirm>,
                    <EyeOutlined
                      key="view"
                      // onClick={() => handleOpenViewModal(item)}
                    />,
                    <Dropdown
                      menu={{
                        items,
                        //   onClick: ({ key }) =>
                        //     handleOnStatusChnaged(key, item?._id as string),
                        //   selectedKeys: [item?.status as string],
                      }}
                      trigger={["click"]}
                      key="ellipsis"
                    >
                      <EllipsisOutlined />
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
          dataSource={data}
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
                    <EditOutlined
                      key="edit"
                      // onClick={() => handleEditTodo(item)}
                    />,
                    <Popconfirm
                      title="Delete the task"
                      description="Are you sure to delete this task?"
                      // onConfirm={() => handleDeleteTodo(item?._id as string)}
                      okText="Yes"
                      cancelText="No"
                    >
                      <DeleteOutlined key="delete" />
                    </Popconfirm>,
                    <EyeOutlined
                      key="view"
                      // onClick={() => handleOpenViewModal(item)}
                    />,
                    <Dropdown
                      menu={{
                        items,
                        //   onClick: ({ key }) =>
                        //     handleOnStatusChnaged(key, item?._id as string),
                        //   selectedKeys: [item?.status as string],
                      }}
                      trigger={["click"]}
                      key="ellipsis"
                    >
                      <EllipsisOutlined />
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
          dataSource={data}
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
                    <EditOutlined
                      key="edit"
                      // onClick={() => handleEditTodo(item)}
                    />,
                    <Popconfirm
                      title="Delete the task"
                      description="Are you sure to delete this task?"
                      // onConfirm={() => handleDeleteTodo(item?._id as string)}
                      okText="Yes"
                      cancelText="No"
                    >
                      <DeleteOutlined key="delete" />
                    </Popconfirm>,
                    <EyeOutlined
                      key="view"
                      // onClick={() => handleOpenViewModal(item)}
                    />,
                    <Dropdown
                      menu={{
                        items,
                        //   onClick: ({ key }) =>
                        //     handleOnStatusChnaged(key, item?._id as string),
                        //   selectedKeys: [item?.status as string],
                      }}
                      trigger={["click"]}
                      key="ellipsis"
                    >
                      <EllipsisOutlined />
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
  return (
    <>
      <div className="p-4">
        <Tabs
          tabBarExtraContent={
            <Button className="custom-button capitalize"
              shape="round"
              icon={<FaPlus />}
              onClick={() => setIsOpenModal(true)}
            >
              {`Add ${selectedTab}`}
            </Button>
          }
          items={user?.role==="coordinator"?coordinatorItems:items}
          onChange={handleChnageTab}
        />
      </div>
      {isOpenModal &&
        (selectedTab === "coordinator" ? (
          //@ts-ignore
          <FacultyModal       
            isModalOpen={isOpenModal}
            setIsModalOpen={setIsOpenModal}
            loadQuery={handleGETFaculties}
          />
        ) : (
          //@ts-ignore
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
    </>
  );
};

export default Users;
