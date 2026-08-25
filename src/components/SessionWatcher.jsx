import { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";

export default function SessionWatcher() {

  const { logout } = useAuth();

  useEffect(() => {

    const interval = setInterval(() => {

      const last = localStorage.getItem("lastActive");

      if (last) {
        const now = Date.now();

        if (now - last > 15 * 60 * 1000) {
          logout();
          window.location.href = "/login";
        }
      }

    }, 60000);

    return () => clearInterval(interval);

  }, [logout]);

  return null;
}