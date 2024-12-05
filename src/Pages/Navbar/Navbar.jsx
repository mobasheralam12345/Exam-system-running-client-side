import { Link, NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useState, useEffect, useRef } from "react";

const Navbar = () => {
    const navigate = useNavigate();
    const [showExamMenu, setShowExamMenu] = useState(false);
    const [showHscMenu, setShowHscMenu] = useState(false);
    const [activeMenu, setActiveMenu] = useState(""); // Track the active menu
    const dropdownRef = useRef(null);

    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

    const handleLogOut = () => {
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("token");

        Swal.fire({
            title: "Logout Successfully",
            icon: "success",
            confirmButtonText: "OK",
            customClass: {
                confirmButton: "swal-button",
            },
        }).then(() => {
            navigate("/login");
        });
    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setShowExamMenu(false);
            setShowHscMenu(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="navbar flex justify-between ml-2 items-center px-10 py-5 shadow-md text-xl font-semibold">
            <div className="navbar-start">
                <a className="text-2xl font-bold ml-2">
                    Online Examination System Management
                </a>
            </div>
            <div
                className="navbar-center flex-grow flex justify-center"
                ref={dropdownRef}
            >
                <ul className="flex space-x-2 relative">
                    <NavLink
                        to="/"
                        className={`rounded-lg text-lg font-bold transition-colors duration-300 px-4 py-2 ${
                            activeMenu === "home" ? "bg-orange-700 text-white" : "hover:bg-orange-700 hover:text-white"
                        }`}
                        onClick={() => setActiveMenu("home")}
                    >
                        Home
                    </NavLink>
                    
                    <NavLink
                        to="/about"
                        className={`rounded-lg text-lg font-bold transition-colors duration-300 px-4 py-2 ${
                            activeMenu === "about" ? "bg-orange-700 text-white" : "hover:bg-orange-700 hover:text-white"
                        }`}
                        onClick={() => setActiveMenu("about")}
                    >
                        About
                    </NavLink>
                    {/* BCS Exam Dropdown */}
                    <div className="relative mr-4">
                        <button
                            onClick={() => {
                                setShowExamMenu(!showExamMenu);
                                setActiveMenu("bcsExam");
                            }}
                            className={`rounded-lg text-lg font-bold transition-colors duration-300 px-4 py-2 flex items-center ${
                                activeMenu === "bcsExam" ? "bg-orange-700 text-white" : "hover:bg-orange-800 hover:text-white"
                            }`}
                        >
                            BCS Exam
                            <span className="ml-2">▼</span>
                        </button>
                        {showExamMenu && (
                            <ul className="absolute bg-white shadow-lg rounded-md mt-2 py-2 w-48 z-10">
                                <li>
                                    <NavLink
                                        to="/exam"
                                        className="block mb-2 hover:bg-orange-700 hover:text-white rounded-lg text-lg font-bold transition-colors duration-300 px-4 py-2"
                                        onClick={() => setShowExamMenu(false)}
                                    >
                                        All Questions Exam
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        to="/subjectwise-exam"
                                        className="block hover:bg-orange-700 hover:text-white rounded-lg text-lg font-bold transition-colors duration-300 px-4 py-2"
                                        onClick={() => setShowExamMenu(false)}
                                    >
                                        Subject Wise Exam
                                    </NavLink>
                                </li>
                            </ul>
                        )}
                    </div>
                    {/* HSC Exam Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => {
                                setShowHscMenu(!showHscMenu);
                                setActiveMenu("hscExam");
                            }}
                            className={`rounded-lg text-lg font-bold transition-colors duration-300 px-4 py-2 flex items-center ${
                                activeMenu === "hscExam" ? "bg-orange-700 text-white" : "hover:bg-orange-700 hover:text-white"
                            }`}
                        >
                            HSC Exam
                            <span className="ml-2">▼</span>
                        </button>
                        {showHscMenu && (
                            <ul className="absolute bg-white shadow-lg rounded-md mt-2 py-2 w-48 z-10">
                                <li>
                                    <NavLink
                                        to="/hsc/all-questions"
                                        className="block mb-2 hover:bg-orange-700 hover:text-white rounded-lg text-lg font-bold transition-colors duration-300 px-4 py-2"
                                        onClick={() => setShowHscMenu(false)}
                                    >
                                        All Questions Exam
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        to="/hsc/subjectwise"
                                        className="block hover:bg-orange-700 hover:text-white rounded-lg text-lg font-bold transition-colors duration-300 px-4 py-2"
                                        onClick={() => setShowHscMenu(false)}
                                    >
                                        Subject Wise Exam
                                    </NavLink>
                                </li>
                            </ul>
                        )}
                    </div>
                    {isAuthenticated && (
                        <NavLink
                            to="/dashboard"
                            className={`rounded-lg text-lg font-bold transition-colors duration-300 px-4 py-2 ${
                                activeMenu === "dashboard" ? "bg-orange-800 text-white" : "hover:bg-orange-800 hover:text-white"
                            }`}
                            onClick={() => setActiveMenu("dashboard")}
                        >
                            Dashboard
                        </NavLink>
                    )}
                </ul>
            </div>
            <div>
                {isAuthenticated ? (
                    <button
                        onClick={handleLogOut}
                        className="btn bg-blue-500 text-white rounded-md ml-2"
                    >
                        Log Out
                    </button>
                ) : (
                    <Link to="/login">
                        <button className="btn bg-blue-500 text-white text-md rounded-md">
                            Login
                        </button>
                    </Link>
                )}
            </div>
        </div>
    );
};

export default Navbar;
