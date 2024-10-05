import { useLocation } from "react-router-dom";
import useConversation from "./useConversation";
import { useMemo } from "react";
import { HiChat } from "react-icons/hi";

const useRoutes = () => {
  const { pathname } = useLocation();
  const { conversationId } = useConversation();

  const routes = useMemo(
    () => [
      {
        label: "Chat",
        href: "/conversations",
        icon: HiChat,
        active: pathname === "conversations" || !!conversationId,
      },
    ],
    [pathname, conversationId]
  );
  return routes;
};
export default useRoutes;
