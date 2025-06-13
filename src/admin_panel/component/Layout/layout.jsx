import React, { useEffect, useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

const Layout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false); // Sidebar visible by default

  const toggleSidebar = () => setCollapsed((prev) => !prev);

  // Lock scroll on mobile when sidebar is open
  useEffect(() => {
    if (collapsed && window.innerWidth < 768) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "";
    };
  }, [collapsed]);

  return (
<div className="flex h-screen bg-gray-100 relative">
  {/* Sidebar is fixed or static based on screen size */}
  <Sidebar collapsed={collapsed} />

  {/* Overlay for mobile */}
  {collapsed && (
    <div
      className="fixed inset-0 top-16 bg-black bg-opacity-30 z-40 md:hidden"
      onClick={toggleSidebar}
    />
  )}

  {/* Main content area */}
  <div className="flex-1 flex flex-col min-h-screen overflow-y-auto">
    <Header toggleSidebar={toggleSidebar} />

    <main
      className={`pt-20 px-4 pb-8 transition-all duration-300 ${
        collapsed
          ? "blur-sm pointer-events-none md:blur-0 md:pointer-events-auto"
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
