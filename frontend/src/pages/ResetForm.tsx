// RequestReset.tsx
import { useState, type FormEvent } from "react";
import toast from "react-hot-toast";
import teamImage from "../assets/team4.jpg";
import { BiArrowToLeft } from "react-icons/bi";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";

const ResetForm = () => {
  const [password, setPassword] = useState("");
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");
  const token = searchParams.get("token");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/resetpassword", {
        email,
        token,
        newPassword: password,
      });
      toast.success("Password reset successfully!");
      navigate("/login");
    } catch (err: any) {
      toast.error(err.response?.data?.error);
      console.log(err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  if (!email || !token)
    return (
      <div className="flex items-center justify-center h-screen text-red-500 font-semibold text-3xl">
        Invalid or expired password reset Link
      </div>
    );
  return (
    <div className="h-screen flex">
      <div className="w-1/2 hidden md:flex">
        <img
          src={teamImage}
          alt="team working together"
          className="w-full h-full"
        />
      </div>

      <div className="flex-1 items-center p-4">
        <div>
          <BiArrowToLeft className="text-primary text-3xl" />
        </div>
        <div className="p-3">
          <div className="pt-3 pb-3 text-primary">
            <h1 className="text-3xl font-medium">Reset Password</h1>
          </div>

          <form onSubmit={handleSubmit} className="pt-5 md:p-[10%]">
            <div className="flex flex-col pt-2">
              <label htmlFor="email" className="text-xl p-1">
                New Password
              </label>
              <input
                type="text"
                placeholder="Enter new password"
                className="bg-gray-100 p-2 rounded-md outline-primary"
                required
              />
            </div>
            <div className="flex flex-col pt-2">
              <label htmlFor="email" className="text-xl p-1">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="Confirm password password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-gray-100 p-2 rounded-md outline-primary"
                required
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="bg-primary p-2 w-full mt-10 text-white text-xl font-medium rounded-xl"
              >
                {loading ? "Requesting...." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetForm;
