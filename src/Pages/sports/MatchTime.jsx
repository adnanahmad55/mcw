// MatchTime.js
import React from "react";

const MatchTime = ({ startTime }) => {
  if (!startTime) return null;

  const timeString = new Date(startTime).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  return <span>{timeString}</span>;
};

export default MatchTime;
