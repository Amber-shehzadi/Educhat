import { Button, Dropdown, Input, MenuProps, message, Tooltip } from "antd";
import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { IoChatbubbleOutline, IoChatbubblesOutline } from "react-icons/io5";
import { RiChatNewLine } from "react-icons/ri";
import { useSelector } from "react-redux";
import CreateChatModal from "./CreateChatModal";
import { useLazyGetAllContactsQuery } from "../../redux/messages/messageAPI";
import { useAppStore } from "../../store";
import ContactList from "./ContactList";
import { useLazyGetUserChannelsQuery } from "../../redux/conversation/conversationAPI";

const ContactContainer = () => {
  const [messageApi, contextHolder] = message.useMessage();

  const { user } = useSelector((state: any) => state.auth);
  const {
    // @ts-expect-error state
    selectedChatType,
    // @ts-expect-error state
    selectedChatData,
    // @ts-expect-error state
    selectedChatMessages,
    // @ts-expect-error state
    setSelectedChatMessages,
    // @ts-expect-error state
    setDMContacts,
    // @ts-expect-error state
    DMContacts,
    // @ts-expect-error state
    channels,
    // @ts-expect-error state
    setChannels,
  } = useAppStore();
  const [getAllContacts, { isLoading, error }] = useLazyGetAllContactsQuery();
  const [getUserChannels, { isLoading: channelLoading, error: channelError }] =
    useLazyGetUserChannelsQuery();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGroupchat, setIsGroupchat] = useState(false);
  const handleSingleChat = () => {
    setIsModalOpen(true);
  };

  const handleGroupChat = () => {
    setIsModalOpen(true);
    setIsGroupchat(true);
  };

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: "Single Chat",
      icon: <IoChatbubbleOutline />,
      onClick: handleSingleChat,
    },
    {
      key: "2",
      label: "Group chat",
      icon: <IoChatbubblesOutline />,
      onClick: handleGroupChat,
    },
  ];

  useEffect(() => {
    const getMessageData = async () => {
      // if (selectedChatData?._id) {
      const { data } = await getAllContacts({});
      if (data?.contacts?.length) {
        setDMContacts(data?.contacts);
      }
      // }
    };

    const getAllChannels = async () => {
      // if (selectedChatData?._id) {
      const { data } = await getUserChannels({});
      console.log(data, "chanel data");
      if (data?.success) {
        setChannels(data?.channels);
      }
      // }
    };
    getMessageData();
    getAllChannels();
    // }
  }, [
    selectedChatData,
    selectedChatType,
    getAllContacts,
    setDMContacts,
    getUserChannels,
  ]);

  useEffect(() => {
    if (error) {
      if ("data" in error) {
        const errordata: any = error;
        messageApi.open({
          type: "error",
          content: errordata.data.message,
        });
      }
    }

    if (channelError) {
      if ("data" in channelError) {
        const errordata: any = channelError;
        messageApi.open({
          type: "error",
          content: errordata.data.message,
        });
      }
    }
  }, [error, messageApi, channelError]);

  return (
    <>
      {contextHolder}
      <div className="relative md:w-[35vw] lg:w-[30vw] xl:w-[20vw] bg-[#1b1c24] border-r-2 border-[#2f303b] w-full">
        <div className="pt-3">
          <div className="flex justify-between gap-2 items-center mb-4 mx-2">
            <Input
              className="sm:inline-flex hidden rounded-full"
              placeholder="Search"
              // onChange={handleSearchConversations}
              // disabled={convLoading}
              suffix={
                <Tooltip title="Search chats">
                  <FaSearch style={{ color: "rgba(0,0,0,.45)" }} />
                </Tooltip>
              }
            />
            <Dropdown menu={{ items }} arrow trigger={["click"]}>
              <Button shape="circle">
                <RiChatNewLine size={18} />
              </Button>
            </Dropdown>
          </div>
        </div>
        <div className="my-5">
          <div className="flex items-center justify-between pr-10">
            <Title text="Conversations" />
          </div>
          <div className="max-h-[38vh] overflow-y-auto">
            <ContactList contacts={DMContacts} />
          </div>
        </div>
        <div className="my-5">
          <div className="flex items-center justify-between pr-10">
            <Title text="Groups" />
          </div>
          <div className="max-h-[38vh] overflow-y-auto">
            <ContactList contacts={channels} isChannel={true} />
          </div>
        </div>
      </div>
      {isModalOpen && (
        <CreateChatModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          setIsGroupchat={setIsGroupchat}
          isGroupchat={isGroupchat}
          user={user}
        />
      )}
    </>
  );
};

export default ContactContainer;

const Title = ({ text }: { text: string }) => {
  return (
    <h6 className="uppercase tracking-widest text-neutral-400 pl-10 font-light text-opacity-90 text-sm">
      {text}
    </h6>
  );
};
