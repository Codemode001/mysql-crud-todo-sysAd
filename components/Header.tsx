import React from "react";

const Header = ({
  setMessage,
  userName,
}: {
  setMessage: any;
  userName: string;
}) => {
  const signOut = async () => {
    try {
      localStorage.removeItem("authToken");
      setMessage("You have successfully signed out.");
      window.location.href = "/";
    } catch (error) {
      setMessage("Error occurred during sign-out.");
    }
  };
  return (
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
  );
};

export default Header;
