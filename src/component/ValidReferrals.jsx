import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';

const formatUsername = (username) => {
  if (username.length <= 4) {
    return username.charAt(0) + '***' + username.slice(-1);
  } else {
    return username.substring(0, 2) + '***' + username.substring(username.length - 2);
  }
};

export default function ValidReferrals({ data }) {
  const activeUsers = data?.activeUsersBetDeposit || [];

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4 text-center">Valid Referrals</h2>
      <div className="space-y-2">
        {activeUsers.length > 0 ? (
          activeUsers.map((user, index) => (
            <div key={index} className="flex items-center p-2 bg-white rounded border">
              <FaCheckCircle className="text-green-500 mr-2" />
              <span>{formatUsername(user.username)}</span>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 py-4">No valid referrals found</div>
        )}
      </div>
    </div>
  );
}
