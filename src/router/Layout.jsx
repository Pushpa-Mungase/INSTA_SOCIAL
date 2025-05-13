import { Outlet } from "react-router-dom";
import Navbar from "../MyComponent/Navbar"; // adjust path based on structure
import Footer from "../MyComponent/Footer";

export default function Layout() {
  return (
    <>
      <div className="flex flex-col gap-2">
        <Navbar />

        <Outlet />

        <Footer />
      </div>
    </>
  );
}
