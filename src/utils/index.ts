import toast from "react-hot-toast";
import { useLocation } from "react-router";

export const OnLogout = () => {
  const { pathname } = useLocation();
  const storageKey = "loggedInUser";

  localStorage.removeItem(storageKey);
  toast.success("Your logged out!", {
    position: "bottom-center",
    duration: 1000,
    style: {
      backgroundColor: "black",
      color: "white",
      width: "fit-content",
    },
  });
  setTimeout(() => {
    location.replace(pathname);
  }, 1000);
};
