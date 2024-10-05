import React, { FC } from "react";
import { useAppStore } from "../../store";
import { Avatar } from "antd";
import { assignAvaatr, getAvatarname } from "../../utils/common";

type Props = {
  contacts: [any];
  isChannel?: boolean;
};

const ContactList: FC<Props> = ({ contacts, isChannel = false }) => {
  const {
    // @ts-expect-error state
    selectedChatType,
    // @ts-expect-error state
    selectedChatData,
    // @ts-expect-error state
    setSelectedChatType,
    // @ts-expect-error state
    setSelectedChatData,
    // @ts-expect-error state
    setSelectedChatMessages,
  } = useAppStore();

  const handleClick = (contact: any) => {
    if (isChannel) setSelectedChatType("channel");
    else setSelectedChatType("contact");
    setSelectedChatData(contact);
    if (selectedChatData && selectedChatData?._id !== contact?._id) {
      setSelectedChatMessages([]);
    }
  };
  return (
    <div className="mt-5">
      {contacts?.map((contact, idx) => (
        <div
          key={idx}
          className={`pl-10 py-2 transition-all duration-300 cursor-pointer ${
            selectedChatData && selectedChatData?._id === contact?._id
              ? "bg-[#8417ff] hover:bg-[#8417ff]"
              : "hover:bg-[#f1f1f111]"
          }`}
          onClick={() => handleClick(contact)}
        >
          <div className="flex items-center gap-2.5 justify-start text-neutral-300">
            {!isChannel ? (
              <Avatar
                src={contact?.avatar?.url || assignAvaatr(contact?.gender)}
                size="large"
                className="flex-shrink-0"
              >
                {getAvatarname(contact?.name || "Unknow User")}
              </Avatar>
            ) : (
              <div className="bg-[#ffffff22] h-10 w-10 flex items-center justify-center rounded-full">
                #
              </div>
            )}
            <div className="flex flex-col flex-grow overflow-hidden">
              <div className="flex justify-between items-center">
                <h1 className="text-lg font-medium">{contact?.name}</h1>
              </div>
              <small className="text-ellipsis whitespace-nowrap overflow-hidden ">
                {contact?.lastMessage}
              </small>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ContactList;
