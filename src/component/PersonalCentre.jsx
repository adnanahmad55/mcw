
import { useState } from "react";

const PersonalCentre = () => {
  const menuItems = [
    "My Account",
    "Deposit",
    "Withdrawal",
    "Betting Record",
    "Cashback",
    "Account Record",
    "Profit And Loss",
    "Reward Center",
    "Invite Friends",
    "Internal Message",
  ];

  return (
    <div className="w-64 bg-blue-700 text-white min-h-screen">
      <h2 className="text-xl font-bold p-4 border-b border-blue-500">
        Personal Center
      </h2>
      <ul className="space-y-1">
        {menuItems.map((item, idx) => (
          <li
            key={idx}
            className={`px-4 py-2 hover:bg-blue-600 cursor-pointer ${
              item === "Deposit" ? "bg-blue-600" : ""
            }`}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PersonalCentre;
