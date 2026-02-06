// RequestReset.tsx
import { useState, type FormEvent } from "react";
import toast from "react-hot-toast";
import teamImage from "../assets/team4.jpg";
import { BiArrowToLeft } from "react-icons/bi";
import api from "../api/axiosInstance";

const RequestReset = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);

      const res = await api.post("/forgot", { email });

      console.log(res);

      toast.success("Password reset link sent to your email!");
      setEmail("");
    } catch (error: any) {
      toast.error(error.response?.data?.error);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

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
                Email
              </label>
              <input
                type="email"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter Email to reset password"
                className="bg-gray-100 p-2 rounded-md outline-primary"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="bg-primary p-2 w-full mt-10 text-white text-xl font-medium rounded-xl"
              >
                {loading ? "Sending..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RequestReset;
