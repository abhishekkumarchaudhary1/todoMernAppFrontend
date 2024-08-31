import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const TrashedTodos = () => {
  const [todos, setTodos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrashedTodos = async () => {
      try {
        const response = await axios.get("https://todomernappbackend-8fju.onrender.com/api/v1/todo/fetch-trashed-todos", { withCredentials: true });
        setTodos(response.data.data);
      } catch (err) {
        console.error("Failed to fetch todos:", err);
      }
    };

    fetchTrashedTodos();
  }, []);

  const handleRetrieve = async (id) => {
    try {
      await axios.post(`https://todomernappbackend-8fju.onrender.com/api/v1/todo/retrieve-todo/${id}`, {}, { withCredentials: true });
      setTodos(todos.filter(todo => todo._id !== id));
    } catch (err) {
      console.error("Failed to retrieve todo:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://todomernappbackend-8fju.onrender.com/api/v1/todo/delete-todo/${id}`, { withCredentials: true });
      setTodos(todos.filter(todo => todo._id !== id));
    } catch (err) {
      console.error("Failed to delete todo:", err);
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto bg-slate-100">
      <div className="mb-4 flex justify-between">
        <button
          onClick={() => navigate("/dashboard")}
          className="px-4 py-2 text-xs md:text-sm bg-blue-500 text-white rounded"
        >
          Back to Dashboard
        </button>
        <button
          onClick={() => navigate("/dashboard/activetodos")}
          className="px-4 py-2 text-xs md:text-sm bg-green-500 text-white rounded"
        >
          Back to Active Todos
        </button>
      </div>
      <h2 className="text-2xl font-bold mb-4">Trashed Todos</h2>
      {todos.length === 0 ? (
        <p className="text-gray-500">No trashed todos found.</p>
      ) : (
        todos.map(todo => (
          <div key={todo._id} className="p-4 mb-4 bg-white rounded-lg shadow-md">
            <h3 className="text-lg font-semibold">{todo.title}</h3>
            <p className="text-gray-700">{todo.description}</p>
            <div className="mt-4 space-x-2">
              <button
                onClick={() => handleRetrieve(todo._id)}
                className="px-4 py-2 bg-green-500 text-white rounded"
              >
                Retrieve
              </button>
              <button
                onClick={() => handleDelete(todo._id)}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default TrashedTodos;
