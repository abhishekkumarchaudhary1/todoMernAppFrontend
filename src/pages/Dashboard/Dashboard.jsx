import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
  });
  const [accountDetails, setAccountDetails] = useState({
    fullName: "",
    email: "",
  });
  const [avatar, setAvatar] = useState(null);
  const [todos, setTodos] = useState([]); // State to store todos
  const [newTodo, setNewTodo] = useState({ title: "", description: "" }); // State to handle new todo
  const [editTodo, setEditTodo] = useState({ id: "", title: "", description: "" }); // State to handle todo editing
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get("/myApi/users/get-current-user", { withCredentials: true });
        setUser(response.data.data);

        setAccountDetails({
          fullName: response.data.data.fullName,
          email: response.data.data.email,
        });

        // Fetch todos for the user
        const todosResponse = await axios.get("/myApi/todo/fetch-all-todos", { withCredentials: true });
        console.log(todosResponse);
        
        setTodos(todosResponse.data.data);

      } catch (err) {
        setError("Please log in first.");
      }
    };

    fetchUserDetails();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post("/myApi/users/logout", {}, { withCredentials: true });
      setUser(null);  // Clear the user state
      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const handlePasswordChange = async () => {
    try {
      await axios.post("/myApi/users/change-password", passwords, { withCredentials: true });
      alert("Password changed successfully");
      setPasswords({ oldPassword: "", newPassword: "" });
    } catch (err) {
      console.error("Password change error:", err);
    }
  };

  const handleAccountUpdate = async () => {
    try {
      await axios.post("/myApi/users/update-account-details", accountDetails, { withCredentials: true });
      alert("Account details updated successfully");
    } catch (err) {
      console.error("Account update error:", err);
    }
  };

  const handleAvatarUpdate = async () => {
    const formData = new FormData();
    formData.append("avatar", avatar);

    try {
      await axios.post("/myApi/users/update-user-avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      alert("Avatar updated successfully");
    } catch (err) {
      console.error("Avatar update error:", err);
    }
  };

  // Handle creating a new todo
  const handleCreateTodo = async () => {
    try {
      await axios.post("/myApi/todo/create-todo", newTodo, { withCredentials: true });
      alert("Todo created successfully");
      setNewTodo({ title: "", description: "" });
      const todosResponse = await axios.get("/myApi/todo/fetch-all-todos", { withCredentials: true });
      setTodos(todosResponse.data.data);
    } catch (err) {
      console.error("Todo creation error:", err);
    }
  };

  // Handle updating a todo
  const handleUpdateTodo = async () => {
    try {
      await axios.post(`/myApi/todo/update-todo/${editTodo.id}`, {
        title: editTodo.title,
        description: editTodo.description
      }, { withCredentials: true });
      alert("Todo updated successfully");
      setEditTodo({ id: "", title: "", description: "" });
      const todosResponse = await axios.get("/myApi/todo/fetch-all-todos", { withCredentials: true });
      setTodos(todosResponse.data.data);
    } catch (err) {
      console.error("Todo update error:", err);
    }
  };

  // Handle trashing a todo
  const handleTrashTodo = async (id) => {
    try {
      await axios.post(`/myApi/todo/trash-todo/${id}`, {}, { withCredentials: true });
      alert("Todo moved to trash");
      const todosResponse = await axios.get("/myApi/todo/fetch-all-todos", { withCredentials: true });
      setTodos(todosResponse.data.data);
    } catch (err) {
      console.error("Todo trash error:", err);
    }
  };

  // Handle deleting a todo
  const handleDeleteTodo = async (id) => {
    try {
      await axios.delete(`/myApi/todo/delete-todo/${id}`, { withCredentials: true });
      alert("Todo deleted successfully");
      const todosResponse = await axios.get("/myApi/todo/fetch-all-todos", { withCredentials: true });
      setTodos(todosResponse.data.data);
    } catch (err) {
      console.error("Todo delete error:", err);
    }
  };

  // Handle retrieving a trashed todo
  const handleRetrieveTodo = async (id) => {
    try {
      await axios.post(`/myApi/todo/retrieve-todo/${id}`, {}, { withCredentials: true });
      alert("Todo retrieved successfully");
      const todosResponse = await axios.get("/myApi/todo/fetch-all-todos", { withCredentials: true });
      setTodos(todosResponse.data.data);
    } catch (err) {
      console.error("Todo retrieve error:", err);
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
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">User Dashboard</h2>
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
          <label className="block text-gray-700 text-sm font-bold mb-2">Full Name</label>
          <input
            type="text"
            name="fullName"
            value={accountDetails.fullName}
            onChange={(e) => setAccountDetails({ ...accountDetails, fullName: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
        <div className="mt-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={accountDetails.email}
            onChange={(e) => setAccountDetails({ ...accountDetails, email: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
        <button
          className="mt-4 w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
          onClick={handleAccountUpdate}
        >
          Update Account Details
        </button>

        {/* Password Change Section */}
        <div className="mt-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Old Password</label>
          <input
            type="password"
            name="oldPassword"
            value={passwords.oldPassword}
            onChange={(e) => setPasswords({ ...passwords, oldPassword: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
        <div className="mt-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">New Password</label>
          <input
            type="password"
            name="newPassword"
            value={passwords.newPassword}
            onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
        <button
          className="mt-4 w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
          onClick={handlePasswordChange}
        >
          Change Password
        </button>

        {/* Avatar Update Section */}
        <div className="mt-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Update Avatar</label>
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
      </div>

      {/* Todo Management Section */}
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md my-5">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Todo Management</h2>

        {/* Create New Todo */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">New Todo Title</label>
          <input
            type="text"
            name="title"
            value={newTodo.title}
            onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">New Todo Description</label>
          <textarea
            name="description"
            value={newTodo.description}
            onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
        <button
          className="w-full px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700"
          onClick={handleCreateTodo}
        >
          Create Todo
        </button>

        {/* Edit Existing Todo */}
        <div className="mt-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">Edit Todo Title</label>
          <input
            type="text"
            name="editTitle"
            value={editTodo.title}
            onChange={(e) => setEditTodo({ ...editTodo, title: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
        <div className="mt-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Edit Todo Description</label>
          <textarea
            name="editDescription"
            value={editTodo.description}
            onChange={(e) => setEditTodo({ ...editTodo, description: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
        <button
          className="mt-4 w-full px-4 py-2 bg-yellow-600 text-white font-semibold rounded-lg hover:bg-yellow-700"
          onClick={handleUpdateTodo}
        >
          Update Todo
        </button>

        {/* List Todos */}
        <h3 className="mt-6 text-xl font-semibold text-gray-800">Your Todos</h3>
        {todos.length === 0 ? (
          <p className="text-gray-600 mt-4">No todos found.</p>
        ) : (
          <ul className="mt-4">
            {todos.map((todo) => (
              <li key={todo._id} className="mb-4 p-4 border rounded-lg shadow-md">
                <h4 className="text-lg font-bold text-gray-800">{todo.title}</h4>
                <p className="text-gray-700">{todo.description}</p>
                <div className="mt-4 flex justify-between">
                  <button
                    className="px-3 py-1 bg-yellow-600 text-white font-semibold rounded-lg hover:bg-yellow-700"
                    onClick={() =>
                      setEditTodo({ id: todo._id, title: todo.title, description: todo.description })
                    }
                  >
                    Edit
                  </button>
                  <button
                    className="px-3 py-1 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700"
                    onClick={() => handleTrashTodo(todo._id)}
                  >
                    Trash
                  </button>
                  <button
                    className="px-3 py-1 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
                    onClick={() => handleDeleteTodo(todo._id)}
                  >
                    Delete
                  </button>
                  {todo.status === "trashed" && (
                    <button
                      className="px-3 py-1 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700"
                      onClick={() => handleRetrieveTodo(todo._id)}
                    >
                      Retrieve
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}

      </div>
    </div>
  );
};

export default Dashboard;

