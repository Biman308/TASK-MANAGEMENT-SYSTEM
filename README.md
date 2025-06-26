![Screenshot (146)](https://github.com/user-attachments/assets/79676302-3e37-4684-a13b-51996de85cd5)
![Screenshot (147)](https://github.com/user-attachments/assets/80b874ef-c6eb-40dc-83ab-9d70da4853f3)
![Screenshot (148)](https://github.com/user-attachments/assets/a042e0f4-abec-4b77-a30b-a3b7c03540f2)
![Screenshot (149)](https://github.com/user-attachments/assets/3ad2b2d8-20dd-4696-a693-79acbea22a8b)
# Task Management System — Full Project Specification


# Overview

- Simplified Trello-like task management system  
- Next.js frontend with React, Tailwind CSS  
- Node.js + Express backend  
- MongoDB for data storage  
- Request/response encryption & decryption using CryptoJS (AES)  
- Role-based access: Admin and User  
- Real-time one-to-one chat (User <-> Admin) via Socket.io  
- Email notification to Admin when User updates a task (via Nodemailer)  
- JWT-based authentication with middleware  
- Supports Login, Signup, Task CRUD (according to role), Task status tracking  
- Bonus: Drag & drop to update task status  
- State management with Redux Toolkit or React Context API  

# Frontend (Next.js & React)

## Pages:
- **Login Page**  
  - Email + Password fields  
  - Simulate authentication with backend login API  
  - Store JWT token, userId and role in Context or Redux  

- **Dashboard Page**  
  - Shows task columns: To Do, In Progress, Completed  
  - Displays tasks with title, description, due date  
  - Create Task Modal (Admin only)  
    - Title, Description, Status (dropdown), Due Date, Assigned To (user)  
  - Edit Task Modal  
    - Admins can edit all fields  
    - Users can only update status  
  - Drag & Drop tasks between columns to update status (Bonus)  
  - Real-time chat embedded (one-to-one user-admin chat)  

## Functionality:
- Encrypt all API requests and decrypt responses with CryptoJS AES  
- Use JWT token for authorization headers  
- Manage auth state & tasks state with Context API  
- Tailwind CSS for styling  

# Backend (Node.js + Express)

## Models:
- **User:** email, password (hashed), role ("admin" or "user"), age (optional)  
- **Task:** title, description, status ("todo", "inprogress", "completed"), dueDate, assignedTo (User ref), createdBy (User ref)  
- **Chat:** sender (User ref), receiver (User ref), message, timestamp  

## Endpoints:
- POST /api/auth/signup — create user (email, password, age), encrypt/decrypt data  
- POST /api/auth/login — login, return JWT token, encrypt/decrypt data  
- GET /api/tasks — list tasks, user gets own tasks, admin gets all  
- POST /api/tasks — create task (Admin only)  
- PUT /api/tasks/:id — update task (Admin or assigned User)  
- DELETE /api/tasks/:id — delete task (Admin only)  
- GET /api/chat/conversation — get chat messages between logged-in user and their counterpart  
- POST /api/chat/send — send message  
- GET /api/users — (Admin only) get all users for assigning tasks  

## Other:
- JWT Authentication middleware for all protected routes  
- Encrypt/decrypt request bodies and response bodies with CryptoJS AES  
- Nodemailer setup to notify Admin when User updates a task  
- MongoDB + Mongoose for data persistence  
- Socket.io setup for real-time chat  
