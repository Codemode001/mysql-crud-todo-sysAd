import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";

const Home = () => {
  const router = useRouter();
  const [todos, setTodos] = useState<any[]>([]);
  const [task, setTask] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("medium");
  const [message, setMessage] = useState("");
  const { userId } = router.query;
  const [userName, setUserName] = useState("");
  const userIdInt =
    typeof userId === "string" ? parseInt(userId, 10) : undefined;

  const addTodo = async (e: any) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/todos", {
        task,
        due_date: dueDate,
        priority,
        userIdInt,
      });
      setMessage(response.data.message);
      setTask("");
      setDueDate("");
      setPriority("medium");
      const updatedTodos = await axios.get("/api/todos");
      setTodos(updatedTodos.data);
      if (userIdInt) {
        fetchTodos(userIdInt);
      }
    } catch (error) {
      setMessage("Error occurred while adding the todo.");
    }
  };

  const signOut = async () => {
    try {
      localStorage.removeItem("authToken");
      setMessage("You have successfully signed out.");
      window.location.href = "/";
    } catch (error) {
      setMessage("Error occurred during sign-out.");
    }
  };

  const fetchTodos = async (userId: number) => {
    try {
      const response = await axios.get(`/api/todos?id=${userId}`);
      setTodos(response.data);
    } catch (error) {
      console.error("Error fetching todos", error);
    }
  };

  const fetchUsers = async (userId: number) => {
    try {
      const response = await axios.get(`/api/users?id=${userId}`);
      const userData = response.data.data;

      if (userData.length > 0) {
        setUserName(userData[0].username);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const updateStatus = async (id: number, newStatus: string) => {
    console.log(newStatus);
    try {
      await axios.put(`/api/todos`, { status: newStatus, id: id });
      if (userIdInt) {
        fetchTodos(userIdInt);
      }
    } catch (error) {
      console.error("Error updating status", error);
    }
  };

  const deleteTodo = async (id: number) => {
    try {
      await axios.delete(`/api/todos?id=${id}`);
      console.log("Success");
    } catch (error) {
      console.error("Error deleting todo", error);
    } finally {
      if (userIdInt) {
        fetchTodos(userIdInt);
      }
    }
  };

  useEffect(() => {
    if (userIdInt) {
      fetchUsers(userIdInt);
      fetchTodos(userIdInt);
    }
  }, [userIdInt]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="bg-blue-500 text-white py-4 px-6 flex justify-between items-center">
        <h1 className="text-xl">
          Hello, <span className="font-semibold">{userName}</span>
        </h1>
        <button
          onClick={signOut}
          className="py-2 px-4 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          Sign Out
        </button>
      </header>
      <main className="flex flex-1 p-6">
        <div className="w-1/2 pr-4">
          <h2 className="text-2xl font-bold mb-4">Current Todos</h2>
          {todos.length === 0 ? (
            <p className="text-gray-500">No todos found.</p>
          ) : (
            <ul className="space-y-4">
              {todos.map((todo: any) => (
                <li key={todo.id} className="p-4 bg-white rounded-md shadow-sm">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold">{todo.task}</h3>
                      <p className="text-sm text-gray-500">
                        Due: {new Date(todo.due_date).toLocaleDateString()} |
                        Priority: {todo.priority}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <p
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          todo.status === "pending"
                            ? "bg-yellow-200 text-yellow-800"
                            : todo.status === "doing"
                            ? "bg-blue-200 text-blue-800"
                            : "bg-green-200 text-green-800"
                        }`}
                      >
                        {todo.status}
                      </p>
                      <button
                        onClick={() => updateStatus(todo.id, "doing")}
                        className="py-1 px-2 bg-blue-500 text-white rounded-md"
                      >
                        Mark as Doing
                      </button>
                      <button
                        onClick={() => updateStatus(todo.id, "completed")}
                        className="py-1 px-2 bg-green-500 text-white rounded-md"
                      >
                        Mark as Completed
                      </button>
                      <button
                        onClick={() => deleteTodo(todo.id)}
                        className="py-1 px-2 bg-red-500 text-white rounded-md"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="w-1/2 pl-4">
          <h2 className="text-2xl font-bold mb-4">Add New Todo</h2>
          <form
            onSubmit={addTodo}
            className="bg-white p-6 shadow-md rounded-md"
          >
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
        </div>
      </main>
    </div>
  );
};

export default Home;
