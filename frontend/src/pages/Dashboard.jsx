import React from 'react';
import { Link } from 'react-router-dom';

function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-6">
      <h1 className="text-3xl font-bold text-gray-700 mb-8">RBAC Dashboard</h1>
      <div className="space-x-4">
        <Link
          to="/users"
          className="px-6 py-3 bg-blue-500 text-white rounded shadow hover:bg-blue-600 transition"
        >
          Manage Users
        </Link>
        <Link
          to="/roles"
          className="px-6 py-3 bg-green-500 text-white rounded shadow hover:bg-green-600 transition"
        >
          Manage Roles
        </Link>
        <Link
          to="/permissions"
          className="px-6 py-3 bg-purple-500 text-white rounded shadow hover:bg-purple-600 transition"
        >
          Manage Permissions
        </Link>
      </div>
    </div>
  );
}

export default Dashboard;
