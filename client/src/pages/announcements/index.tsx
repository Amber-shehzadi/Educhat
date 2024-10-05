import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, List, Popconfirm, Skeleton, message } from "antd";
import { useEffect, useState, useCallback } from "react";
import { FaPlus } from "react-icons/fa";
import { useSelector } from "react-redux";
import AnnouncementModal from "../../components/announcements/AnnouncementModal";
import {
  useLazyGetPaginatedAnnouncementsQuery,
  useDeleteAnnouncementMutation, // Import the delete mutation
} from "../../redux/announcements/announcementAPI";

const Announcements = () => {
  const { user } = useSelector((state: any) => state.auth);
  const isFacultyOrAdmin = user?.role === "coordinator" || user?.role === "admin";

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModal, setIsEditModal] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [list, setList] = useState<any[]>([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true); // Track if there are more announcements
  const limit = 1000;

  const [getAnnouncementsData, { isLoading, isFetching }] =
    useLazyGetPaginatedAnnouncementsQuery();

  const [deleteAnnouncement] = useDeleteAnnouncementMutation(); // Hook for delete mutation

  // Define the handleAnnouncements function
  const handleAnnouncements = useCallback(async () => {
    // if (hasMore) {
    //   const { data } = await getAnnouncementsData({ limit, offset });
    //   if (data) {
    //     setList((prevList) => [...prevList, ...data.announcements]);
    //     setHasMore(data.hasMore); // Update hasMore based on API response
    //   }
    // } else {
    const { data } = await getAnnouncementsData({ limit, offset });
    setList(data.announcements);
    setHasMore(data.hasMore);
    // }
  }, [getAnnouncementsData, limit, offset, hasMore]);

  useEffect(() => {
    handleAnnouncements();
  }, [handleAnnouncements]);

  const handleLoadMore = () => {
    if (hasMore) {
      setOffset((prevOffset) => prevOffset + limit);
    }
  };

  // Delete announcement function
  const handleDeleteAnnouncement = async (id: string) => {
    try {
      await deleteAnnouncement({ id }).unwrap();
      setList((prevList) => prevList.filter((item) => item._id !== id));
      message.success("Announcement deleted successfully");
    } catch (error) {
      message.error("Failed to delete announcement");
    }
  };

  const handleEditAnnouncement = (item: any) => {
    setEditData(item);
    setIsEditModal(true);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="p-4">
        <div className="my-4 flex items-center justify-between">
          <div className="text-gray-600 text-2xl font-bold">
            All Announcements
          </div>
          {isFacultyOrAdmin && (
            <Button  className="custom-button "
            type="primary"
              shape="round"
              icon={<FaPlus />}
              onClick={() => setIsModalOpen(true)}
            >
              New Announcement
            </Button>
          )}
        </div>

        <List
          className="demo-loadmore-list"
          loading={isLoading || isFetching}
          itemLayout="horizontal"
          loadMore={
            !isLoading &&
            !isFetching &&
            hasMore && ( // Show button only if there are more items
              <div className="flex items-center justify-center">
                <Button style={{ width: "50%",
                     backgroundColor: "#4b0082", // Set your desired background color
                     color: "#ffffff", // Set the text color (white in this example)
                     borderColor: "#4b0082", // Set the border color to match the background
                     textAlign: "center"
                    }}
                  
                  onClick={handleLoadMore}
                  className="my-4 mx-auto"
                >
                  Load More
                </Button>
              </div>
            )
          }
          dataSource={list}
          renderItem={(item) => (
            <List.Item
              actions={
                isFacultyOrAdmin
                  ? [
                      <EditOutlined
                        key="edit"
                        onClick={() => handleEditAnnouncement(item)}
                      />,
                      <Popconfirm
                        title="Delete the announcement"
                        description="Are you sure to delete this announcement?"
                        onConfirm={() => handleDeleteAnnouncement(item._id)}
                        okText="Yes"
                        cancelText="No"
                      >
                        <DeleteOutlined key="delete" />
                      </Popconfirm>,
                    ]
                  : undefined
              }
            >
              <Skeleton title={false} loading={isLoading} active>
                <List.Item.Meta
                  title={item.title}
                  description={item.description}
                />
                <div>By: {item.createdBy?.name}</div>
              </Skeleton>
            </List.Item>
          )}
        />
      </div>

      {isModalOpen && (
        <AnnouncementModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          isEditModal={isEditModal}
          setIsEditModal={setIsEditModal}
          editData={editData}
          setEditData={setEditData}
          loadQuery={handleAnnouncements}
        />
      )}
    </>
  );
};

export default Announcements;
