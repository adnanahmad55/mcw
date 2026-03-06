import React from 'react';
import { FaTimesCircle } from 'react-icons/fa';

const formatUsername = (username) => {
  if (username.length <= 4) {
    return username.charAt(0) + '***' + username.slice(-1);
  } else {
    return username.substring(0, 2) + '***' + username.substring(username.length - 2);
  }
};

export default function InvalidReferrals({ data }) {
  const inactiveUsers = data?.inactiveUsersBetDeposit || [];

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4 text-center">Invalid Referrals</h2>
      <div className="space-y-2">
        {inactiveUsers.length > 0 ? (
          inactiveUsers.map((user, index) => (
            <div key={index} className="flex items-center p-2 bg-white rounded border">
              <FaTimesCircle className="text-red-500 mr-2" />
              <span>{formatUsername(user.username)}</span>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 py-4">No invalid referrals found</div>
        )}
      </div>
    </div>
  );
}
