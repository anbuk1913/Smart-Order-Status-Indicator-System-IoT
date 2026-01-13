import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { tablesAPI } from '../services/api';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [deviceOnline, setDeviceOnline] = useState(false);
  const [checking, setChecking] = useState(false);

  const checkDeviceStatus = async () => {
    setChecking(true);
    try {
      const response = await tablesAPI.getDeviceStatus();
      setDeviceOnline(response.data.online);
    } catch (error) {
      setDeviceOnline(false);
    }
    setChecking(false);
  };

  useEffect(() => {
    checkDeviceStatus();
    const interval = setInterval(checkDeviceStatus, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, []);

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                IoT Order System
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Device Status */}
            <div className="hidden sm:flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${deviceOnline ? 'bg-green-500' : 'bg-red-500'} ${checking ? 'animate-pulse' : ''}`}></div>
              <span className="text-sm text-gray-700">
                ESP8266: {deviceOnline ? 'Online' : 'Offline'}
              </span>
            </div>

            {/* User Info */}
            <div className="flex items-center space-x-3">
              <div className="hidden md:block">
                <p className="text-sm font-medium text-gray-700">Chef: {user?.username}</p>
              </div>
              <button
                onClick={logout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;