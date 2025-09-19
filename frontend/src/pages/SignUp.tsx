import { Link } from "react-router-dom";
import teamImage from "../assets/team4.jpg";
import { useState } from "react";
import { BiArrowToLeft } from "react-icons/bi";
import { toast, Toaster } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";

type SignUpFormInput = {
  name: string;
  email: string;
  password: string;
  locale: string;
};

const SignUp = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormInput>();

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data: SignUpFormInput) => {
    setLoading(true);

    try {
      const res = await api.post("/auth/register", data);

      if (!res.data?.token) {
        toast.error("Login failed:Token not received");
        setLoading(false);
        return;
      }

      //store token if available
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      toast.success("Signup successful!");
      setLoading(false);

      // Wait 2.5s before redirect
      setTimeout(() => {
        //redirect to home page
        navigate("/login");
      }, 3000);
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.message ||
        "Something went wrong,Please try again.";
      toast.error(errorMsg);
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex ">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="w-1/2 hidden lg:flex h-full ">
        <img
          src={teamImage}
          alt="image of a team working together"
          className=" w-full h-full "
        />
      </div>
      <div className="flex-1 items-center p-4  ">
        <div>
          <BiArrowToLeft className="text-primary text-3xl" />
        </div>
        <div className="p-3 ">
          <div className="pt-">
            <div className="pt-3 pb-3 text-primary">
              <h1 className="text-3xl font-medium">Create Account</h1>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="md:p-[10%]">
              <div className="flex flex-col pt-3 ">
                <label htmlFor="name" className="text-xl p-1">
                  Name
                </label>
                <input
                  type="text"
                  placeholder="Enter account name e.g Pgarnes"
                  className="bg-gray-100 p-2 rounded-md outline-primary"
                  {...register("name", { required: "Name is required" })}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm ">{errors.name.message}</p>
                )}
              </div>
              <div className="flex flex-col pt-2">
                <label htmlFor="name" className="text-xl p-1">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Enter work email"
                  className="bg-gray-100 p-2 rounded-md outline-primary"
                  {...register("email", { required: "Email is required" })}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm ">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col pt-2">
                <label htmlFor="name" className="text-xl p-1">
                  Locale
                </label>
                <input
                  type="text"
                  placeholder="Enter locale e.g Norway"
                  className="bg-gray-100 p-2 rounded-md outline-primary"
                  {...register("locale", { required: "Locale is required" })}
                />
                {errors.locale && (
                  <p className="text-red-500 text-sm ">
                    {errors.locale.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col pt-2">
                <label htmlFor="name" className="text-xl p-1">
                  Password
                </label>
                <input
                  type="text"
                  placeholder="choose a password"
                  className="bg-gray-100 p-2 rounded-md outline-primary"
                  {...register("password", {
                    required: "Password is required",
                  })}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm ">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <div className="pt-5">
                <h1 className=" text-end">
                  Already have an account{" "}
                  <Link className="text-primary font-bold" to={"/login"}>
                    Log in
                  </Link>
                </h1>
              </div>
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-primary p-2 w-full mt-3 text-white text-xl font-medium rounded-xl "
                >
                  {loading ? (
                    <span className="roundef-full ">Loading..</span>
                  ) : (
                    "SignUp"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
