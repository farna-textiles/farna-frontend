import React from 'react';
import { useNavigate } from 'react-router';

const WelcomeScreen: React.FC = () => {
  const naviagte = useNavigate();
  return (
    <div className="bg-blue-500 h-screen flex flex-col justify-center items-center">
      <h1 className="text-4xl font-extrabold text-white mb-4">
        Welcome to Farna Textiles CRM
      </h1>
      <p className="text-lg text-gray-200 mb-8">
        Your textile management solution
      </p>
      <button
        type="button"
        onClick={() => naviagte('/orders')}
        className="bg-white text-blue-500 hover:bg-blue-200 text-lg font-semibold py-2 px-4 rounded-full shadow-md transition duration-300"
      >
        Get Started
      </button>
    </div>
  );
};

export default WelcomeScreen;
