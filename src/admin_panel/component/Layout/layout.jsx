import React, { useEffect, useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

const Layout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => setCollapsed((prev) => !prev);

  useEffect(() => {
    if (collapsed && window.innerWidth < 768) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [collapsed]);

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden relative">
      {/* Sidebar should be under header but full height */}
      <div className="h-full">
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      </div>

      {/* Mobile overlay */}
      {collapsed && (
        <div
          className="fixed inset-0 top-16 bg-black bg-opacity-30 z-40 xl:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Main content area */}
      <div className="flex-1 relative flex flex-col">
        {/* Fixed header on top */}
        <Header toggleSidebar={toggleSidebar} />

        {/* Scrollable content area with top padding for header height */}
        <main
          className={`p-4 mt-4 overflow-y-auto h-full ${
            collapsed
              ? "blur-sm pointer-events-none xl:blur-0 xl:pointer-events-auto"
              : ""
          }`}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
