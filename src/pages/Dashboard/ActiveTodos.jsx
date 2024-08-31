import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ActiveTodos = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState({ title: "", description: "" });
  const [isAdding, setIsAdding] = useState(false);
  const [editingTodoId, setEditingTodoId] = useState(null);
  const [editingTodoData, setEditingTodoData] = useState({ title: "", description: "" });
  const navigate = useNavigate();

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await axios.get("https://todomernappbackend-8fju.onrender.com/api/v1/todo/fetch-active-todos", {
        withCredentials: true,
      });
      setTodos(response.data.data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  const handleEdit = (todo) => {
    setEditingTodoId(todo._id);
    setEditingTodoData({ title: todo.title, description: todo.description });
  };

  const handleSave = async (todoId) => {
    try {
      await axios.post(
        `/myApi/todo/update-todo/${todoId}`,
        editingTodoData,
        { withCredentials: true }
      );
      setEditingTodoId(null);
      fetchTodos();
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  const handleDelete = async (todoId) => {
    try {
      await axios.delete(`https://todomernappbackend-8fju.onrender.com/api/v1/todo/delete-todo/${todoId}`, {
        withCredentials: true,
      });
      fetchTodos();
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const handleShare = async (todoId) => {
    const receiverUserId = prompt("Enter the User ID to share the todo with:");
    if (receiverUserId) {
      try {
        await axios.post(
          `/myApi/todo/share-todo/${todoId}`,
          { receiverUserId },
          { withCredentials: true }
        );
        alert("Todo shared successfully");
      } catch (error) {
        console.error("Error sharing todo:", error);
      }
    }
  };

  const handleAddTodo = async () => {
    try {
      await axios.post(
        "/myApi/todo/create-todo",
        newTodo,
        {
          withCredentials: true,
        }
      );
      setNewTodo({ title: "", description: "" });
      setIsAdding(false);
      fetchTodos();
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  const handleMoveToTrash = async (todoId) => {
    try {
      await axios.post(`https://todomernappbackend-8fju.onrender.com/api/v1/todo/trash-todo/${todoId}`, {}, {
        withCredentials: true,
      });
      fetchTodos();
    } catch (error) {
      console.error("Error moving todo to trash:", error);
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
          onClick={() => navigate("/dashboard/trashedtodos")}
          className="px-4 py-2 text-xs md:text-sm bg-red-500 text-white rounded"
        >
          Go to Trash
        </button>
      </div>
      <h1 className="text-2xl font-bold mb-4">Active Todos</h1>
      <ul className="space-y-4">
        {todos.map((todo) => (
          <li
            key={todo._id}
            className="p-4 bg-white rounded-lg shadow flex justify-between items-center"
          >
            {editingTodoId === todo._id ? (
              <div>
                <input
                  type="text"
                  value={editingTodoData.title}
                  onChange={(e) =>
                    setEditingTodoData({ ...editingTodoData, title: e.target.value })
                  }
                  className="w-full p-2 mb-2 border border-gray-300 rounded"
                />
                <textarea
                  value={editingTodoData.description}
                  onChange={(e) =>
                    setEditingTodoData({ ...editingTodoData, description: e.target.value })
                  }
                  className="w-full p-2 mb-2 border border-gray-300 rounded"
                />
              </div>
            ) : (
              <div>
                <h2 className="text-lg font-semibold">{todo.title}</h2>
                <p>{todo.description}</p>
              </div>
            )}
            <div className="space-x-2">
              {editingTodoId === todo._id ? (
                <button
                  onClick={() => handleSave(todo._id)}
                  className="px-3 py-1 bg-green-500 text-white rounded"
                >
                  Save
                </button>
              ) : (
                <>
                  <button
                    onClick={() => handleEdit(todo)}
                    className="px-3 py-1 my-2 bg-blue-500 text-white rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(todo._id)}
                    className="px-3 py-1 my-2 bg-red-500 text-white rounded"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => handleShare(todo._id)}
                    className="px-3 py-1 my-2 bg-green-500 text-white rounded"
                  >
                    Share
                  </button>
                  <button
                    onClick={() => handleMoveToTrash(todo._id)}
                    className="px-3 py-1 my-2 bg-yellow-500 text-white rounded"
                  >
                    Move to Trash
                  </button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>

      {isAdding ? (
        <div className="mt-6 p-4 bg-gray-100 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Add New Todo</h2>
          <input
            type="text"
            placeholder="Title"
            className="w-full p-2 mb-2 border border-gray-300 rounded"
            value={newTodo.title}
            onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
          />
          <textarea
            placeholder="Description"
            className="w-full p-2 mb-2 border border-gray-300 rounded"
            value={newTodo.description}
            onChange={(e) =>
              setNewTodo({ ...newTodo, description: e.target.value })
            }
          />
          <button
            onClick={handleAddTodo}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Add Todo
          </button>
          <button
            onClick={() => setIsAdding(false)}
            className="ml-2 px-4 py-2 bg-gray-500 text-white rounded"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          className="mt-6 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Add Todo
        </button>
      )}
    </div>
  );
};

export default ActiveTodos;
