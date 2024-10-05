import { Dispatch, FC, SetStateAction } from "react";
import { RiCloseFill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { setValue } from "../../redux/conversation/chatSlice";
import { useAppStore } from "../../store";
import { Avatar } from "antd";
import { assignAvaatr, getAvatarname } from "../../utils/common";
import { MdOutlinePermMedia } from "react-icons/md";

const ChatHeader = ({
  openResources,
  setOpenResources,
}: {
  openResources?: boolean;
  setOpenResources: Dispatch<SetStateAction<boolean>>;
}) => {
  // @ts-expect-error state
  const { closeChat, selectedChatData } = useAppStore();
  return (
    <div className="h-[10vh] border-b-2 border-[#2f303b] flex items-center justify-between px-4">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-5">
          <div className="flex gap-3 items-center justify-center">
            <div className="flex items-center gap-2.5 max-w-full w-full overflow-hidden cursor-pointer relative group">
              <Avatar
                src={
                  selectedChatData?.avatar?.url ||
                  assignAvaatr(selectedChatData?.gender)
                }
                size="large"
                className="flex-shrink-0"
              >
                {getAvatarname(selectedChatData?.name || "Unknow User")}
              </Avatar>
              <div className="flex flex-col flex-grow overflow-hidden">
                <div className="flex justify-between items-center">
                  <h1 className="text-lg font-medium">
                    {selectedChatData?.name}
                  </h1>
                </div>
                <small className="text-ellipsis whitespace-nowrap overflow-hidden font-semibold">
                  {selectedChatData?.email}
                </small>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center gap-5">
            <button 
              className="custom-button text-neutral-500 focus:outline-none focus:text-white duration-300 transition-all"
              onClick={() => closeChat()}
            >
              <RiCloseFill className="text-3xl" />
            </button>
          </div>
        </div>
        <button
          className="text-neutral-500 focus:outline-none focus:text-white duration-300 transition-all"
          onClick={() => setOpenResources(true)}
        >
          <MdOutlinePermMedia className="text-3xl" />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
