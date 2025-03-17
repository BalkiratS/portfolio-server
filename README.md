# Portfolio Website - Backend Server (MERN Stack)

## Description
This repository contains the backend API code for my personal portfolio website. It provides RESTful endpoints for accessing and managing resume, skills, and project data. The API is built with Express and MongoDB and connects to a React Frontend for a dynamic and interactive user experience.

## Technologies
- Backend: Node.js, Express, MongoDB
- Frontend (separate repository): React, HTML, CSS, JavaScript
- Deployment: Vercel
- Authentication: JWT tokens

 ## Features
 - RESTful API for CRUD operations on resume, skills, and project data
 - Secure auth middleware using JWT tokens for admin access only
 - Integration with React frontend for data transfer and updates
 - Deployment on Vercel

## Getting Started:
1. Clone this repository.
2. Make sure you have Node.js and npm installed.
3. Run ````npm install```` to install all dependencies.
4. Configure environment variables:
    - AWS credentials (if applicable)
    - MongoDB connection string
    - JWT secret key
5. Run ````npm start```` to start the server.

## API Endpoints
- ````\resume````: GET, POST
- ````\skills````: GET, POST, PATCH, DELETE
- ````\projects````: GET, POST, PATCH, DELETE
- ````\message````: POST
- ````\login````: POST

## Deployment
This API is deployed on AWS. Specific instructions for deployment vary depending on your chosen services and configuration. Please refer to separate documentation or scripts for deployment steps.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
