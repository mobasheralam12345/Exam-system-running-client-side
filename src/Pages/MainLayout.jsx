import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Navbar from "./Navbar/Navbar";

const MainLayout = () => {
    return (
        <div>
            <Navbar ></Navbar>
            <div className="min-h-screen mt-10 ml-4">
                <Outlet></Outlet>
            </div>
            <Footer></Footer>
        </div>
    );
};

export default MainLayout;