import { Link, NavLink, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useState, useEffect, useRef } from "react";

const Navbar = () => {
  const navigate = useNavigate();

  // Authentication state based on presence of userToken
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("userToken")
  );

  const [showExamMenu, setShowExamMenu] = useState(false);
  const [showHscMenu, setShowHscMenu] = useState(false);
  const [showBankMenu, setShowBankMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Dropdown state for user icon dropdown
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // Dropdown refs
  const bcsDropdownRef = useRef(null);
  const hscDropdownRef = useRef(null);
  const bankDropdownRef = useRef(null);
  const userDropdownRef = useRef(null);

  const examTimeoutRef = useRef(null);
  const hscTimeoutRef = useRef(null);
  const bankTimeoutRef = useRef(null);

  // Listen for authentication changes
  useEffect(() => {
    const syncAuth = () => {
      const hasToken = !!localStorage.getItem("userToken");
      setIsAuthenticated(hasToken);
    };

    window.addEventListener("storage", syncAuth);
    window.addEventListener("authChange", syncAuth);

    return () => {
      window.removeEventListener("storage", syncAuth);
      window.removeEventListener("authChange", syncAuth);
    };
  }, []);

  const handleLogOut = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userInfo");
    setIsAuthenticated(false);
    setIsMobileMenuOpen(false);
    setUserDropdownOpen(false);

    window.dispatchEvent(new Event("authChange"));

    Swal.fire({
      title: "Logout Successful",
      icon: "success",
      confirmButtonText: "OK",
      customClass: { confirmButton: "swal-button" },
    }).then(() => {
      navigate("/login");
    });
  };

  const handleDropdownEnter = (menu) => {
    if (menu === "bcs") {
      clearTimeout(examTimeoutRef.current);
      setShowExamMenu(true);
      setShowHscMenu(false);
      setShowBankMenu(false);
    } else if (menu === "hsc") {
      clearTimeout(hscTimeoutRef.current);
      setShowHscMenu(true);
      setShowExamMenu(false);
      setShowBankMenu(false);
    } else if (menu === "bank") {
      clearTimeout(bankTimeoutRef.current);
      setShowBankMenu(true);
      setShowExamMenu(false);
      setShowHscMenu(false);
    }
  };

  const handleDropdownLeave = (menu) => {
    if (menu === "bcs") {
      examTimeoutRef.current = setTimeout(() => setShowExamMenu(false), 200);
    } else if (menu === "hsc") {
      hscTimeoutRef.current = setTimeout(() => setShowHscMenu(false), 200);
    } else if (menu === "bank") {
      bankTimeoutRef.current = setTimeout(() => setShowBankMenu(false), 200);
    }
  };

  useEffect(() => {
    return () => {
      clearTimeout(examTimeoutRef.current);
      clearTimeout(hscTimeoutRef.current);
      clearTimeout(bankTimeoutRef.current);
    };
  }, []);

  // Close dropdowns if clicking outside
  const handleClickOutside = (e) => {
    // For exam dropdowns
    if (
      bcsDropdownRef.current &&
      !bcsDropdownRef.current.contains(e.target) &&
      hscDropdownRef.current &&
      !hscDropdownRef.current.contains(e.target) &&
      bankDropdownRef.current &&
      !bankDropdownRef.current.contains(e.target)
    ) {
      setShowExamMenu(false);
      setShowHscMenu(false);
      setShowBankMenu(false);
    }
    // For user dropdown
    if (
      userDropdownRef.current &&
      !userDropdownRef.current.contains(e.target)
    ) {
      setUserDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Dropdown item component
  const DropdownItem = ({ to, onClick, children, icon }) => (
    <Link
      to={to}
      onClick={() => {
        onClick?.();
        setShowExamMenu(false);
        setShowHscMenu(false);
        setShowBankMenu(false);
        setIsMobileMenuOpen(false);
        setUserDropdownOpen(false);
      }}
      className="group flex items-center gap-3 px-5 py-3.5 text-sm md:text-base font-semibold text-gray-700 dark:text-white hover:bg-blue-50 dark:hover:bg-gray-800 hover:text-blue-700 dark:hover:text-white transition-all duration-300 rounded-xl mx-2 my-1 hover:shadow-sm hover:scale-[1.02]"
    >
      {icon && <span className="text-lg group-hover:scale-110 transition-transform duration-300">{icon}</span>}
      <span>{children}</span>
    </Link>
  );

  // Mobile nav item component
  const MobileNavItem = ({ to, onClick, children, icon }) => (
    <NavLink
      to={to}
      onClick={() => {
        setIsMobileMenuOpen(false);
        onClick?.();
      }}
      className={({ isActive }) =>
        `flex items-center gap-3 w-full px-6 py-4 text-left text-base md:text-lg font-semibold rounded-2xl transition-all duration-300 ${
          isActive
            ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20"
            : "text-gray-700 dark:text-white hover:bg-blue-50 dark:hover:bg-gray-800 hover:text-blue-700 dark:hover:text-white hover:shadow-sm"
        }`
      }
    >
      {icon && <span className="text-xl">{icon}</span>}
      <span>{children}</span>
    </NavLink>
  );

  return (
    <>
      <div className="h-24" />
      <nav className="bg-white/95 dark:bg-black/95 backdrop-blur-2xl shadow-lg shadow-slate-200/50 dark:shadow-black/50 border-b border-slate-200/60 dark:border-gray-800 fixed top-0 left-0 right-0 z-50">
        {/* Gradient overlay for extra depth */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/20 via-transparent to-slate-50/20 dark:from-transparent dark:via-transparent dark:to-transparent pointer-events-none" />
        
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex items-center justify-between h-24">
            {/* Logo */}
            <div className="flex-shrink-0 w-1/4">
              <Link
                to="/"
                className="group flex items-center gap-3 transition-all duration-300 hover:scale-105"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="relative w-12 h-12 lg:w-14 lg:h-14">
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-blue-500 dark:to-indigo-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-80 transition-opacity duration-300" />
                  {/* Icon */}
                  <div className="relative w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-blue-500 dark:to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg transform group-hover:rotate-6 transition-all duration-300">
                    <span className="text-white text-2xl lg:text-3xl font-black tracking-tight">E</span>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl sm:text-3xl lg:text-4xl font-black bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent tracking-tight leading-none">
                    ExamDesk
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation - Center */}
            <div className="hidden lg:flex items-center justify-center absolute left-1/2 transform -translate-x-1/2">
              <div className="flex items-center gap-2">
                {/* Live Exams */}
                <NavLink
                  to="/LiveExams"
                  className={({ isActive }) =>
                    `relative group rounded-2xl text-sm xl:text-base font-bold px-5 py-3 transition-all duration-300 whitespace-nowrap overflow-hidden ${
                      isActive
                        ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md shadow-blue-500/30"
                        : "text-blue-600 dark:text-white hover:text-white dark:hover:text-blue-400 hover:shadow-md hover:shadow-blue-500/20"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {!isActive && (
                        <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-2xl" />
                      )}
                      <div className="flex items-center gap-2 relative z-10">
                        <span className="flex h-2.5 w-2.5 relative">
                          <span className="animate-ping absolute inline-flex h-2.5 w-2.5 rounded-full bg-red-400 opacity-75" />
                          <span className="relative rounded-full h-2.5 w-2.5 bg-red-500" />
                        </span>
                        <span className="font-extrabold tracking-tight">Live Exams</span>
                      </div>
                    </>
                  )}
                </NavLink>

                {/* BCS Exam Dropdown */}
                <div
                  className="relative group"
                  ref={bcsDropdownRef}
                  onMouseEnter={() => handleDropdownEnter("bcs")}
                  onMouseLeave={() => handleDropdownLeave("bcs")}
                >
                  <NavLink
                    to="/bcs/all-questions"
                    className={({ isActive }) =>
                      `relative rounded-2xl text-sm xl:text-base font-bold px-5 py-3 transition-all duration-300 whitespace-nowrap flex items-center gap-2 overflow-hidden ${
                        isActive
                          ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-500/30"
                          : "text-blue-600 dark:text-white hover:text-white hover:shadow-md hover:shadow-blue-500/20"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {!isActive && (
                          <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-2xl" />
                        )}
                        <span className="relative z-10 font-extrabold tracking-tight">BCS Exam</span>
                        <svg
                          className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180 relative z-10"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </>
                    )}
                  </NavLink>

                  <div
                    className={`absolute right-0 mt-3 w-64 rounded-2xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-2xl shadow-xl border border-slate-200 dark:border-gray-700 transform transition-all duration-300 origin-top ${
                      showExamMenu
                        ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
                        : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                    }`}
                  >
                    <div className="py-2">
                      <DropdownItem to="bcs/all-questions" icon="📚">
                        All Questions Exam
                      </DropdownItem>
                      <DropdownItem to="bcs/subjectwise" icon="📖">
                        Subject Wise Exam
                      </DropdownItem>
                    </div>
                  </div>
                </div>

                {/* HSC Exam Dropdown */}
                <div
                  className="relative group"
                  ref={hscDropdownRef}
                  onMouseEnter={() => handleDropdownEnter("hsc")}
                  onMouseLeave={() => handleDropdownLeave("hsc")}
                >
                  <NavLink
                    to="/hsc/all-questions"
                    className={({ isActive }) =>
                      `relative rounded-2xl text-sm xl:text-base font-bold px-5 py-3 transition-all duration-300 whitespace-nowrap flex items-center gap-2 overflow-hidden ${
                        isActive
                          ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-500/30"
                          : "text-blue-600 dark:text-white hover:text-white hover:shadow-md hover:shadow-blue-500/20"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {!isActive && (
                          <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-2xl" />
                        )}
                        <span className="relative z-10 font-extrabold tracking-tight">HSC Exam</span>
                        <svg
                          className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180 relative z-10"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </>
                    )}
                  </NavLink>

                  <div
                    className={`absolute right-0 mt-3 w-64 rounded-2xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-2xl shadow-xl border border-slate-200 dark:border-gray-700 transform transition-all duration-300 origin-top ${
                      showHscMenu
                        ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
                        : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                    }`}
                  >
                    <div className="py-2">
                      <DropdownItem to="hsc/all-questions" icon="📚">
                        All Questions Exam
                      </DropdownItem>
                      <DropdownItem to="hsc/subjectwise" icon="📖">
                        Subject Wise Exam
                      </DropdownItem>
                    </div>
                  </div>
                </div>

                {/* Bank Exam Dropdown */}
                <div
                  className="relative group"
                  ref={bankDropdownRef}
                  onMouseEnter={() => handleDropdownEnter("bank")}
                  onMouseLeave={() => handleDropdownLeave("bank")}
                >
                  <NavLink
                    to="/bank/all-questions"
                    className={({ isActive }) =>
                      `relative rounded-2xl text-sm xl:text-base font-bold px-5 py-3 transition-all duration-300 whitespace-nowrap flex items-center gap-2 overflow-hidden ${
                        isActive
                          ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-500/30"
                          : "text-blue-600 dark:text-white hover:text-white hover:shadow-md hover:shadow-blue-500/20"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {!isActive && (
                          <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-2xl" />
                        )}
                        <span className="relative z-10 font-extrabold tracking-tight">Bank Exam</span>
                        <svg
                          className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180 relative z-10"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </>
                    )}
                  </NavLink>

                  <div
                    className={`absolute right-0 mt-3 w-64 rounded-2xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-2xl shadow-xl border border-slate-200 dark:border-gray-700 transform transition-all duration-300 origin-top ${
                      showBankMenu
                        ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
                        : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                    }`}
                  >
                    <div className="py-2">
                      <DropdownItem to="bank/all-questions" icon="📚">
                        All Questions Exam
                      </DropdownItem>
                      <DropdownItem to="bank/subjectwise" icon="📖">
                        Subject Wise Exam
                      </DropdownItem>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="flex lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="relative inline-flex items-center justify-center p-3 rounded-2xl text-blue-600 dark:text-white hover:text-blue-700 dark:hover:text-blue-400 bg-blue-50 dark:bg-gray-800 hover:bg-blue-100 dark:hover:bg-gray-700 focus:outline-none transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg"
              >
                <span className="sr-only">Open main menu</span>
                <div className="w-6 h-6 flex flex-col justify-center gap-1.5">
                  <span
                    className={`block w-full h-0.5 bg-current rounded-full transform transition-all duration-300 ${
                      isMobileMenuOpen ? "rotate-45 translate-y-2" : ""
                    }`}
                  />
                  <span
                    className={`block w-full h-0.5 bg-current rounded-full transition-all duration-300 ${
                      isMobileMenuOpen ? "opacity-0 scale-0" : ""
                    }`}
                  />
                  <span
                    className={`block w-full h-0.5 bg-current rounded-full transform transition-all duration-300 ${
                      isMobileMenuOpen ? "-rotate-45 -translate-y-2" : ""
                    }`}
                  />
                </div>
              </button>
            </div>

            {/* Auth Action Button - Desktop */}
            <div className="hidden lg:flex items-center justify-end w-1/4 gap-4">
              {isAuthenticated ? (
                <>
                  {/* User Icon Dropdown */}
                  <div className="relative" ref={userDropdownRef}>
                    <button
                      onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                      className="group relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-gray-800 dark:to-gray-700 hover:from-blue-200 hover:to-indigo-200 dark:hover:from-gray-700 dark:hover:to-gray-600 p-3 text-blue-600 dark:text-white hover:text-blue-700 dark:hover:text-blue-400 transition-all duration-300 hover:scale-110 shadow-md hover:shadow-lg hover:shadow-blue-300/40 dark:hover:shadow-blue-500/20"
                      aria-haspopup="true"
                      aria-expanded={userDropdownOpen}
                    >
                      {/* Glow effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-400 dark:from-blue-500 dark:to-indigo-500 rounded-2xl blur-md opacity-0 group-hover:opacity-30 dark:group-hover:opacity-20 transition-opacity duration-300" />
                      <svg
                        className="w-7 h-7 relative z-10"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2.5"
                          d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </button>
                    {userDropdownOpen && (
                      <div
                        className="absolute right-0 mt-3 w-56 rounded-2xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-2xl shadow-xl border border-slate-200 dark:border-gray-700 origin-top z-50 animate-in fade-in slide-in-from-top-2 duration-300"
                        role="menu"
                        aria-orientation="vertical"
                      >
                        <div className="py-2">
                          <Link
                            to="/student/dashboard"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-3 px-5 py-3.5 text-base font-semibold text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-all duration-300 mx-2 rounded-xl hover:shadow-sm hover:scale-[1.02]"
                            role="menuitem"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                              />
                            </svg>
                            Dashboard
                          </Link>
                          <Link
                            to="/profile"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-3 px-5 py-3.5 text-base font-semibold text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-all duration-300 mx-2 rounded-xl hover:shadow-sm hover:scale-[1.02]"
                            role="menuitem"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              />
                            </svg>
                            Profile
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={handleLogOut}
                    className="group relative px-6 py-3 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-2xl font-bold hover:from-rose-600 hover:to-rose-700 shadow-md hover:shadow-lg hover:shadow-rose-500/30 hover:scale-105 transition-all duration-300 overflow-hidden"
                  >
                    <span className="relative z-10 font-extrabold tracking-tight">Log Out</span>
                    <span className="absolute inset-0 bg-gradient-to-r from-rose-600 to-rose-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                  </button>
                </>
              ) : (
                <Link to="/login">
                  <button className="group relative px-7 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg hover:shadow-blue-500/30 hover:scale-105 transition-all duration-300 overflow-hidden">
                    <span className="relative z-10 font-extrabold tracking-tight">Login</span>
                    <span className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Menu */}
      <div
        className={`lg:hidden fixed inset-0 z-40 transition-all duration-500 ${
          isMobileMenuOpen
            ? "visible opacity-100"
            : "invisible opacity-0"
        }`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-white/40 dark:bg-black/60 backdrop-blur-xl transition-all duration-500 ${
            isMobileMenuOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Menu Content */}
        <div
          className={`absolute top-0 right-0 bottom-0 w-full sm:w-96 bg-white dark:bg-gradient-to-br dark:from-black dark:via-gray-900 dark:to-black backdrop-blur-2xl shadow-2xl transform transition-all duration-500 ${
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-gray-800 bg-white/50 dark:bg-black/50">
            <h2 className="text-2xl font-black bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">
              Menu
            </h2>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 rounded-xl bg-blue-100 dark:bg-gray-800 text-blue-600 dark:text-white hover:bg-blue-200 dark:hover:bg-gray-700 transition-all duration-300 hover:scale-110 hover:rotate-90"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Menu Items */}
          <div className="px-4 pt-4 pb-6 space-y-2 max-h-[calc(100vh-8rem)] overflow-y-auto">
            {/* Live Exams */}
            <MobileNavItem to="/LiveExams" icon="🔴">
              <div className="flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-2.5 w-2.5 rounded-full bg-red-400 opacity-75" />
                  <span className="relative rounded-full h-2.5 w-2.5 bg-red-500" />
                </span>
                Live Exams
              </div>
            </MobileNavItem>

            {/* Mobile BCS Menu */}
            <div className="space-y-1">
              <button
                onClick={() => setShowExamMenu(!showExamMenu)}
                className="w-full text-left px-6 py-4 text-base font-semibold text-slate-800 dark:text-white hover:bg-blue-50 dark:hover:bg-gray-800 hover:text-blue-700 dark:hover:text-white flex items-center justify-between rounded-2xl transition-all duration-300 hover:shadow-sm"
              >
                <span className="flex items-center gap-3">
                  <span className="text-xl">📚</span>
                  <span>BCS Exam</span>
                </span>
                <svg
                  className={`w-5 h-5 transition-transform duration-300 ${
                    showExamMenu ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              <div
                className={`pl-6 space-y-1 overflow-hidden transition-all duration-300 ${
                  showExamMenu ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <MobileNavItem to="/bcs/all-questions" icon="📄">
                  All Questions Exam
                </MobileNavItem>
                <MobileNavItem to="/bcs/subjectwise" icon="📖">
                  Subject Wise Exam
                </MobileNavItem>
              </div>
            </div>

            {/* Mobile HSC Menu */}
            <div className="space-y-1">
              <button
                onClick={() => setShowHscMenu(!showHscMenu)}
                className="w-full text-left px-6 py-4 text-base font-semibold text-slate-800 dark:text-white hover:bg-blue-50 dark:hover:bg-gray-800 hover:text-blue-700 dark:hover:text-white flex items-center justify-between rounded-2xl transition-all duration-300 hover:shadow-sm"
              >
                <span className="flex items-center gap-3">
                  <span className="text-xl">🎓</span>
                  <span>HSC Exam</span>
                </span>
                <svg
                  className={`w-5 h-5 transition-transform duration-300 ${
                    showHscMenu ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              <div
                className={`pl-6 space-y-1 overflow-hidden transition-all duration-300 ${
                  showHscMenu ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <MobileNavItem to="/hsc/all-questions" icon="📄">
                  All Questions Exam
                </MobileNavItem>
                <MobileNavItem to="/hsc/subjectwise" icon="📖">
                  Subject Wise Exam
                </MobileNavItem>
              </div>
            </div>

            {/* Mobile Bank Menu */}
            <div className="space-y-1">
              <button
                onClick={() => setShowBankMenu(!showBankMenu)}
                className="w-full text-left px-6 py-4 text-base font-semibold text-slate-800 dark:text-white hover:bg-blue-50 dark:hover:bg-gray-800 hover:text-blue-700 dark:hover:text-white flex items-center justify-between rounded-2xl transition-all duration-300 hover:shadow-sm"
              >
                <span className="flex items-center gap-3">
                  <span className="text-xl">🏦</span>
                  <span>Bank Exam</span>
                </span>
                <svg
                  className={`w-5 h-5 transition-transform duration-300 ${
                    showBankMenu ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              <div
                className={`pl-6 space-y-1 overflow-hidden transition-all duration-300 ${
                  showBankMenu ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <MobileNavItem to="/bank/all-questions" icon="📄">
                  All Questions Exam
                </MobileNavItem>
                <MobileNavItem to="/bank/subjectwise" icon="📖">
                  Subject Wise Exam
                </MobileNavItem>
              </div>
            </div>

            {isAuthenticated && (
              <>
                <div className="h-px bg-gradient-to-r from-transparent via-slate-300 dark:via-gray-700 to-transparent my-4" />
                <MobileNavItem to="/student/dashboard" icon="🏠">
                  Dashboard
                </MobileNavItem>
                <MobileNavItem to="/profile" icon="👤">
                  Profile
                </MobileNavItem>
              </>
            )}

            {/* Mobile Auth Button */}
            <div className="pt-4">
              {isAuthenticated ? (
                <button
                  onClick={handleLogOut}
                  className="w-full px-6 py-4 text-base font-bold text-white bg-gradient-to-r from-rose-500 to-rose-600 rounded-2xl hover:from-rose-600 hover:to-rose-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02]"
                >
                  Log Out
                </button>
              ) : (
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <button className="w-full px-6 py-4 text-base font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02]">
                    Login
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
