import toast from "react-hot-toast";
import { NavLink, useLocation } from "react-router-dom";
import Button from "./ui/Button";

const Navbar = () => {
  const { pathname } = useLocation();
  const storageKey = "loggedInUser";
  const userDataString = localStorage.getItem(storageKey);
  const userData = userDataString ? JSON.parse(userDataString) : null;
  const admin = "mostafa.ahmed@gmail.com";

  const onLogout = () => {
    localStorage.removeItem(storageKey);
    toast.success("Your logged out!", {
      position: "bottom-center",
      duration: 1200,
      style: {
        backgroundColor: "black",
        color: "white",
        width: "fit-content",
      },
    });
    setTimeout(() => {
      location.replace(pathname);
    }, 1200);
  };

  return (
    <nav className="max-w-2xl mx-auto mt-2 mb-6 px-3 py-2 bg-gray-100 rounded-md">
      <ul className="flex items-center justify-between">
        <li className="duration-200 font-semibold text-lg text-gray-700">
          <NavLink to="/">Home</NavLink>
        </li>
        {userData ? (
          <div className="flex items-center space-x-6">
            {userData?.user?.email === admin && (
              <li className="duration-200 text-lg font-semibold">
                <NavLink to="/todos">Todos</NavLink>
              </li>
            )}
            <li className="duration-200 text-lg font-semibold">
              <NavLink to="/profile">Profile</NavLink>
            </li>
            <Button
              className="font-semibold cursor-pointer"
              size={"sm"}
              onClick={onLogout}
            >
              Logout
            </Button>
          </div>
        ) : (
          <p className="flex items-center space-x-3">
            <li className="duration-200 font-semibold text-lg">
              <NavLink to="/register">Register</NavLink>
            </li>
            <li className="duration-200 font-semibold text-lg">
              <NavLink to="/login">Login</NavLink>
            </li>
          </p>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
