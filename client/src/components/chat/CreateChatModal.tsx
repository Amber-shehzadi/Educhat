import { Avatar, Divider, Input, List, Modal, Tooltip, message } from "antd";
import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { TiTick } from "react-icons/ti";
import SimpleBar from "simplebar-react";
import { useLazyGetChatUserQuery } from "../../redux/user/userAPI";
import { assignAvaatr, getAvatarname } from "../../utils/common";
import { useAppStore } from "../../store";
import { useCreateChannelMutation } from "../../redux/conversation/conversationAPI";

type Props = {
  isModalOpen: boolean;
  isGroupchat: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsGroupchat: React.Dispatch<React.SetStateAction<boolean>>;
  user: any;
};

const CreateChatModal: React.FC<Props> = ({
  isModalOpen,
  isGroupchat,
  setIsModalOpen,
  setIsGroupchat,
  user,
}) => {
  // @ts-expect-error state
  const { setSelectedChatType, setSelectedChatData, addChannel } =
    useAppStore();

  const [getUserForChat, { isLoading, data, error, isSuccess }] =
    useLazyGetChatUserQuery();
  const [createChannel, { isLoading: channelLoading }] =
    useCreateChannelMutation();

  const [messageApi, contextHolder] = message.useMessage();

  const [users, setUsers] = useState(data?.users || []);
  const [chatUsers, setChatUsers] = useState<string[]>([user?._id]);
  const [groupName, setGroupName] = useState<string>("");

  useEffect(() => {
    setUsers(data?.user);
  }, [data?.user]);

  useEffect(() => {
    setChatUsers([user?._id]);
  }, [user]);

  useEffect(() => {
    getUserForChat({});
  }, [getUserForChat]);

  useEffect(() => {
    if (isSuccess) {
      setUsers(data?.users);
      console.log(data, "data");
    }

    if (error) {
      if ("data" in error) {
        const errordata: any = error;
        messageApi.open({
          type: "error",
          content: errordata.data.message,
        });
      }
    }
  }, [isSuccess, error, messageApi, data]);
  const handleFilterUsers = (e: any) => {
    const searched = e.target.value.toLowerCase();
    const filteredUsers = data?.users.filter(
      (user: any) =>
        user?.name?.toLowerCase().includes(searched) ||
        user?.email?.toLowerCase().includes(searched)
    );
    setUsers(filteredUsers);
  };

  const handleGroupUser = (userId: string) => {
    setChatUsers((prevSelectedUserIds) => {
      if (prevSelectedUserIds.includes(userId)) {
        // If the user is already selected, remove them from the selected users
        return prevSelectedUserIds.filter((id) => id !== userId);
      } else {
        // If the user is not selected, add them to the list of selected users
        return [...prevSelectedUserIds, userId];
      }
    });
  };
  console.log(users, "user");

  const handleSelectUser = (contact: any) => {
    setSelectedChatType("contact");
    setSelectedChatData(contact);
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setIsGroupchat(false);
  };

  const handleOk = async () => {
    const { data } = await createChannel({
      name: groupName,
      members: chatUsers,
    });
    if (data?.success) {
      setGroupName("");
      setChatUsers([user?._id]);
      addChannel(data?.channel);
      setIsModalOpen(false);
    }
  };

  return (
    <>
      {contextHolder}
      <Modal
        title={
          isGroupchat ? (
            <h1>
              Create New Group
              <small className="text-red-500">
                (Select at least 2 participants)
              </small>
            </h1>
          ) : (
            "Start New Conversation"
          )
        }
        open={isModalOpen}
        onOk={handleOk}
        okButtonProps={{
          disabled:
            (isGroupchat
              ? chatUsers.length <= 2 || groupName.length < 4
              : chatUsers.length <= 1) ||
            isLoading ||
            channelLoading,
          loading: isLoading || channelLoading,
        }}
        onCancel={handleCancel}
        centered
        footer={isGroupchat ? undefined : null}
      >
        <div className="flex flex-col justify-between mb-4 gap-4">
          <h1 className="text-2xl font-semibold">Users</h1>
          <Input
            className="sm:inline-flex hidden rounded-full"
            placeholder="Search"
            onChange={handleFilterUsers}
            suffix={
              <Tooltip title="Search users">
                <FaSearch style={{ color: "rgba(0,0,0,.45)" }} />
              </Tooltip>
            }
          />
        </div>
        {isGroupchat && chatUsers.length >= 3 && (
          <div className="flex justify-between items-center my-2 gap-4 ml-auto">
            <h1 className="font-semibold text-nowrap">
              Group Name <small className="text-red-500">*</small>
            </h1>
            <div className="w-full">
              <Input
                className="rounded-full w-full"
                placeholder="Add group name here"
                size="small"
                onChange={(e) => setGroupName(e.target.value)}
                status={groupName.length < 4 ? "error" : ""}
              />
              {groupName && groupName.length < 4 && (
                <small className="text-red-500 my-2">
                  Group name must be at least 4 characters long
                </small>
              )}
            </div>
          </div>
        )}
        <Divider className="m-0 shadow-md" />
        <div className="max-h-72 overflow-y-auto flex-grow">
          <List
            itemLayout="horizontal"
            dataSource={users}
            renderItem={(item: any) => (
              <List.Item
                onClick={() =>
                  isGroupchat
                    ? handleGroupUser(item?._id)
                    : handleSelectUser(item)
                }
              >
                <div className="flex items-center gap-2.5 max-w-full w-full overflow-hidden cursor-pointer relative group">
                  <Avatar
                    src={item?.avatar?.url || assignAvaatr(item?.gender)}
                    size="large"
                    className="flex-shrink-0"
                  >
                    {getAvatarname(item?.name || "Unknow User")}
                  </Avatar>
                  <div className="flex flex-col flex-grow overflow-hidden">
                    <div className="flex justify-between items-center">
                      <h1 className="text-lg font-medium">{item?.name}</h1>
                    </div>
                    <small className="text-ellipsis whitespace-nowrap overflow-hidden font-semibold">
                      {item?.assignedClasses[0]?.semester}
                    </small>
                  </div>
                  {chatUsers.includes(item?._id) && (
                    <TiTick className="flex-shrink-0" color="green" size={20} />
                  )}
                </div>
              </List.Item>
            )}
          />
        </div>
      </Modal>
    </>
  );
};

export default CreateChatModal;
