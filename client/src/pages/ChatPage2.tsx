import ChatContainer from "../components/chat/ChatContainer";
import ContactContainer from "../components/chat/ContactContainer";
import EmptyChatContainer from "../components/chat/EmptyChatContainer";
import { useAppStore } from "../store";

const ChatPage2 = () => {
  const {
    // @ts-expect-error state
    selectedChatType,
    // @ts-expect-error state
    isUploading,
    // @ts-expect-error state
    isDownloading,
    // @ts-expect-error state
    fileUploadProgress,
    // @ts-expect-error state
    fileDownloadProgress,
  } = useAppStore();

  return (
    <div className="flex h-screen max-h-[calc(100vh-64px)] text-white overflow-hidden">
      {isUploading ||
        (isDownloading && (
          <div className="h-screen w-screen fixed top-0 z-50 left-0 bg-black/80 flex items-center justify-center flex-col gap-5 backdrop-blur-lg">
            <h5 className="text-5xl animate-pulse">
              {isUploading ? "Uploading File" : "Downloading File"}
            </h5>
            {isUploading ? fileUploadProgress : fileDownloadProgress}%
          </div>
        ))}
      <ContactContainer />
      {selectedChatType ? <ChatContainer /> : <EmptyChatContainer />}
    </div>
  );
};

export default ChatPage2;
