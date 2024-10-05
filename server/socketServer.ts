import { Server as SocketIOServer } from "socket.io";
import http from "http";
import Message from "./models/messages.model";
import ChannelModel from "./models/channel.model";
import AnnouncementModel from "./models/announcements.model";
import userModel from "./models/user.model";
import notificationsModel from "./models/notifications.model";

export const initSocketServer = (server: http.Server) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: ["http://localhost:3000", "http://localhost:5173"],
      methods: ["GET", "POST"],
      credentials: true,
    },

    pingTimeout: 60000,
  });

  const userSocket = new Map();

  // send notifications
  const sendNotification = async ({
    recipients,
    sender,
    message,
    io,
    userSocket,
  }: {
    recipients: string[];
    sender: string;
    message: any;
    io: SocketIOServer;
    userSocket: Map<string, string>;
  }) => {
    const filteredRecipients = recipients.filter((userId) => userId !== sender);

    const notificationData = {
      message: message.content,
      sender: message.sender,
    };

    filteredRecipients.forEach((userId) => {
      const recipientSocketId = userSocket.get(userId);
      if (recipientSocketId) {
        io.to(recipientSocketId).emit("notification", notificationData);
      }
    });
  };

  const sendMessage = async (message: any) => {
    const senderSocketId = userSocket.get(message.sender);
    const receiverSocketId = userSocket.get(message.recipient);

    const createdMessage = await Message.create(message);
    const messageData = await Message.findById(createdMessage?._id)
      .populate("sender", "id email contact avatar")
      .populate("recipient", "id email contact avatar");

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("recieveMessage", messageData);
    }
    if (senderSocketId) {
      io.to(senderSocketId).emit("recieveMessage", messageData);
    }
  };

  const sendChannelMessage = async (message: any) => {
    const { channelId, sender, content, messagetype, fileUrl } = message;
    const createMessage = await Message.create({
      sender,
      recipient: null,
      content,
      messagetype,
      fileUrl,
    });

    const messageData = await Message.findById(createMessage?._id)
      .populate("sender", "id email contact avatar")
      .exec();

    await ChannelModel.findByIdAndUpdate(channelId, {
      $push: { messages: createMessage?._id },
    });

    const channel = await ChannelModel.findById(channelId).populate("members");
    // @ts-ignore
    const finalData = { ...messageData?._doc, channelId: channel?._id };
    if (channel && channel?.members) {
      channel.members.forEach((member) => {
        const memberSocketID = userSocket.get(member?._id.toString());
        if (memberSocketID) {
          io.to(memberSocketID).emit("recieve-channel-message", finalData);
        }
      });
      // const adminSocketID = userSocket.get(channel.admin?._id.toString());
      // if (adminSocketID) {
      //   io.to(adminSocketID).emit("recieve-channel-message", finalData);
      // }
    }
  };

  io.on("connection", (socket: any) => {
    const userID = socket.handshake.query.userId;
    if (userID) {
      userSocket.set(userID, socket.id);
      console.log(`User connected: ${userID} with socket ID: ${socket.id}`);
    } else {
      console.log("User id is not provided during connection");
    }

    // socket.on("sendMessage", sendMessage);
    socket.on("sendMessage", async (message: any) => {
      await sendMessage(message);

      const recipients = [message.recipient]; // Single recipient
      await sendNotification({
        recipients,
        sender: message.sender,
        message,
        io,
        userSocket,
      });
    });

    // socket.on("send-channel-message", sendChannelMessage);
    socket.on("send-channel-message", async (message: any) => {
      const { channelId, sender } = message;

      await sendChannelMessage(message);

      const channel = await ChannelModel.findById(channelId).populate(
        "members"
      );

      // Get all members in the channel excluding the sender
      const recipients = channel?.members?.length
        ? channel.members.map((member) => member._id.toString())
        : [];

      await sendNotification({
        recipients,
        sender,
        message,
        io,
        userSocket,
      });
    });

    // create announcements
    socket.on("createAnnouncement", async (announcementData: any) => {
      try {
        const { title, description, createdBy } = announcementData;

        // Create the announcement
        const newAnnouncement = await AnnouncementModel.create({
          title,
          description,
          createdBy,
        });

        // Fetch all users except the creator
        const users = await userModel.find({ _id: { $ne: createdBy } });

        // Create notifications for all users except the creator
        const notifications = users.map((user) => ({
          userId: user._id,
          message: `New announcement: ${title}`,
          sender: createdBy,
          isRead: false, // Unread initially
        }));

        const notificationData = {
          title,
          description,
        };

        // Insert notifications into the database
        await notificationsModel.insertMany(notifications);
        users.forEach((user) => {
          const recipientSocketId = userSocket.get(user?._id?.toString());
          if (recipientSocketId) {
            io.to(recipientSocketId).emit("newAnnouncement", notificationData);
          }
        });
      } catch (error) {
        console.error("Error creating announcement:", error);
      }
    });

    socket.on("disconnect", (socket: any) => {
      console.log(`Disconnected from socket.io: ${socket.id}`);
      for (const [userId, socketId] of userSocket.entries()) {
        if (socketId === socket.id) {
          userSocket.delete(userId);
          break;
        }
      }
    });
  });
};
