import { useSelector } from "react-redux";

export const createChatSlice = (set: any, get: any) => ({
  selectedChatType: undefined,
  selectedChatData: undefined,
  selectedChatMessages: [],
  DMContacts: [],
  isUploading: false,
  isDownloading: false,
  fileUploadProgress: 0,
  fileDownloadProgress: 0,
  channels: [],

  userNotifications: [],

  setUserNotifications: (userNotifications: []) => set({ userNotifications }),

  setChannels: (channels: []) => set({ channels }),
  setIsUploading: (isUploading: boolean) => set({ isUploading }),
  setIsDownloading: (isDownloading: boolean) => set({ isDownloading }),
  setfileUploadProgress: (fileUploadProgress: number) =>
    set({ fileUploadProgress }),
  setfileDownloadProgress: (fileDownloadProgress: boolean) =>
    set({ fileDownloadProgress }),

  setSelectedChatType: (selectedChatType: any) => set({ selectedChatType }),
  setSelectedChatData: (selectedChatData: any) => set({ selectedChatData }),
  setSelectedChatMessages: (selectedChatMessages: any) =>
    set({ selectedChatMessages }),
  setDMContacts: (DMContacts: any) => set({ DMContacts }),
  addChannel: (channel: any) => {
    const channels = get().channels;
    set({ channels: [channel, ...channels] });
  },

  closeChat: () =>
    set({
      selectedChatData: undefined,
      selectedChatType: undefined,
      selectedChatMessages: [],
    }),
  addMessage: (message: any) => {
    const selectedChatMessages = get().selectedChatMessages;
    const selectedChatType = get().selectedChatType;

    set({
      selectedChatMessages: [
        ...selectedChatMessages,
        {
          ...message,
          recipient:
            selectedChatType === "channel"
              ? message.recipient
              : message.recipient._id,
          sender:
            selectedChatType === "channel"
              ? message.sender
              : message.sender._id,
        },
      ],
    });
  },
  // addChannelInChannelList: (message: any) => {
  //   const channels = get().channels;
  //   const data = channels.find(
  //     (channel: any) => channel._id === message.channelId
  //   );

  //   const index = channels.findIndex(
  //     (channel: any) => channel._id === message.channelId
  //   );
  //   console.log(channels, data, index, "data context");
  //   if (index !== -1 && index !== undefined) {
  //     channels.splice(index, 1);
  //     channels.unshift(data);
  //   }
  // },

  addChannelInChannelList: (message: any) => {
    const channels = [...get().channels];
    const index = channels.findIndex(
      (channel: any) => channel._id === message.channelId
    );

    if (index !== -1 && index !== undefined) {
      const [data] = channels.splice(index, 1);
      channels.unshift(data);
      set({ channels });
    }
  },

  // addContactsInDMContacts: (userID:string,message:any) => {
  //   const fromId=message?.sender?._id===userID?message?.recipient?._id:message?.sender?._id
  //   const fromData=
  // },
});
