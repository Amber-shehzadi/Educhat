import { FC, useState } from "react";
import ChatHeader from "./ChatHeader";
import MessageBar from "./MessageBar";
import MessageContainer from "./MessageContainer";

interface IChatContainer {}
const ChatContainer: FC<IChatContainer> = () => {
  const [openResouces, setOpenResources] = useState(false);
  return (
    <div className="fixed top-16 md:top-0 h-full w-full bg-[#1c1d25] flex flex-col md:static md:flex-1">
      <ChatHeader setOpenResources={setOpenResources} />
      <MessageContainer
        openResources={openResouces}
        setOpenResources={setOpenResources}
      />
      <MessageBar />
    </div>
  );
};

export default ChatContainer;
