import EmojiPicker, { EmojiStyle, Theme } from "emoji-picker-react";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { GrAttachment } from "react-icons/gr";
import { IoSend } from "react-icons/io5";
import { RiEmojiStickerLine } from "react-icons/ri";
import useComponentVisible from "../../hooks/useComponentVisible";
import { useAppStore } from "../../store";
import { useSocket } from "../../context/SocketContext";
import { useSelector } from "react-redux";
import { useUploadFileMutation } from "../../redux/messages/messageAPI";
import { message as toast } from "antd";
import axios from "axios";

const ENDPOINT = import.meta.env.VITE_SERVER_URI || "";

const MessageBar = () => {
  const [messageApi, contextHolder] = toast.useMessage();

  const { user } = useSelector((state: any) => state.auth);
  const [uploadFile, { isLoading, error, isSuccess, data }] =
    useUploadFileMutation();
  const { socket } = useSocket();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const {
    // @ts-expect-error state
    selectedChatType,
    // @ts-expect-error state
    selectedChatData,
    // @ts-expect-error state
    selectedChatMessages,
    // @ts-expect-error state
    setIsUploading,
    // @ts-expect-error state
    setIsDownloading,
    // @ts-expect-error state
    setfileUploadProgress,
  } = useAppStore();
  const { ref, isComponentVisible, setIsComponentVisible } =
    useComponentVisible(false);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    if (isSuccess) {
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
  }, [isSuccess, error, data, messageApi]);

  const handlesendMessage = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (selectedChatType === "contact") {
      // @ts-expect-error state
      socket.emit("sendMessage", {
        sender: user?._id,
        content: message,
        recipient: selectedChatData?._id,
        messagetype: "text",
        fileUrl: undefined,
      });
    } else if (selectedChatType === "channel") {
      socket?.emit("send-channel-message", {
        sender: user?._id,
        content: message,
        messagetype: "text",
        fileUrl: undefined,
        channelId: selectedChatData?._id,
      });
    }
    setMessage("");
  };

  const handleAttachmentClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleAttachmentChange = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    try {
      const file = event.target.files ? event.target.files[0] : null;
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        setIsUploading(true);
        // const response = await uploadFile({ file }).unwrap();
        const response = await axios.post(`${ENDPOINT}upload-file`, formData, {
          withCredentials: true,
          onUploadProgress: (data) => {
            setfileUploadProgress(
              Math.round((100 * data.loaded) / data.total!)
            );
          },
        });
        if (response?.status == 200 && response.data) {
          console.log(selectedChatType, "chat type");
          if (selectedChatType === "contact") {
            setIsUploading(false);
            // @ts-expect-error state
            socket.emit("sendMessage", {
              sender: user?._id,
              content: undefined,
              recipient: selectedChatData?._id,
              messagetype: "file",
              fileUrl: response.data.filePath,
            });
          } else if (selectedChatType === "channel") {
            console.log("andr");
            socket?.emit("send-channel-message", {
              sender: user?._id,
              content: undefined,
              messagetype: "file",
              fileUrl: response.data.filePath,
              channelId: selectedChatData?._id,
            });
          }
        }
      } else {
        console.log("No file selected");
      }
    } catch (err) {
      setIsUploading(false);
      console.error(err, "...error");
    }
  };

  return (
    <>
      {contextHolder}
      <form onSubmit={handlesendMessage}>
        <div className="h-[10vh] bg-[#1c1d25] flex justify-center items-center px-8 mb-[72px] md:mb-6 gap-4 md:gap-6">
          <div className="flex-1 flex bg-[#2a2b33] rounded-md items-center gap-5 pr-5">
            <input
              type="text"
              className="flex-1 bg-transparent md:p-5 p-3 rounded-md focus:border-none focus:outline-none"
              placeholder="Enter Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button
              type="button"
              className="text-neutral-500 focus:outline-none focus:text-white duration-300 transition-all"
              onClick={handleAttachmentClick}
            >
              <GrAttachment className="text-2xl" />
            </button>
            <input
              type="file"
              name="upload_file"
              id="input_file"
              className="hidden"
              ref={fileInputRef}
              onChange={handleAttachmentChange}
            />
            <div className="relative">
              <button
                type="button"
                className="text-neutral-500 focus:outline-none focus:text-white duration-300 transition-all"
                onClick={() => setIsComponentVisible(true)}
              >
                <RiEmojiStickerLine className="text-2xl" />
              </button>
              <div className="absolute bottom-16 right-0" ref={ref}>
                <EmojiPicker
                  onEmojiClick={({ emoji }) =>
                    setMessage((prev) => prev + emoji)
                  }
                  open={isComponentVisible}
                  // theme={Theme}
                  // emojiStyle={EmojiStyle}
                  autoFocusSearch={false}
                />
              </div>
            </div>
          </div>
          <button
            className="text-neutral-500 focus:outline-none focus:text-white duration-300 transition-all"
            // onClick={handlesendMessage}
            type="submit"
          >
            <IoSend className="text-2xl" />
          </button>
        </div>
      </form>
    </>
  );
};

export default MessageBar;
