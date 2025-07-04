// components/common/Notification.js
import React from 'react';

const Notification = ({ show, message }) => {
  if (!show) return null;

  return (
    <div className="fixed top-4 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg z-50 animate-slide-in">
      <p className="text-sm font-medium text-center md:text-left">{message}</p>
    </div>
  );
};

export default Notification;
