import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";

const Home = () => {
  const router = useRouter();
  const [todos, setTodos] = useState<any>();
  const [task, setTask] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("medium");
  const [message, setMessage] = useState("");

  const { username } = router.query;

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await axios.get("/api/todos");
        setTodos(response.data);
      } catch (error) {
        console.error("Error fetching todos", error);
      }
    };

    fetchTodos();
  }, []);
  console.log(username);

  const handleAddTodo = async (e: any) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/todos", {
        task,
        due_date: dueDate,
        priority,
      });
      setMessage(response.data.message);
      setTask("");
      setDueDate("");
      setPriority("medium");
      const updatedTodos = await axios.get("/api/todos");
      setTodos(updatedTodos.data);
    } catch (error) {
      setMessage("Error occurred while adding the todo.");
    }
  };

  const handleSignOut = async () => {
    try {
      localStorage.removeItem("authToken");
      setMessage("You have successfully signed out.");
      window.location.href = "/";
    } catch (error) {
      setMessage("Error occurred during sign-out.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-bold text-center mb-6">Todo List</h1>
        <div className="flex justify-end mb-6">
          <button
            onClick={handleSignOut}
            className="py-2 px-4 bg-red-500 text-white font-semibold rounded-md shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Sign Out
          </button>
        </div>
        <form onSubmit={handleAddTodo} className="mb-6">
          <div className="mb-4">
            <label
              htmlFor="task"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Task:
            </label>
            <input
              id="task"
              type="text"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="dueDate"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Due Date:
            </label>
            <input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="priority"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Priority:
            </label>
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Add Todo
          </button>
        </form>
        {message && (
          <p
            className={`mt-4 text-center text-sm ${
              message.includes("Error") ? "text-red-500" : "text-green-500"
            }`}
          >
            {message}
          </p>
        )}

        <div>
          <h2 className="text-xl font-bold mb-4">Current Todos</h2>
          {todos?.length === 0 ? (
            <p className="text-gray-500">No todos found.</p>
          ) : (
            <ul className="space-y-4">
              {todos?.map((todo: any) => (
                <li
                  key={todo.id}
                  className="p-4 bg-gray-100 rounded-md shadow-sm"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold">{todo.task}</h3>
                      <p className="text-sm text-gray-500">
                        Due: {new Date(todo.due_date).toLocaleDateString()} |
                        Priority: {todo.priority}
                      </p>
                    </div>
                    <p
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        todo.status === "pending"
                          ? "bg-yellow-200 text-yellow-800"
                          : "bg-green-200 text-green-800"
                      }`}
                    >
                      {todo.status}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
