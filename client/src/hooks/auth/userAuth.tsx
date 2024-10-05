import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function UserAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useSelector((state: any) => state.auth);

  useEffect(() => {
    if (user && user._id) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
    setIsLoading(false);
  }, [user]);

  return { isAuthenticated, isLoading, user };
}
