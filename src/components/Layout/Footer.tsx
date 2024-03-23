import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  const storageKey = "loggedInUser";
  const userDataString = localStorage.getItem(storageKey);
  const userData = userDataString ? JSON.parse(userDataString) : null;

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
        <ul className="flex flex-wrap items-center justify-center gap-3 mt-2 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
          <li>
            <Link
              to="https://www.facebook.com/profile.php?id=100015156155072"
              className="text-sm text-indigo-300 font-semibold hover:underline m-auto"
              target="_blank"
            >
              <FaFacebookF className="text-xl hover:text-[#1877f2] duration-200" />
            </Link>
          </li>
          <li>
            <Link
              to="https://www.instagram.com/m_daar4"
              className="text-sm text-indigo-300 font-semibold hover:underline m-auto"
              target="_blank"
            >
              <FaInstagram className="text-xl hover:text-[#c32aa3] duration-200" />
            </Link>
          </li>
          <li>
            <Link
              to="https://twitter.com/Mostafa56069655"
              className="text-sm text-indigo-300 font-semibold hover:underline m-auto"
              target="_blank"
            >
              <FaTwitter className="text-xl hover:text-[#1da1f2] duration-200" />
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
