import React from 'react';

function UserTable() {
  const users = [
    { id: 1, name: 'Alice', role: 'Admin', status: 'Active' },
    { id: 2, name: 'Bob', role: 'Editor', status: 'Inactive' },
    { id: 3, name: 'Charlie', role: 'Viewer', status: 'Active' },
  ];

  return (
    <table className="table-auto w-full border-collapse border border-gray-300">
      <thead>
        <tr>
          <th className="border border-gray-300 px-4 py-2">ID</th>
          <th className="border border-gray-300 px-4 py-2">Name</th>
          <th className="border border-gray-300 px-4 py-2">Role</th>
          <th className="border border-gray-300 px-4 py-2">Status</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id}>
            <td className="border border-gray-300 px-4 py-2">{user.id}</td>
            <td className="border border-gray-300 px-4 py-2">{user.name}</td>
            <td className="border border-gray-300 px-4 py-2">{user.role}</td>
            <td className="border border-gray-300 px-4 py-2">{user.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default UserTable;
