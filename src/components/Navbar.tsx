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
    <>
      {/* <nav className="container mt-2">
        <div className="max-w-2xl mx-auto mb-6 px-3 py-2 bg-gray-100 rounded-md">
          <ul className="flex items-center justify-between">
            <li className="duration-200 font-semibold text-lg text-gray-700 sm:text-xl">
              <NavLink to="/">Home</NavLink>
            </li>
            {userData ? (
              <div className="flex items-center gap-1 sm:gap-4">
                {userData?.user?.email === admin && (
                  <>
                    <li className="duration-200 font-semibold sm:text-lg">
                      <NavLink to="/todos">Todos</NavLink>
                    </li>
                    <li className="duration-200 font-semibold sm:text-lg">
                      <NavLink to="/users">Users</NavLink>
                    </li>
                  </>
                )}
                <li className="duration-200 font-semibold sm:text-lg">
                  <NavLink to="/profile">Profile</NavLink>
                </li>
                <Button
                  className="font-semibold cursor-pointer p-2 py-1 sm:p-3 sm:py-2 sm:text-md"
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
        </div>
      </nav> */}

      <nav className="container mt-2 mb-6">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-3 dark:bg-gray-900 rounded-md">
          <NavLink
            to="/"
            className="duration-200 font-semibold text-lg text-white sm:text-xl"
          >
            Todo
          </NavLink>
          <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
            <button
              data-collapse-toggle="navbar-user"
              type="button"
              className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              aria-controls="navbar-user"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 17 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 1h15M1 7h15M1 13h15"
                />
              </svg>
            </button>
            {userData ? (
              <Button
                className="font-semibold cursor-pointer p-2 py-1 sm:p-3 sm:py-2 sm:text-md"
                size={"sm"}
                onClick={onLogout}
              >
                Logout
              </Button>
            ) : (
              <div className="flex items-center space-x-3 text-white">
                <NavLink to="/register">
                  <Button
                    className="font-semibold cursor-pointer p-2 py-1 sm:p-3 sm:py-2 sm:text-md"
                    size={"sm"}
                  >
                    Register
                  </Button>
                </NavLink>
                <NavLink to="/login">
                  <Button
                    className="font-semibold cursor-pointer p-2 py-1 sm:p-3 sm:py-2 sm:text-md"
                    size={"sm"}
                  >
                    Login
                  </Button>
                </NavLink>
              </div>
            )}
          </div>
          <div
            className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1 text-white"
            id="navbar-user"
          >
            <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
              {userData && (
                <div className="flex items-center gap-1 sm:gap-4">
                  {userData?.user?.email === admin && (
                    <>
                      <li className="duration-200 font-semibold sm:text-lg">
                        <NavLink to="/todos">Todos</NavLink>
                      </li>
                      <li className="duration-200 font-semibold sm:text-lg">
                        <NavLink to="/users">Users</NavLink>
                      </li>
                    </>
                  )}
                  <li className="duration-200 font-semibold sm:text-lg">
                    <NavLink to="/profile">Profile</NavLink>
                  </li>
                </div>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
