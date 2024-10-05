import { Avatar, Card, List } from "antd";
import { useCallback, useEffect, useState } from "react";
import ViewFeedBackModal from "../../components/feedback/ViewFeedBackModal";
import { useLazyGetFeedBackTeacherQuery } from "../../redux/user/userAPI";
import { getAvatarname } from "../../utils/common";

const FeedBack = () => {
  const [getTeacherForFeedBack, { isLoading }] =
    useLazyGetFeedBackTeacherQuery();
  const [data, setData] = useState([] as any);
  const [isModalOpen, setIsOpenModal] = useState(false);
  const [modalData, setModalData] = useState({} as any);

  const handleGetFeedBackTeachers = useCallback(async () => {
    const { data } = await getTeacherForFeedBack({});
    if (data?.status) {
      setData(data?.teachers);
    }
  }, [getTeacherForFeedBack, setData]);

  useEffect(() => {
    handleGetFeedBackTeachers();
  }, []);

  const handleOpenViewModal = (viewData: any) => {
    setModalData(viewData);
    setIsOpenModal(true);
  };

  return (
    <>
      <div className="p-4">
        <div className="my-4 flex items-center justify-between">
          <div className="text-gray-600 text-2xl font-bold">
            Feed Back for Teachers
          </div>
        </div>

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
                  onClick={() => handleOpenViewModal(item)}
                  title={item?.title}
                  hoverable
                  className="max-w-xs"
                >
                  <div className="w-full">
                    <div className="flex items-center justify-start gap-2 my-2">
                      <Avatar size={"large"} src={item?.avatar?.url}>
                        {getAvatarname(item?.name || "")}
                      </Avatar>
                    </div>
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
                  </div>
                </Card>
              </List.Item>
            );
          }}
        />
      </div>
      {isModalOpen && (
        <ViewFeedBackModal
          loadQuery={handleGetFeedBackTeachers}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsOpenModal}
          viewData={modalData}
        />
      )}
    </>
  );
};

export default FeedBack;
