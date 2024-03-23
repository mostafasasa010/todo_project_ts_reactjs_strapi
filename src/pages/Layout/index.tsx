import { Outlet } from "react-router-dom";
import Navbar from "../../components/Layout/Navbar";
import Footer from "../../components/Layout/Footer";

const RootLayout = () => {
  return (
    <div className="root-layout">
      <Navbar />
      <div className="container mb-28">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default RootLayout;
