import { Link, useNavigate } from "react-router-dom";
import teamImage from "../assets/team4.jpg";
import { useState } from "react";
import { BiArrowToLeft } from "react-icons/bi";
import { useForm } from "react-hook-form";
import api from "../api/axiosInstance";
import toast, { Toaster } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

type LoginFormInputs = {
  email: string;
  password: string;
};

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();

  const { setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data: LoginFormInputs) => {
    setLoading(true);

    try {
      const res = await api.post("/auth/login", data);

      if (!res.data?.token) {
        toast.error("Login failed: Token not received");
        setLoading(false);
        return;
      }

      // store token & user
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      setUser(res.data.user);
      toast.success("Login successful!");
      setLoading(false);

      // Redirect based on role
      const role = res.data.user?.role;
      if (role === "admin") {
        navigate("/admin", { replace: true });
      } else if (role === "worker") {
        navigate("/", { replace: true });
      } else if (role === "client") {
        navigate("/client/report", { replace: true });
      } else {
        navigate("/unauthorized", { replace: true });
      }
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.message ||
        "Something went wrong, please try again.";
      toast.error(errorMsg);
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="w-1/2 hidden lg:flex">
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
            <h1 className="text-3xl font-medium">Login</h1>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="pt-5 md:p-[10%]">
            <div className="flex flex-col pt-2">
              <label htmlFor="email" className="text-xl p-1">
                Email
              </label>
              <input
                type="email"
                {...register("email", { required: "Email is required" })}
                placeholder="Enter work email"
                className="bg-gray-100 p-2 rounded-md outline-primary"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="flex flex-col pt-2">
              <label htmlFor="password" className="text-xl p-1">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                className="bg-gray-100 p-2 rounded-md outline-primary"
                {...register("password", {
                  required: "Password is required",
                })}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="pt-5 text-end">
              <h1>
                Forgot password{" "}
                <Link className="text-primary font-bold" to={"/signup"}>
                  Reset Password
                </Link>
              </h1>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="bg-primary p-2 w-full mt-10 text-white text-xl font-medium rounded-xl"
              >
                {loading ? "Loading..." : "Login"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
