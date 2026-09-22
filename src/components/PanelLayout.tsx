import { Outlet } from "react-router-dom";
import Aside from "./Aside";
import { Header } from "./Header";

export default function AdminLayout() {
  return (
    <div className="flex h-screen max-w-screen-2xl mx-auto bg-background text-foreground">
      {/* Sidebar */}
      <Aside />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
