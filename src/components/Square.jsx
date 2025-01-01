import React from "react";

const Square = ({ value, onClick }) => {
  return (
    <button
      className={`border border-gray-400 text-2xl font-bold rounded-md h-16 w-16 flex items-center justify-center ${
        value == "X" ? "text-violet-500" : "text-red-400"
      }`}
      onClick={onClick}
    >
      {value}
    </button>
  );
};

export default Square;
