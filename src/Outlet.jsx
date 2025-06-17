import { Navigate, useLocation, useNavigate, useOutlet } from "react-router-dom"
import Navbar from "./Layout/Navbar";
import Footer from "./Layout/Footer";
import { useAuth } from "./context/AuthContext";
import { useEffect } from "react";

const Outlet = () => {
    const { isAuthenticated } = useAuth();
    const outlet = useOutlet();
    const Navigate = useNavigate();
     const location = useLocation();


    useEffect(() => {
        // Allow public access to /reset-password/:token
        if (
            !isAuthenticated &&
            !/^\/reset-password\/[^/]+$/.test(location.pathname)
        ) {
            Navigate("/login", { state: { view: "login" } });
        }
    }, [isAuthenticated, location.pathname, Navigate]);

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="grow">
                {outlet}
            </div>
            <Footer />
        </div>
    )
}

export default Outlet