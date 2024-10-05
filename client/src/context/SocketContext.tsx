import { DefaultEventsMap } from "@socket.io/component-emitter";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useSelector } from "react-redux";
import { io, Socket } from "socket.io-client";
import { useAppStore } from "../store";
import { notification } from "antd";

const ENDPOINT = import.meta.env.VITE_SOCKET_ENDPOINT || "";

interface SocketContextType {
  socket: Socket<DefaultEventsMap, DefaultEventsMap> | null;
}

const SocketContext = createContext<SocketContextType | null>(null);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [socket, setSocket] = useState<Socket<
    DefaultEventsMap,
    DefaultEventsMap
  > | null>(null);
  const { user } = useSelector((state: any) => state.auth);
  const [api, contextHolder] = notification.useNotification();

  const showNotification = (message: string, sender: string) => {
    api.info({
      message: `You have got a new message in chats`,
      description: <div className="truncate">{message}</div>,
      placement: "topRight",
    });
  };

  const showAnnouncementNotification = (title: string) => {
    api.info({
      message: `New announcement recieved`,
      description: <div className="truncate">{title}</div>,
      placement: "topRight",
    });
  };

  useEffect(() => {
    if (user) {
      const newSocket = io(ENDPOINT, {
        withCredentials: true,
        query: { userId: user?._id as string },
      });
      newSocket.on("connect", () => {
        console.log("User connected to socket server");
      });

      newSocket.on("notification", (notificationData: any) => {
        const { message, sender } = notificationData;

        // Show notification using Ant Design
        showNotification(message, sender);
      });

      newSocket.on("newAnnouncement", (announcement: any) => {
        const { title, description } = announcement;
        showAnnouncementNotification(title);
      });

      const handleRecieveMessage = (message: any) => {
        // @ts-expect-error state
        const { selectedChatData, selectedChatType, addMessage } =
          useAppStore.getState();
        if (
          selectedChatType &&
          (selectedChatData?._id === message?.sender?._id ||
            selectedChatData?._id === message?.recipient?._id)
        ) {
          addMessage(message);
        }
      };

      const handleRecieveChannelMessage = (message: any) => {
        const {
          // @ts-expect-error state
          selectedChatData,
          // @ts-expect-error state
          selectedChatType,
          // @ts-expect-error state
          addMessage,
          // @ts-expect-error state
          addChannelInChannelList,
        } = useAppStore.getState();
        if (selectedChatType && selectedChatData?._id === message?.channelId) {
          addMessage(message);
        }
        addChannelInChannelList(message);
      };

      newSocket.on("recieveMessage", handleRecieveMessage);
      newSocket.on("recieve-channel-message", handleRecieveChannelMessage);

      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    } else {
      setSocket(null);
    }
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket }}>
      <>
        {contextHolder}
        {children}
      </>
    </SocketContext.Provider>
  );
};
