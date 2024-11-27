import React, { useState, useEffect } from "react";

const BASE_URL = "http://localhost:5000/api";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [newUser, setNewUser] = useState({ name: "", role: "", email: "", phone: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch data for users and roles
    const fetchData = async () => {
      try {
        const usersResponse = await fetch(`${BASE_URL}/users`);
        const rolesResponse = await fetch(`${BASE_URL}/roles`);

        if (!usersResponse.ok || !rolesResponse.ok) {
          throw new Error("Failed to fetch data from server");
        }

        const usersData = await usersResponse.json();
        const rolesData = await rolesResponse.json();

        setUsers(usersData);
        setRoles(rolesData);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchData();
  }, []);

  const handleAddUser = async () => {
    if (!newUser.name || !newUser.role) {
      alert("Name and Role are required");
      return;
    }
  
    try {
      const response = await fetch(`${BASE_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newUser.name,
          role: newUser.role,
          email: newUser.email || null,
          phone: newUser.phone || null,
        }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to add user");
      }
  
      const createdUser = await response.json();
      setUsers((prev) => [...prev, createdUser]);
      setNewUser({ name: "", role: "", email: "", phone: "" }); // Reset form
    } catch (err) {
      setError(err.message);
    }
  };
  

  return (
    <div className="container mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-extrabold text-gray-800">User Management</h1>

      {error && (
        <div className="text-red-600 bg-red-100 border border-red-300 p-4 rounded">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* User List */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold text-gray-700 border-b pb-2 mb-4">
          Users
        </h2>
        {users.length > 0 ? (
          <table className="min-w-full table-auto border-collapse border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2 text-left">Name</th>
                <th className="border px-4 py-2 text-left">Role</th>
                <th className="border px-4 py-2 text-left">Permissions</th>
                <th className="border px-4 py-2 text-left">Email</th>
                <th className="border px-4 py-2 text-left">Phone</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50 even:bg-gray-50 odd:bg-white"
                >
                  <td className="border px-4 py-2">{user.name}</td>
                  <td className="border px-4 py-2">{user.role}</td>
                  <td className="border px-4 py-2">
                    {user.permissions && Array.isArray(user.permissions)
                      ? user.permissions.join(", ")
                      : "None"}
                  </td>
                  <td className="border px-4 py-2">{user.email || "N/A"}</td>
                  <td className="border px-4 py-2">{user.phone || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-600">No users available.</p>
        )}
      </div>

      {/* Add User Form */}
      <div className="bg-gray-50 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold text-gray-700 border-b pb-2 mb-4">
          Add New User
        </h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAddUser();
          }}
          className="space-y-6"
        >
          <div>
            <label className="block text-sm font-medium text-gray-600">Name</label>
            <input
              type="text"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:ring focus:ring-indigo-300"
              placeholder="Enter name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">Role</label>
            <select
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:ring focus:ring-indigo-300"
              required
            >
              <option value="">Select a role</option>
              {roles.map((role) =>
                typeof role === "string" ? (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ) : (
                  <option key={role.id} value={role.name}>
                    {role.name}
                  </option>
                )
              )}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">Email</label>
            <input
              type="email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:ring focus:ring-indigo-300"
              placeholder="Enter email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">Phone</label>
            <input
              type="tel"
              value={newUser.phone}
              onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:ring focus:ring-indigo-300"
              placeholder="Enter phone number"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring focus:ring-indigo-300"
          >
            Add User
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserManagement;
