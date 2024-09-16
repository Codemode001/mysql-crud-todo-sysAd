import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Header from "@/components/Header";
import CurrentTodos from "@/components/CurrentTodos";
import { todo } from "node:test";
import NewTodo from "@/components/NewTodo";

const Home = () => {
  const router = useRouter();
  const [todos, setTodos] = useState<any[]>([]);
  const { userId } = router.query;
  const [userName, setUserName] = useState("");
  const [message, setMessage] = useState("");
  const userIdInt =
    typeof userId === "string" ? parseInt(userId, 10) : undefined;

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

  useEffect(() => {
    if (userIdInt) {
      fetchUsers(userIdInt);
      fetchTodos(userIdInt);
    }
  }, [userIdInt]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header setMessage={setMessage} userName={userName} />
      <main className="flex flex-1 p-6">
        <CurrentTodos
          fetchTodos={fetchTodos}
          todos={todos}
          userIdInt={userIdInt}
        />
        <NewTodo
          fetchTodos={fetchTodos}
          message={message}
          setMessage={setMessage}
          setTodos={setTodos}
          userIdInt={userIdInt}
        />
      </main>
    </div>
  );
};

export default Home;
