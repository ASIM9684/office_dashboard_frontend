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
    <div className="flex h-screen bg-gray-100 relative">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {collapsed && (
        <div
          className="fixed inset-0 top-16 bg-black bg-opacity-30 z-40 xl:hidden"
          onClick={toggleSidebar}
        />
      )}

      <div className="flex-1 flex flex-col min-h-screen overflow-y-auto">
        <Header toggleSidebar={toggleSidebar} />

        <main
          className={`pt-20 px-4 pb-8 transition-all duration-300 ${
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
