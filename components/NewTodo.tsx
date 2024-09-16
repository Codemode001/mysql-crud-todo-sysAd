import React, { useState, useEffect } from "react";
import axios from "axios";

const NewTodo = ({
  userIdInt,
  setTodos,
  fetchTodos,
  setMessage,
  message,
}: {
  userIdInt: any;
  setTodos: any;
  fetchTodos: any;
  setMessage: any;
  message: any;
}) => {
  const [task, setTask] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("medium");

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

  return (
    <div className="w-1/2 pl-4">
      <h2 className="text-2xl font-bold mb-4">Add New Todo</h2>
      <form onSubmit={addTodo} className="bg-white p-6 shadow-md rounded-md">
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
  );
};

export default NewTodo;
