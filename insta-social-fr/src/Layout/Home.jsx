import { Outlet } from "react-router-dom";
import Navbar from "./Navbar"; // adjust path based on structure
import Footer from "./Footer";

export default function Home({ children }) {
  return (
    <div >
      <div>
        <Navbar />
      </div>
      <div >{children}</div>
      <div>
        <Footer />
      </div>
    </div>
  );
}
