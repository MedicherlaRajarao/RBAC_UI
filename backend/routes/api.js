const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// File paths
const usersFilePath = path.join(__dirname, '../data/users.json');
const rolesFilePath = path.join(__dirname, '../data/roles.json');
const permissionsFilePath = path.join(__dirname, '../data/permissions.json');

// Load data
let users = require(usersFilePath);
let roles = require(rolesFilePath);
let permissions = require(permissionsFilePath);

// Helper function to write data back to JSON files
const writeToFile = (filePath, data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
};

// User routes
router.get('/users', (req, res) => res.json(users));

router.post('/users', (req, res) => {
  const newUser = { id: users.length + 1, ...req.body };
  users.push(newUser);
  writeToFile(usersFilePath, users); // Persist data to file
  res.status(201).json(newUser);
});

// Role routes
router.get('/roles', (req, res) => res.json(roles));

router.post('/roles', (req, res) => {
  const newRole = { id: roles.length + 1, ...req.body };
  roles.push(newRole);
  writeToFile(rolesFilePath, roles); // Persist data to file
  res.status(201).json(newRole);
});

// Permissions routes
router.get('/permissions', (req, res) => res.json(permissions));

router.post('/permissions', (req, res) => {
  const newPermission = { id: permissions.length + 1, ...req.body };
  permissions.push(newPermission);
  writeToFile(permissionsFilePath, permissions); // Persist data to file
  res.status(201).json(newPermission);
});

router.put('/permissions/:id', (req, res) => {
  const { id } = req.params;
  const permissionIndex = permissions.findIndex((p) => p.id == id);

  if (permissionIndex === -1) {
    return res.status(404).json({ message: 'Permission not found' });
  }

  const updatedPermission = { ...permissions[permissionIndex], ...req.body };
  permissions[permissionIndex] = updatedPermission;
  writeToFile(permissionsFilePath, permissions); // Persist data to file

  res.json(updatedPermission);
});

router.delete('/permissions/:id', (req, res) => {
  const { id } = req.params;
  const permissionIndex = permissions.findIndex((p) => p.id == id);

  if (permissionIndex === -1) {
    return res.status(404).json({ message: 'Permission not found' });
  }

  const deletedPermission = permissions.splice(permissionIndex, 1);
  writeToFile(permissionsFilePath, permissions); // Persist data to file

  res.json(deletedPermission[0]);
});

// Update role's permissions
router.put('/roles/:roleId', (req, res) => {
  const { roleId } = req.params;
  const roleIndex = roles.findIndex((r) => r.id == roleId);

  if (roleIndex === -1) {
    return res.status(404).json({ message: 'Role not found' });
  }

  const updatedRole = { ...roles[roleIndex], ...req.body };
  roles[roleIndex] = updatedRole;
  writeToFile(rolesFilePath, roles); // Persist data to file

  res.json(updatedRole);
});

module.exports = router;
