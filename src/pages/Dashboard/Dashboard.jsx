import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import axios from "axios";

// import useAuth from '../../hooks/useAuth';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [accountDetails, setAccountDetails] = useState({
    fullName: "",
    email: "",
  });
  const [avatar, setAvatar] = useState(null);
  const navigate = useNavigate();

  const { setIsAuthenticated } = useOutletContext(); // Access the setIsAuthenticated function
  // const { isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        localStorage.setItem("test123fromDashboard.jsx", 'sample test text in local storage in Dashboard');

        const response = await axios.get("https://todomernappbackend-8fju.onrender.com/api/v1/users/get-current-user", {
          withCredentials: true,
        });
        console.log("Response from dashboard", response);
        

        if (response.data.data) {
          setUser(response.data.data);
          setAccountDetails({
            fullName: response.data.data.fullName,
            email: response.data.data.email,
          });
          setIsAuthenticated(true);
        } else {
          throw new Error("User not authenticated");
        }
      } catch (err) {
        setError("Please log in first.");
        setIsAuthenticated(false);
        navigate("/login");
      }
    };

    checkAuthentication();
  }, [navigate, setIsAuthenticated]);

  const handleLogout = async () => {
    try {
      await axios.post("https://todomernappbackend-8fju.onrender.com/api/v1/users/logout", {}, { withCredentials: true });
      // logout();
      
      setUser(null);
      localStorage.removeItem("token");
      console.log("user logged out");
      
      setIsAuthenticated(false);
      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const handleAccountUpdate = async () => {
    try {
      await axios.post(
        "https://todomernappbackend-8fju.onrender.com/api/v1/users/update-account-details",
        accountDetails,
        { withCredentials: true }
      );
      alert("Account details updated successfully");
    } catch (err) {
      console.error("Account update error:", err);
    }
  };

  const handleAvatarUpdate = async () => {
    const formData = new FormData();
    formData.append("avatar", avatar);

    try {
      await axios.post("https://todomernappbackend-8fju.onrender.com/api/v1/users/update-user-avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      alert("Avatar updated successfully");
    } catch (err) {
      console.error("Avatar update error:", err);
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-red-600">{error}</h2>
          <button
            className="mt-4 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
            onClick={() => navigate("/login")}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md my-5">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
          User Dashboard
        </h2>
        <div className="mb-4 flex justify-center">
          <img
            src={user.avatar}
            alt="User Avatar"
            className="w-24 h-24 rounded-full object-cover"
          />
        </div>
        <div className="mb-2">
          <strong>User ID:</strong> {user._id}
        </div>
        <div className="mb-2">
          <strong>Username:</strong> {user.username}
        </div>
        <div className="mb-2">
          <strong>Email:</strong> {user.email}
        </div>

        {/* Account Update Section */}
        <div className="mt-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Full Name
          </label>
          <input
            type="text"
            name="fullName"
            value={accountDetails.fullName}
            onChange={(e) =>
              setAccountDetails({ ...accountDetails, fullName: e.target.value })
            }
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
        <div className="mt-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={accountDetails.email}
            onChange={(e) =>
              setAccountDetails({ ...accountDetails, email: e.target.value })
            }
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
        <button
          className="mt-4 w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
          onClick={handleAccountUpdate}
        >
          Update Account Details
        </button>

        {/* Avatar Update Section */}
        <div className="mt-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Update Avatar
          </label>
          <input
            type="file"
            name="avatar"
            onChange={(e) => setAvatar(e.target.files[0])}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
        <button
          className="mt-4 w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
          onClick={handleAvatarUpdate}
        >
          Update Avatar
        </button>

        <button
          className="mt-6 w-full px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700"
          onClick={handleLogout}
        >
          Logout
        </button>

        <button
          className="mt-6 w-full px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700"
          onClick={() => navigate("/dashboard/activetodos")}
        >
          Active Todos
        </button>
        <button
          className="mt-4 w-full px-4 py-2 bg-yellow-600 text-white font-semibold rounded-lg hover:bg-yellow-700"
          onClick={() => navigate("/dashboard/trashedtodos")}
        >
          Trashed Todos
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
