import { Link, NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useState } from "react";

const Navbar = () => {
    const navigate = useNavigate();
    const [showExamMenu, setShowExamMenu] = useState(false);

    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

    const handleLogOut = () => {
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('token');

        Swal.fire({
            title: 'Logout Successfully',
            icon: 'success',
            confirmButtonText: 'OK',
            customClass: {
                confirmButton: 'swal-button'
            }
        }).then(() => {
            navigate('/login');
        });
    };

    return (
        <div className="navbar flex justify-between ml-2 items-center px-10 py-5 shadow-md text-xl font-semibold">
            <div className="navbar-start">
                <a className="text-2xl font-bold ml-2">Online Examination System Management</a>
            </div>
            <div className="navbar-center flex-grow flex justify-center">
                <ul className="flex space-x-2">
                    <NavLink
                        to="/"
                        className="hover:bg-orange-800 hover:text-white rounded-lg text-lg font-bold transition-colors duration-300 px-4 py-2"
                    >
                        Home
                    </NavLink>
                    <NavLink
                        to="/about"
                        className="hover:bg-orange-800 hover:text-white rounded-lg text-lg font-bold transition-colors duration-300 px-4 py-2"
                    >
                        About
                    </NavLink>
                    <NavLink
                        to="/exam"
                        className="hover:bg-orange-800 hover:text-white rounded-lg text-lg font-bold transition-colors duration-300 px-4 py-2"
                    >
                         Exam
                    </NavLink>
                    <NavLink
                        to="/subjectwise-exam"
                        className="hover:bg-orange-800 hover:text-white rounded-lg text-lg font-bold transition-colors duration-300 px-4 py-2"
                    >
                        Subject Wise Exam
                    </NavLink>
                    {isAuthenticated && (
                        <NavLink
                            to="/dashboard"
                            className="hover:bg-orange-800 hover:text-white rounded-lg text-lg font-bold transition-colors duration-300 px-4 py-2"
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
                        <button className="btn bg-blue-500 text-white rounded-md">Login</button>
                    </Link>
                )}
            </div>
        </div>
    );
};

export default Navbar;

// New 
// import { Link, NavLink } from "react-router-dom";
// import { useNavigate } from "react-router-dom";
// import Swal from "sweetalert2";
// import { useState } from "react";

// const Navbar1 = () => {
//     const navigate = useNavigate();
//     const [showExamMenu, setShowExamMenu] = useState(false);

//     const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

//     const handleLogOut = () => {
//         localStorage.removeItem('isAuthenticated');
//         localStorage.removeItem('token');

//         Swal.fire({
//             title: 'Logout Successfully',
//             icon: 'success',
//             confirmButtonText: 'OK',
//             customClass: {
//                 confirmButton: 'swal-button'
//             }
//         }).then(() => {
//             navigate('/login');
//         });
//     };

//     return (
//         <div className="navbar flex justify-between ml-2 items-center px-10 py-5 shadow-md text-xl font-semibold">
//             <div className="navbar-start">
//                 <a className="text-2xl font-bold ml-2">Online Examination System Management</a>
//             </div>
//             <div className="navbar-center flex-grow flex justify-center">
//                 <ul className="flex space-x-2 relative">
//                     <NavLink
//                         to="/"
//                         className="hover:bg-orange-800 hover:text-white rounded-lg text-lg font-bold transition-colors duration-300 px-4 py-2"
//                     >
//                         Home
//                     </NavLink>
//                     <NavLink
//                         to="/about"
//                         className="hover:bg-orange-800 hover:text-white rounded-lg text-lg font-bold transition-colors duration-300 px-4 py-2"
//                     >
//                         About
//                     </NavLink>
//                     {/* Dropdown Menu */}
//                     <div className="relative">
//                         <button
//                             onClick={() => setShowExamMenu(!showExamMenu)}
//                             className="hover:bg-orange-800 hover:text-white rounded-lg text-lg font-bold transition-colors duration-300 px-4 py-2 flex items-center"
//                         >
//                             BCS Exam
//                             <span className="ml-2">▼</span>
//                         </button>
//                         {showExamMenu && (
//                             <ul className="absolute bg-white shadow-lg rounded-md mt-2 py-2 w-48 z-10">
//                                 <li>
//                                     <NavLink
//                                         to="/exam"
//                                         className="block hover:bg-orange-800 hover:text-white rounded-lg text-lg font-bold transition-colors duration-300 px-4 py-2"
//                                         onClick={() => setShowExamMenu(false)}
//                                     >
//                                         Exam
//                                     </NavLink>
//                                 </li>
//                                 <li>
//                                     <NavLink
//                                         to="/subjectwise-exam"
//                                         className="block hover:bg-orange-800 hover:text-white rounded-lg text-lg font-bold transition-colors duration-300 px-4 py-2"
//                                         onClick={() => setShowExamMenu(false)}
//                                     >
//                                         Subject Wise Exam
//                                     </NavLink>
//                                 </li>
//                             </ul>
//                         )}
//                     </div>
//                     {isAuthenticated && (
//                         <NavLink
//                             to="/dashboard"
//                             className="hover:bg-orange-800 hover:text-white rounded-lg text-lg font-bold transition-colors duration-300 px-4 py-2"
//                         >
//                             Dashboard
//                         </NavLink>
//                     )}
//                 </ul>
//             </div>
//             <div>
//                 {isAuthenticated ? (
//                     <button
//                         onClick={handleLogOut}
//                         className="btn bg-blue-500 text-white rounded-md ml-2"
//                     >
//                         Log Out
//                     </button>
//                 ) : (
//                     <Link to="/login">
//                         <button className="btn bg-blue-500 text-white rounded-md">Login</button>
//                     </Link>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default Navbar;

