import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="app-container">
      <Sidebar />

      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
}