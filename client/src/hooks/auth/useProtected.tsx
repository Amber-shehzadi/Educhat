import { useNavigate } from "react-router-dom";
import UserAuth from "./userAuth";
import { ReactNode } from "react";

interface ProtectedProps {
  children: ReactNode;
}
export default function Protected({ children }: ProtectedProps) {
  const navigate = useNavigate();
  const isAuthenticated = UserAuth();
  return isAuthenticated ? children : navigate("/login");
}
