import SimpleBar from "simplebar-react";
import { useAppStore } from "../../store";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import moment from "moment";
import { useLazyAllMessagesQuery } from "../../redux/messages/messageAPI";
import { message } from "antd";
import ImagePreviewer from "./ImagePreviewer";
import { MdFolderZip } from "react-icons/md";
import { FaDownload } from "react-icons/fa6";
import axios from "axios";
import { useSelector } from "react-redux";
import { useLazyGetChannelMessagesQuery } from "../../redux/conversation/conversationAPI";
import { RiCloseFill } from "react-icons/ri";

const ENDPOINT = import.meta.env.VITE_SOCKET_ENDPOINT || "";

const MessageContainer = ({
  openResources,
  setOpenResources,
}: {
  openResources: boolean;
  setOpenResources: Dispatch<SetStateAction<boolean>>;
}) => {
  const { user } = useSelector((state: any) => state.auth);

  const [messageApi, contextHolder] = message.useMessage();

  const [getMessages, { data, isLoading, error, isSuccess }] =
    useLazyAllMessagesQuery();

  const [getChannelMessages] = useLazyGetChannelMessagesQuery();

  const [resourceType, setResourceType] = useState("image");

  const scrollRef = useRef<HTMLDivElement | null>(null);
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
    setfileDownloadProgress,
    // @ts-expect-error state
    setIsDownloading,
  } = useAppStore();

  const checkIfImage = (filePath: string): boolean => {
    const imageRegex =
      /\.(jpg|jpeg|png|gif|bmp|tiff|tif|webp|svg|ico|heic|heif)$/i;
    return imageRegex.test(filePath);
  };

  useEffect(() => {
    const getMessageData = async () => {
      if (selectedChatData?._id) {
        await getMessages({ recipient: selectedChatData._id });
      }
    };
    const getChnnelMessagesForChat = async () => {
      const { data } = await getChannelMessages({
        channelId: selectedChatData?._id,
      });
      setSelectedChatMessages(data?.messages);
    };

    if (selectedChatData?._id && selectedChatType === "contact") {
      getMessageData();
    } else if (selectedChatData?._id && selectedChatType === "channel") {
      getChnnelMessagesForChat();
    }
  }, [
    selectedChatData,
    selectedChatType,
    getMessages,
    getChannelMessages,
    setSelectedChatMessages,
  ]);

  useEffect(() => {
    if (isSuccess) {
      setSelectedChatMessages(data?.messages);
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
  }, [isSuccess, error, data, messageApi, setSelectedChatMessages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChatMessages]);

  const downloadFile = async (url: string) => {
    setIsDownloading(true);
    setfileDownloadProgress(0);
    const response = await axios.get(`${ENDPOINT}${url}`, {
      responseType: "blob",
      onDownloadProgress: (progressEvent) => {
        const { loaded, total } = progressEvent;
        const percentCompleted = Math.round((loaded * 100) / total!);
        setfileDownloadProgress(percentCompleted);
      },
    });
    const urlBlob = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = urlBlob;
    link.setAttribute("download", url.split("/").pop() as string);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(urlBlob);
    setIsDownloading(false);
    setfileDownloadProgress(0);
  };

  const renderMessage = (): JSX.Element[] => {
    let lastDate: string | null = null;
    return selectedChatMessages.map(
      (message: any, idx: number): JSX.Element => {
        const messageDate = moment(message?.createdAt).format("DD-MM-YYYY");
        const showDate = messageDate !== lastDate;
        lastDate = messageDate;
        return (
          <div key={idx}>
            {showDate && (
              <div className="text-center text-gray-500 my-2">
                {moment(message?.createdAt).format("DD MMMM YYYY")}
              </div>
            )}
            {selectedChatType === "contact" && renderDMMessages(message)}
            {selectedChatType === "channel" && renderChannelMessages(message)}
          </div>
        );
      }
    );
  };

  const renderDMMessages = (message: any) => (
    <div
      className={`${
        message?.sender !== selectedChatData?._id
          ? "mine"
          : "yours text-gray-800"
      } messages`}
    >
      {message?.messagetype === "text" ? (
        <div className="message">{message?.content}</div>
      ) : (
        <div className="message">
          {checkIfImage(message.fileUrl) ? (
            <ImagePreviewer src={`${ENDPOINT}${message.fileUrl}`} />
          ) : (
            <div className="flex items-center justify-center gap-4">
              <span className="text-white/80 text-3xl bg-black/20 rounded-full p-3">
                <MdFolderZip />
              </span>
              <span>{message.fileUrl.split("/").pop()}</span>
              <span
                className="bg-black/20 p-3 text-sm rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
                onClick={() => downloadFile(message?.fileUrl)}
              >
                <FaDownload />
              </span>
            </div>
          )}
        </div>
      )}
      <div className="text-xs text-gray-600">
        {moment(message?.createdAt).format("LT")}
      </div>
    </div>
  );

  const renderChannelMessages = (message: any) => (
    <div
      className={`${
        message?.sender?._id !== user?._id ? "yours  text-gray-800" : "mine"
      } messages`}
    >
      {message?.messagetype === "text" ? (
        <div className="message">{message?.content}</div>
      ) : (
        <div className="message">
          {checkIfImage(message.fileUrl) ? (
            <ImagePreviewer src={`${ENDPOINT}${message.fileUrl}`} />
          ) : (
            <div className="flex items-center justify-center gap-4">
              <span className="text-white/80 text-3xl bg-black/20 rounded-full p-3">
                <MdFolderZip />
              </span>
              <span>{message.fileUrl.split("/").pop()}</span>
              <span
                className="bg-black/20 p-3 text-sm rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
                onClick={() => downloadFile(message?.fileUrl)}
              >
                <FaDownload />
              </span>
            </div>
          )}
        </div>
      )}
      <div className="text-xs text-gray-600">
        {moment(message?.createdAt).format("LT")}
      </div>
    </div>
  );

  const renderResources = () => {
    return (
      <div className="w-full grid grid-cols-3 gap-2">
        {selectedChatMessages
          ?.filter((message: any) => message?.messagetype !== "text")
          ?.map((message: any, idx: number) => (
            <>
              {resourceType === "image" && checkIfImage(message.fileUrl) && (
                <div className="bg-[#2a2b33] p-2 rounded-md" key={idx}>
                  <ImagePreviewer
                    src={`${ENDPOINT}${message.fileUrl}`}
                    width={80}
                    height={80}
                  />
                </div>
              )}
              {resourceType === "other" && !checkIfImage(message.fileUrl) && (
                <div
                  className="bg-[#2a2b33] p-2 col-span-3 rounded-md"
                  key={idx}
                >
                  <div className="flex items-center justify-center gap-4">
                    <span className="text-white/80 text-3xl bg-black/20 rounded-full p-3">
                      <MdFolderZip />
                    </span>
                    <span>{message.fileUrl.split("/").pop()}</span>
                    <span
                      className="bg-black/20 p-3 text-sm rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
                      onClick={() => downloadFile(message?.fileUrl)}
                    >
                      <FaDownload />
                    </span>
                  </div>
                </div>
              )}
            </>
          ))}
      </div>
    );
  };
  return (
    <>
      {contextHolder}
      <div className="flex-1 overflow-y-auto scrollbar-hidden p-4 px-8 md:max-w-[65vw] lg:max-w-[70vw] xl:max-w-[80vw] w-full">
        <div
          className={`absolute top-0 right-0 bottom-0 max-w-xs md:max-w-sm w-full transition-transform duration-500 ease-in-out z-20 flex flex-col bg-[#1c1d25] border-[#2f303b] border-2 ${
            openResources ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="h-20 w-full " />
          <div className="flex-1 w-full  overflow-y-auto p-4">
            <div className="flex w-full justify-between items-center">
              <div className="flex items-center justify-center gap-4">
                <button
                  className={`${
                    resourceType === "image" ? "text-white" : "text-neutral-500"
                  } focus:outline-none focus:text-white duration-300 transition-all font-medium`}
                  onClick={() => setResourceType("image")}
                >
                  Images
                </button>
                <button
                  className={`${
                    resourceType === "other" ? "text-white" : "text-neutral-500"
                  } focus:outline-none focus:text-white duration-300 transition-all font-medium`}
                  onClick={() => setResourceType("other")}
                >
                  Others
                </button>
              </div>
              <button
                className="text-neutral-500 focus:outline-none focus:text-white duration-300 transition-all"
                onClick={() => setOpenResources(false)}
              >
                <RiCloseFill className="text-3xl" />
              </button>
            </div>
            <div className="my-2">{renderResources()}</div>
          </div>
        </div>
        {renderMessage()}
        <div ref={scrollRef} />
      </div>
    </>
  );
};

export default MessageContainer;
