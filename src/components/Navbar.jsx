import { NavLink, useLocation } from "react-router-dom";
import { FiBell, FiUser, FiSearch } from "react-icons/fi";
import { motion } from "framer-motion";

function Navbar() {
  const location = useLocation();

  const navItems = [
    { name: "Executive Dashboard", path: "/" },
    { name: "Inventory Governance", path: "/inventory" },
    { name: "Allocation Engine", path: "/allocation" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-[#0b1120]/90 backdrop-blur-xl border-b border-white/5 shadow-lg">
      <div className="max-w-7xl mx-auto px-10 py-4 grid grid-cols-3 items-center">

        {/* LEFT SECTION */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-md flex items-center justify-center text-white font-bold shadow-md">
            INVISOR
          </div>
          <div className="leading-tight">
            <p className="text-[11px] text-gray-400 uppercase tracking-wider">
              PwC | Mizuho Bank
            </p>
            <p className="text-sm font-semibold text-white">
              Intelligent Inventory & Resource Governance Platform
            </p>
          </div>
        </div>

        {/* CENTER NAVIGATION (TRUE CENTERED) */}
        <div className="flex justify-center">
          <div className="flex gap-10 relative">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;

              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={`relative px-4 py-2 text-sm font-medium transition-all duration-300
                  ${
                    isActive
                      ? "text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {item.name}

                  {/* Sliding Indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute left-0 right-0 -bottom-1 h-[2px] bg-gradient-to-r from-blue-400 to-indigo-500"
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  )}
                </NavLink>
              );
            })}
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="flex justify-end items-center gap-6">

          {/* Search */}
          <div className="flex items-center bg-white/5 border border-white/10 px-3 py-1.5 rounded-md hover:bg-white/10 transition">
            <FiSearch className="text-gray-400 mr-2" size={16} />
            <input
              type="text"
              placeholder="Search"
              className="bg-transparent outline-none text-sm w-32 text-white placeholder-gray-500"
            />
          </div>

          {/* Notification */}
          <FiBell
            className="text-gray-400 hover:text-blue-400 transition cursor-pointer"
            size={18}
          />

          {/* User */}
          <div className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition cursor-pointer">
            <FiUser size={16} />
            <span className="font-medium">
              New Shi En Alenna
            </span>
          </div>

        </div>

      </div>
    </nav>
  );
}

export default Navbar;