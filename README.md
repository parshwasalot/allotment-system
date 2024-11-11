# Seminar Hall Allotment System

A comprehensive system for managing seminar hall bookings and events. This repository contains both the frontend and backend of the project. The system supports three types of users: Students, Faculty, and Admins, each with their own dashboard and set of permissions.

# Build the image
docker build -t seminar-hall-system .

# Run the container
docker run -p 5000:5000 -p 27017:27017 seminar-hall-system
