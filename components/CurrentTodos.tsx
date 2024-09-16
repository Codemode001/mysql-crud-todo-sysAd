import React from "react";
import axios from "axios";

const CurrentTodos = ({
  userIdInt,
  fetchTodos,
  todos,
}: {
  userIdInt: any;
  fetchTodos: any;
  todos: any;
}) => {
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

  return (
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
  );
};

export default CurrentTodos;
