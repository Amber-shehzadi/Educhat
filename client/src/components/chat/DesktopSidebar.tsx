import React, { useState } from "react";
import useRoutes from "../../hooks/chat/useRoutes";

const DesktopSidebar = () => {
  const routes = useRoutes();
  const [isOpen, setIsOpen] = useState(false);
  return <div>DesktopSidebar</div>;
};

export default DesktopSidebar;
