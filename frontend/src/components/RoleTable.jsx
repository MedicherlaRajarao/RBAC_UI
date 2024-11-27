import React, { useEffect, useState } from 'react';

const BASE_URL = 'http://localhost:5000/api';

function RoleTable() {
  const [roles, setRoles] = useState([]); // The `roles` variable is managed here.

  useEffect(() => {
    // Fetch roles dynamically from the backend.
    fetch(`${BASE_URL}/roles`)
      .then((response) => response.json())
      .then((data) => setRoles(data))
      .catch((error) => console.error('Error fetching roles:', error));
  }, []);

  // Make sure the `roles` variable is used in the JSX below.
  return (
    <table className="table-auto w-full border-collapse border border-gray-300">
      <thead>
        <tr>
          <th className="border border-gray-300 px-4 py-2">ID</th>
          <th className="border border-gray-300 px-4 py-2">Role Name</th>
          <th className="border border-gray-300 px-4 py-2">Permissions</th>
        </tr>
      </thead>
      <tbody>
        {roles.map((role) => (
          <tr key={role.id}>
            <td className="border border-gray-300 px-4 py-2">{role.id}</td>
            <td className="border border-gray-300 px-4 py-2">{role.name}</td>
            <td className="border border-gray-300 px-4 py-2">{role.permissions.join(', ')}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default RoleTable;
