import React, { useState, useEffect } from "react";

const BASE_URL = "http://localhost:5000/api";

const PermissionManagement = () => {
  const [permissions, setPermissions] = useState([]);
  const [roles, setRoles] = useState([]);
  const [newPermission, setNewPermission] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch permissions and roles on load
    Promise.all([
      fetch(`${BASE_URL}/permissions`).then((res) => res.json()),
      fetch(`${BASE_URL}/roles`).then((res) => res.json()),
    ])
      .then(([permissionsData, rolesData]) => {
        setPermissions(
          permissionsData.map((perm) => ({
            ...perm,
            actions: perm.actions || { read: false, write: false, delete: false },
          }))
        );
        setRoles(
          rolesData.map((role) => ({
            ...role,
            permissions:
              role.permissions?.map((perm) => ({
                ...perm,
                actions: perm.actions || { read: false, write: false, delete: false },
              })) || [],
          }))
        );
      })
      .catch((err) => setError(err.message));
  }, []);

  const addPermission = () => {
    if (!newPermission.trim()) {
      alert("Permission name cannot be empty!");
      return;
    }

    const newPerm = { name: newPermission, actions: { read: false, write: false, delete: false } };

    fetch(`${BASE_URL}/permissions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPerm),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to add permission");
        return res.json();
      })
      .then((createdPermission) => {
        setPermissions([...permissions, createdPermission]);
        setNewPermission("");
      })
      .catch((err) => setError(err.message));
  };

  const togglePermissionAction = async (permissionId, action) => {
    try {
      const updatedPermissions = permissions.map((perm) => {
        if (perm.id === permissionId) {
          return {
            ...perm,
            actions: { ...perm.actions, [action]: !perm.actions[action] },
          };
        }
        return perm;
      });
  
      setPermissions(updatedPermissions);
  
      const updatedPermission = updatedPermissions.find((perm) => perm.id === permissionId);
      const response = await fetch(`${BASE_URL}/permissions/${permissionId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedPermission),
      });
  
      if (!response.ok) throw new Error("Failed to update permission");
    } catch (error) {
      setError(error.message);
    }
  };
  

  const toggleRolePermissionAction = (roleId, permissionId, action) => {
    const updatedRoles = roles.map((role) => {
      if (role.id === roleId) {
        const updatedPermissions = role.permissions.map((perm) => {
          if (perm.id === permissionId) {
            return {
              ...perm,
              actions: {
                ...perm.actions,
                [action]: !perm.actions[action],
              },
            };
          }
          return perm;
        });
        return { ...role, permissions: updatedPermissions };
      }
      return role;
    });

    setRoles(updatedRoles);

    const roleToUpdate = updatedRoles.find((role) => role.id === roleId);
    if(roleToUpdate){
    fetch(`${BASE_URL}/roles/${roleId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(roleToUpdate),
    })
    .then((res) => {
      if(!res.ok) throw new Error("Failed to update role");
      return res.json();
      })
    .catch((err) => setError(err.message));
    } else {
      setError("Role is not found");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Permission Management</h2>

      {error && (
        <div className="mb-4 p-4 text-red-700 bg-red-100 border border-red-400 rounded">
          Error: {error}
        </div>
      )}

      {/* Add New Permission */}
      <div className="mb-6 bg-gray-100 p-4 rounded shadow-md">
        <h3 className="text-xl font-semibold mb-4">Add New Permission</h3>
        <div className="flex items-center space-x-4">
          <input
            type="text"
            value={newPermission}
            onChange={(e) => setNewPermission(e.target.value)}
            className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter permission name"
          />
          <button
            onClick={addPermission}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Add
          </button>
        </div>
      </div>

      {/* Manage Permissions */}
      <div className="bg-white p-6 rounded shadow-md">
        <h3 className="text-xl font-semibold mb-4">Manage Permissions</h3>
        {permissions.length > 0 ? (
          <table className="min-w-full table-auto border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-4 py-2 text-left">Permission</th>
                <th className="border px-4 py-2">Read</th>
                <th className="border px-4 py-2">Write</th>
                <th className="border px-4 py-2">Delete</th>
              </tr>
            </thead>
            <tbody>
              {permissions.map((perm) => (
                <tr key={perm.id} className="hover:bg-gray-100">
                  <td className="border px-4 py-2">{perm.name}</td>
                  {["read", "write", "delete"].map((action) => (
                    <td key={`${perm.id}-${action}`} className="border px-4 py-2 text-center">
                      <input
                        type="checkbox"
                        checked={perm.actions?.[action] || false}
                        onChange={() => togglePermissionAction(perm.id, action)}
                        className="form-checkbox h-5 w-5 text-indigo-600"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500">No permissions available.</p>
        )}
      </div>

      {/* Manage Role Permissions */}
      <div className="bg-white p-6 rounded shadow-md mt-6">
        <h3 className="text-xl font-semibold mb-4">Manage Role Permissions</h3>
        {roles.length > 0 ? (
          roles.map((role) => (
            <div key={role.id} className="mb-6">
              <h4 className="text-lg font-semibold mb-2">{role.name}</h4>
              <table className="min-w-full table-auto border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border px-4 py-2 text-left">Permission</th>
                    <th className="border px-4 py-2">Read</th>
                    <th className="border px-4 py-2">Write</th>
                    <th className="border px-4 py-2">Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {permissions.map((perm, permIndex) => (
                    <tr key={perm.id} className="hover:bg-gray-100">
                      <td className="border px-4 py-2">{perm.name}</td>
                      {["read", "write", "delete"].map((action) => (
                        <td key={`${perm.id}-${action}`} className="border px-4 py-2 text-center">
                          <input
                            type="checkbox"
                            checked={
                              role.permissions.some(
                                (p) => p.id === perm.id && p.actions?.[action]
                              )
                            }
                            onChange={() => toggleRolePermissionAction(role.id, perm.id, action)}
                            className="form-checkbox h-5 w-5 text-indigo-600"
                          />
                        </td>
                      ))}
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

export default PermissionManagement;
