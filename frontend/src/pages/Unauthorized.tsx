import { Link } from "react-router-dom";

export default function Unauthorized() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md">
        <h1 className="text-4xl font-bold text-red-500 mb-4">403</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Unauthorized Access
        </h2>
        <p className="text-gray-600 mb-6">
          You don’t have permission to view this page.  
          Please contact your administrator or go back.
        </p>
        <Link
          to="/login"
          className="px-4 py-2 bg-[#4153ef] text-white rounded-lg hover:bg-[#3542c8] transition"
        >
          Go to Login
        </Link>
      </div>
    </div>
  );
}
