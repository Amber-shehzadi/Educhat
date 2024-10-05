import { ReactNode } from "react";
import SideBar from "./Sidebar";

export default function ChatLayout({ children }: { children: ReactNode }) {
  return (
    <SideBar>
      <div className="h-full">{children}</div>;
    </SideBar>
  );
}
