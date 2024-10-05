import { Button, Card, message, Space, TableColumnsType } from "antd";
import DataTable from "../../components/common/DataTable";
import { FaPencil, FaPlus } from "react-icons/fa6";
import { useEffect, useState } from "react";
import ClassModal from "../../components/classes/ClassModal";
import {
  useDeleteClassMutation,
  useLazyGetAllClassesQuery,
} from "../../redux/classes/classAPI";
import { FaTrash } from "react-icons/fa";

interface DataType {
  key: React.Key;
  name: string;
  Session: string;
  semester: number;
  coordinator: string;
}

const Classes = () => {
  const [messageApi, contextHolder] = message.useMessage();

  const [getAllClasses, { isLoading, data, error, isSuccess, isError }] =
    useLazyGetAllClassesQuery();

  const [
    deleteClass,
    {
      error: deleteError,
      data: deleteData,
      isLoading: deleteIsLoading,
      isSuccess: deleteIsSuccess,
      isError: deleteIsError,
    },
  ] = useDeleteClassMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModal, setIsEditModal] = useState(false);
  const [editData, setEditData] = useState({} as any);
  const [tableData, setTableData] = useState<any[]>([]);

  useEffect(() => {
    getAllClasses({});
  }, [getAllClasses]);

  useEffect(() => {
    if (isSuccess) {
      setTableData(data?.classes);
      // const message = data?.message || "";
      // messageApi.open({
      //   type: "success",
      //   content: message,
      // });
    }
    if (isError) {
      if ("data" in error) {
        const errordata: any = error;
        messageApi.open({
          type: "error",
          content: errordata.data.message,
        });
      }
    }
  }, [isSuccess, error, data, messageApi, isError]);

  useEffect(() => {
    if (deleteIsSuccess) {
      const message = deleteData?.message || "";
      messageApi.open({
        type: "success",
        content: message,
      });
      getAllClasses({});
    }
    if (deleteIsError) {
      if ("data" in deleteError) {
        const errordata: any = deleteError;
        messageApi.open({
          type: "error",
          content: errordata.data.message,
        });
      }
    }
  }, [
    deleteData,
    deleteIsError,
    deleteIsSuccess,
    deleteError,
    getAllClasses,
    messageApi,
  ]);

  const handleOpenEditModal = (record: any) => {
    console.log(record, "record");
    setEditData(record);
    setIsEditModal(true);
    setIsModalOpen(true);
  };

  const handleDeleteClass = async (key: string) => {
    await deleteClass({ key });
  };
  const columns: TableColumnsType<DataType> = [
    {
      title: "Class Name",
      width: 100,
      dataIndex: "name",
      key: "name",
      fixed: "left",
    },
    // {
    //   title: "Session",
    //   width: 100,
    //   dataIndex: "Session",
    //   key: "Session",
    //   fixed: "left",
    // },
    {
      title: "Semester",
      width: 100,
      dataIndex: "semester",
      key: "semester",
      fixed: "left",
    },
    {
      title: "Action",
      key: "action",
      fixed: "right",
      width: 100,
      render: (_, record) => (
        <>
          <Button
            shape="circle"
            icon={
              <FaPencil
                color="#249444"
                onClick={() => handleOpenEditModal(record)}
              />
            }
          />
          &nbsp; &nbsp;
          <Button 
            shape="circle"
            icon={
              <FaTrash
                color="red"
                onClick={() => handleDeleteClass(record?.key as string)}
              />
            }
          />
        </>
      ),
    },
  ];

  return (
    <>
      {contextHolder}
      <Space direction="vertical" size={16} className="w-full">
        <Card
          title="Manage Classes"
          extra={
            <Button className="custom-button"
              shape="round"
              icon={<FaPlus />}
              onClick={() => setIsModalOpen(true)}
            >
              Create Class
            </Button>
          }
          className="w-full"
        >
          <DataTable
            data={tableData}
            isLoading={isLoading || deleteIsLoading}
            columns={columns}
          />
        </Card>
      </Space>

      {isModalOpen && (
        <ClassModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          loadQuery={getAllClasses}
          isEditModal={isEditModal}
          setIsEditModal={setIsEditModal}
          editData={editData}
          setEditData={setEditData}
        />
      )}
    </>
  );
};

export default Classes;
