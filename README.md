# RBAC_UI

# User Management System

This project provides a set of React components and a Node.js backend for managing users, roles, and permissions in your application.

## Project Purpose

This system allows you to:
- Define permissions (e.g., read, write, delete)
- Create roles and assign permissions to them
- Manage users with roles, emails, and phone numbers

## Prerequisites
- Node.js and npm (or yarn) installed

cd your-repository-name
npm install
npm start
## Features

- **User Management**: Create and retrieve user information.
- **Role Management**: Define roles and update their permissions.
- **Permission Management**: Manage permissions (CRUD operations).
- Data persistence through JSON files.



Usage (Components)
These components can be imported and used in your React application:

PermissionManagement.jsx: Manages permissions and assigning them to roles.
RolesManagement.jsx: Manages roles and assigning them permissions.
UserManagement.jsx: Manages users with roles, permissions, emails, and phone numbers.
Each component uses the provided backend API endpoints for data fetching and manipulation.

Backend API Endpoints
GET /users: Get all users
POST /users: Add a new user
GET /roles: Get all roles
POST /roles: Add a new role
GET /permissions: Get all permissions
POST /permissions: Add a new permission
Data Files
permissions.json: Defines an array of permission strings (e.g., "read", "write", "delete").
roles.json: Defines an array of role objects (id, name, permissions).
users.json: Defines an array of user objects (id, name, role, email, phone).
