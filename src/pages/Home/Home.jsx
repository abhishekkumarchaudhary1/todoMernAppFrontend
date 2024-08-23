import React from "react";
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <header className="w-full bg-blue-600 py-4">
        <h1 className="text-center text-white text-3xl font-bold">
          Welcome to My MERN TO-DO App
        </h1>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center">
        <h2 className="text-2xl text-center font-semibold text-gray-800">
          Build Amazing Web Applications
        </h2>
        <p className="text-gray-600 mt-4 max-w-xl text-center">
          This is a full-stack MERN TO-DO application built with MongoDB, Express, React, and Node.js. Explore the features and functionalities that make this app awesome!
        </p>
        <button className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        onClick={()=> navigate('/register')}
        >
          Get Started
        </button>
      </main>
    </div>
  );
};

export default Home;
