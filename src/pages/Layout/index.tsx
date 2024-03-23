import { Outlet } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

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
