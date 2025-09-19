import toast from "react-hot-toast";
import { type NavigateFunction } from "react-router-dom";

export const logout = (navigate: NavigateFunction) => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  toast.success("Logged out successfully!");

  setTimeout(() => {
    navigate("/login");
  }, 2000);
};
