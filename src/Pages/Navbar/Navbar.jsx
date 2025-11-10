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

  const dropdownRef = useRef(null);
  const examTimeoutRef = useRef(null);
  const hscTimeoutRef = useRef(null);
  const bankTimeoutRef = useRef(null);

  // Listen for authentication changes
  useEffect(() => {
    const syncAuth = () => {
      const hasToken = !!localStorage.getItem("userToken");
      console.log("Auth sync triggered, token exists:", hasToken);
      setIsAuthenticated(hasToken);
    };

    // Listen to storage events
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

    // Dispatch event to notify other components
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

  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setShowExamMenu(false);
      setShowHscMenu(false);
      setShowBankMenu(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const DropdownItem = ({ to, onClick, children }) => (
    <Link
      to={to}
      onClick={() => {
        onClick?.();
        setShowExamMenu(false);
        setShowHscMenu(false);
        setShowBankMenu(false);
        setIsMobileMenuOpen(false);
      }}
      className="block px-5 py-3 text-sm md:text-base font-semibold text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 transform hover:translate-x-2"
    >
      {children}
    </Link>
  );

  const MobileNavItem = ({ to, onClick, children }) => (
    <NavLink
      to={to}
      onClick={() => {
        setIsMobileMenuOpen(false);
        onClick?.();
      }}
      className={({ isActive }) =>
        `block w-full px-5 py-3 text-left text-base md:text-lg font-semibold ${
          isActive
            ? "bg-blue-600 text-white"
            : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
        }`
      }
    >
      {children}
    </NavLink>
  );

  return (
    <>
      <div className="h-20" />
      <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
        <div className="max-w-8xl mx-auto px-4">
          <div className="flex items-center justify-between h-24">
            {/* Logo */}
            <div className="flex-shrink-0 w-1/4">
              <Link
                to="/"
                className="text-2xl sm:text-2xl md:text-2xl lg:text-3xl xl:text-4xl font-extrabold transition-all duration-300 hover:scale-[1.02]"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  ExamDesk BD
                </span>
              </Link>
            </div>

            {/* Desktop Navigation - Center */}
            <div className="hidden lg:flex items-center justify-center absolute left-1/2 transform -translate-x-1/2">
              <div className="flex items-center space-x-3">
                {/* Live Exams */}
                <NavLink
                  to="/LiveExams"
                  className={({ isActive }) =>
                    `rounded-lg text-xs lg:text-sm xl:text-base font-bold px-3 py-2 border-2 transition-all duration-300 whitespace-nowrap ${
                      isActive
                        ? "bg-emerald-600 text-white shadow-lg border-emerald-600"
                        : "border-emerald-500 text-emerald-600 hover:bg-emerald-500 hover:text-white hover:shadow-md"
                    }`
                  }
                >
                  <div className="flex items-center gap-1.5">
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    Live Exams
                  </div>
                </NavLink>

                {/* BCS Exam Dropdown */}
                <div
                  className="relative group"
                  ref={dropdownRef}
                  onMouseEnter={() => handleDropdownEnter("bcs")}
                  onMouseLeave={() => handleDropdownLeave("bcs")}
                >
                  <NavLink
                    to="/exam"
                    className={({ isActive }) =>
                      `rounded-lg text-xs lg:text-sm xl:text-base font-bold px-3 py-2 border-2 transition-all duration-300 whitespace-nowrap flex items-center gap-1 ${
                        isActive
                          ? "bg-emerald-600 text-white shadow-lg border-emerald-600"
                          : "border-emerald-500 text-emerald-600 hover:bg-emerald-500 hover:text-white hover:shadow-md"
                      }`
                    }
                  >
                    BCS Exam
                    <svg
                      className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </NavLink>

                  <div
                    className={`absolute right-0 mt-2 w-52 rounded-xl bg-white shadow-xl transform transition-all duration-300 origin-top ${
                      showExamMenu
                        ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
                        : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                    }`}
                  >
                    <div className="py-2">
                      <DropdownItem to="bcs/all-questions">
                        All Questions Exam
                      </DropdownItem>
                      <DropdownItem to="bcs/subjectwise">
                        Subject Wise Exam
                      </DropdownItem>
                    </div>
                  </div>
                </div>

                {/* HSC Exam Dropdown */}
                <div
                  className="relative group"
                  onMouseEnter={() => handleDropdownEnter("hsc")}
                  onMouseLeave={() => handleDropdownLeave("hsc")}
                >
                  <NavLink
                    to="/hsc/all-questions"
                    className={({ isActive }) =>
                      `rounded-lg text-xs lg:text-sm xl:text-base font-bold px-3 py-2 border-2 transition-all duration-300 whitespace-nowrap flex items-center gap-1 ${
                        isActive
                          ? "bg-emerald-600 text-white shadow-lg border-emerald-600"
                          : "border-emerald-500 text-emerald-600 hover:bg-emerald-500 hover:text-white hover:shadow-md"
                      }`
                    }
                  >
                    HSC Exam
                    <svg
                      className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </NavLink>

                  <div
                    className={`absolute right-0 mt-2 w-52 rounded-xl bg-white shadow-xl transform transition-all duration-300 origin-top ${
                      showHscMenu
                        ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
                        : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                    }`}
                  >
                    <div className="py-2">
                      <DropdownItem to="/hsc/all-questions">
                        All Questions Exam
                      </DropdownItem>
                      <DropdownItem to="/hsc/subjectwise">
                        Subject Wise Exam
                      </DropdownItem>
                    </div>
                  </div>
                </div>

                {/* Bank Exam Dropdown */}
                <div
                  className="relative group"
                  onMouseEnter={() => handleDropdownEnter("bank")}
                  onMouseLeave={() => handleDropdownLeave("bank")}
                >
                  <NavLink
                    to="/bank/all-questions"
                    className={({ isActive }) =>
                      `rounded-lg text-xs lg:text-sm xl:text-base font-bold px-3 py-2 border-2 transition-all duration-300 whitespace-nowrap flex items-center gap-1 ${
                        isActive
                          ? "bg-emerald-600 text-white shadow-lg border-emerald-600"
                          : "border-emerald-500 text-emerald-600 hover:bg-emerald-500 hover:text-white hover:shadow-md"
                      }`
                    }
                  >
                    Bank Exam
                    <svg
                      className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </NavLink>

                  <div
                    className={`absolute right-0 mt-2 w-52 rounded-xl bg-white shadow-xl transform transition-all duration-300 origin-top ${
                      showBankMenu
                        ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
                        : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                    }`}
                  >
                    <div className="py-2">
                      <DropdownItem to="/bank/all-questions">
                        All Questions Exam
                      </DropdownItem>
                      <DropdownItem to="/bank/subjectwise">
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
                className="inline-flex items-center justify-center p-2 rounded-md text-black hover:text-black hover:bg-gray-100 focus:outline-none transition-all duration-300 hover:scale-105"
              >
                <span className="sr-only">Open main menu</span>
                <div className="w-6 sm:w-7 h-6 sm:h-7 flex flex-col justify-between">
                  <span
                    className={`block w-full h-0.5 bg-current transform transition-all duration-300 ${
                      isMobileMenuOpen ? "rotate-45 translate-y-3" : ""
                    }`}
                  />
                  <span
                    className={`block w-full h-0.5 bg-current transition-all duration-300 ${
                      isMobileMenuOpen ? "opacity-0" : ""
                    }`}
                  />
                  <span
                    className={`block w-full h-0.5 bg-current transform transition-all duration-300 ${
                      isMobileMenuOpen ? "-rotate-45 -translate-y-3" : ""
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
                  <div className="relative group">
                    <button className="flex items-center justify-center rounded-full bg-gray-100 hover:bg-blue-50 p-2 text-gray-600 hover:text-blue-600 transition-all duration-300 hover:scale-105 hover:shadow-md">
                      <svg
                        className="w-8 h-8"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </button>
                    <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white shadow-xl opacity-0 scale-95 transform -translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0 group-hover:pointer-events-auto hover:pointer-events-auto transition-all duration-300 origin-top">
                      <div className="py-2">
                        <Link
                          to="/dashboard"
                          className="flex items-center gap-2 px-5 py-3 text-base font-semibold text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
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
                          className="flex items-center gap-2 px-5 py-3 text-base font-semibold text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
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
                  </div>
                  <button
                    onClick={handleLogOut}
                    className="px-5 py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 shadow-lg hover:shadow-xl hover:scale-105 transition"
                  >
                    Log Out
                  </button>
                </>
              ) : (
                <Link to="/login">
                  <button className="px-5 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 shadow-lg hover:shadow-xl hover:scale-105 transition">
                    Login
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Menu */}
      <div
        className={`lg:hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen
            ? "max-h-screen opacity-100 visible"
            : "max-h-0 opacity-0 invisible"
        }`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 bg-white shadow-lg">
          {/* Live Exams */}
          <MobileNavItem to="/LiveExams">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              Live Exams
            </div>
          </MobileNavItem>

          {/* Mobile BCS Menu */}
          <div className="space-y-1">
            <button
              onClick={() => setShowExamMenu(!showExamMenu)}
              className="w-full text-left px-5 py-4 text-lg font-semibold text-gray-700 hover:bg-blue-50 hover:text-blue-600 flex items-center justify-between"
            >
              <span>BCS Exam</span>
              <svg
                className={`w-5 h-5 transition-transform duration-200 ${
                  showExamMenu ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            <div
              className={`pl-4 space-y-1 ${showExamMenu ? "block" : "hidden"}`}
            >
              <MobileNavItem to="/exam">All Questions Exam</MobileNavItem>
              <MobileNavItem to="/subjectwise-exam">
                Subject Wise Exam
              </MobileNavItem>
              <MobileNavItem
                to="/BCSOthersExam"
                onClick={() => localStorage.removeItem("selectedOptions")}
              >
                Others
              </MobileNavItem>
            </div>
          </div>

          {/* Mobile HSC Menu */}
          <div className="space-y-1">
            <button
              onClick={() => setShowHscMenu(!showHscMenu)}
              className="w-full text-left px-5 py-4 text-lg font-semibold text-gray-700 hover:bg-blue-50 hover:text-blue-600 flex items-center justify-between"
            >
              <span>HSC Exam</span>
              <svg
                className={`w-5 h-5 transition-transform duration-200 ${
                  showHscMenu ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            <div
              className={`pl-4 space-y-1 ${showHscMenu ? "block" : "hidden"}`}
            >
              <MobileNavItem to="/hsc/all-questions">
                All Questions Exam
              </MobileNavItem>
              <MobileNavItem to="/hsc/subjectwise">
                Subject Wise Exam
              </MobileNavItem>
              <MobileNavItem
                to="/HSCOthersExam"
                onClick={() => localStorage.removeItem("selectedOptions")}
              >
                Others
              </MobileNavItem>
            </div>
          </div>

          {/* Mobile Bank Menu */}
          <div className="space-y-1">
            <button
              onClick={() => setShowBankMenu(!showBankMenu)}
              className="w-full text-left px-5 py-4 text-lg font-semibold text-gray-700 hover:bg-blue-50 hover:text-blue-600 flex items-center justify-between"
            >
              <span>Bank Exam</span>
              <svg
                className={`w-5 h-5 transition-transform duration-200 ${
                  showBankMenu ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            <div
              className={`pl-4 space-y-1 ${showBankMenu ? "block" : "hidden"}`}
            >
              <MobileNavItem to="/bank/all-questions">
                All Questions Exam
              </MobileNavItem>
              <MobileNavItem to="/bank/subjectwise">
                Subject Wise Exam
              </MobileNavItem>
              <MobileNavItem
                to="/BankOthersExam"
                onClick={() => localStorage.removeItem("selectedOptions")}
              >
                Others
              </MobileNavItem>
            </div>
          </div>

          {isAuthenticated && (
            <>
              <MobileNavItem to="/dashboard">Dashboard</MobileNavItem>
              <MobileNavItem to="/profile">Profile</MobileNavItem>
            </>
          )}

          {/* Mobile Auth Button */}
          {isAuthenticated ? (
            <button
              onClick={handleLogOut}
              className="w-full px-5 py-4 text-base font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
            >
              Log Out
            </button>
          ) : (
            <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
              <button className="w-full px-5 py-4 text-base font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                Login
              </button>
            </Link>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
