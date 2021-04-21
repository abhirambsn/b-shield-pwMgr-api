# Password Manager API (B-Shield)

> Author: Bhallamudi Sai Narasimha Abhiram
> Date: 21st April 2020

## API Routes

### User and Auth
    - POST: /api/user/login
    - POST: /api/user/register
    - GET: /api/user/profile
    - PUT: /api/user/changePassword

### Password Manager
    - GET, POST: /api/password
    - GET, PUT, DELETE: /api/password/:password_id

## .env CONFIG vars
    - MONGO_URI
    - PORT
    - JWT_SECRET
