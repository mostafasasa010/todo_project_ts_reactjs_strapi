import { NavLink } from "react-router-dom";

const Footer = () => {
  const storageKey = "loggedInUser";
  const userDataString = localStorage.getItem(storageKey);
  const userData = userDataString ? JSON.parse(userDataString) : null;
  const admin = "mostafa.ahmed@gmail.com";
  return (
    <footer className="container z-20 fixed bottom-0 left-[50%] translate-x-[-50%] mb-2">
      <div
        className={`w-full p-3 text-center bg-white border-t border-gray-200 shadow md:flex md:items-center ${
          userData && "md:justify-between"
        } md:justify-center md:p-4 dark:bg-gray-800 dark:border-gray-600 rounded-md`}
      >
        <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
          © 2024{" "}
          <a
            href="https://mostafasasa010.github.io/Mostafa_Website/"
            target="_blank"
            className="text-base text-indigo-300 font-semibold hover:underline"
          >
            Mostafa
          </a>
          . All Rights Reserved.
        </span>
        {userData && (
          <ul className="flex flex-wrap items-center justify-center gap-4 mt-2 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
            {userData?.user?.email === admin && (
              <>
                <li>
                  <NavLink
                    to="/todos"
                    className="text-sm text-indigo-300 font-semibold hover:underline m-auto"
                  >
                    Todos
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/users"
                    className="text-sm text-indigo-300 font-semibold hover:underline m-auto"
                  >
                    Users
                  </NavLink>
                </li>
              </>
            )}
            <li>
              <NavLink
                to="/profile"
                className="text-sm text-indigo-300 font-semibold hover:underline m-auto"
              >
                Profile
              </NavLink>
            </li>
          </ul>
        )}
      </div>
    </footer>
  );
};

export default Footer;
