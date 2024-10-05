import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import Loader from "../Loader";

const MessageScreen = ({
  chatData,
  userId,
}: {
  chatData: any;
  userId: string;
}) => {
  if (!chatData) return <Loader />;
  return (
    <SimpleBar className="h-full p-4 overflow-y-auto mt-16">
      {chatData?.length ? (
        chatData?.map((msg: any, idx: number) => (
          <div
            className={`${
              userId === msg?.sender?._id ? "mine" : "yours"
            } messages`}
            key={idx}
          >
            <div
              // className={`message ${msg?.isLastInStreak ? "last" : ""}`}
              className="message"
            >
              {msg?.content}
            </div>
          </div>
        ))
      ) : (
        <></>
      )}
    </SimpleBar>
  );
};

export default MessageScreen;
