import React, { useState, useEffect } from "react";

const BASE_URL = "http://localhost:5000/api";

const RolesManagement = () => {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [newRole, setNewRole] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch roles and permissions on component mount
    Promise.all([
      fetch(`${BASE_URL}/roles`).then((res) => res.json()),
      fetch(`${BASE_URL}/permissions`).then((res) => res.json()),
    ])
      .then(([rolesData, permissionsData]) => {
        setRoles(
          rolesData.map((role) => ({
            ...role,
            permissions: role.permissions || [],
          }))
        );
        setPermissions(
          permissionsData.map((perm) => ({
            ...perm,
            actions: perm.actions || { read: false, write: false, delete: false },
          }))
        );
      })
      .catch((err) => setError(err.message));
  }, []);

  const addRole = () => {
    if (!newRole.trim()) {
      alert("Role name cannot be empty!");
      return;
    }

    const newRoleObj = { name: newRole, permissions: [] };

    fetch(`${BASE_URL}/roles`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newRoleObj),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to create role");
        return res.json();
      })
      .then((createdRole) => {
        setRoles([...roles, createdRole]);
        setNewRole("");
      })
      .catch((err) => setError(err.message));
  };

  const toggleRolePermission = (roleId, permissionId) => {
    const updatedRoles = roles.map((role) => {
      if (role.id === roleId) {
        const hasPermission = role.permissions.some((perm) => perm.id === permissionId);
        const updatedPermissions = hasPermission
          ? role.permissions.filter((perm) => perm.id !== permissionId)
          : [
              ...role.permissions,
              { id: permissionId, actions: { read: false, write: false, delete: false } },
            ];
        return { ...role, permissions: updatedPermissions };
      }
      return role;
    });

    setRoles(updatedRoles);

    const roleToUpdate = updatedRoles.find((role) => role.id === roleId);
    // Send a PUT request to update the role with the updated permissions
    fetch(`${BASE_URL}/roles/${roleId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(roleToUpdate),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to update role permissions");
        return res.json();
      })
      .then((updatedRole) => {
        // Optionally, you can update the role in state if needed
        // setRoles((prevRoles) => prevRoles.map(role => role.id === roleId ? updatedRole : role));
      })
      .catch((err) => {
        setError(err.message); // Set the error message on failure
      });
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Roles Management</h2>

      {error && (
        <div className="mb-4 p-4 text-red-700 bg-red-100 border border-red-400 rounded">
          Error: {error}
        </div>
      )}

      {/* Add New Role */}
      <div className="mb-6 bg-gray-100 p-4 rounded shadow-md">
        <h3 className="text-xl font-semibold mb-4">Add New Role</h3>
        <div className="flex items-center space-x-4">
          <input
            type="text"
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
            className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter role name"
          />
          <button
            onClick={addRole}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Add
          </button>
        </div>
      </div>

      {/* Manage Roles */}
      <div className="bg-white p-6 rounded shadow-md">
        <h3 className="text-xl font-semibold mb-4">Manage Roles</h3>
        {roles.length > 0 ? (
          roles.map((role, roleIndex) => (
            <div key={`role-${roleIndex}`} className="mb-6">
              <h4 className="text-lg font-semibold mb-2">{role.name}</h4>
              <table className="min-w-full table-auto border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border px-4 py-2 text-left">Permission</th>
                    <th className="border px-4 py-2">Assigned</th>
                  </tr>
                </thead>
                <tbody>
                  {permissions.map((perm, permIndex) => (
                    <tr key={`role-${roleIndex}-perm-${permIndex}`} className="hover:bg-gray-100">
                      <td className="border px-4 py-2">{perm.name}</td>
                      <td className="border px-4 py-2 text-center">
                        <input
                          type="checkbox"
                          checked={role.permissions.some((p) => p.id === perm.id)}
                          onChange={() => toggleRolePermission(role.id, perm.id)}
                          className="form-checkbox h-5 w-5 text-indigo-600"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No roles available.</p>
        )}
      </div>
    </div>
  );
};

export default RolesManagement;
