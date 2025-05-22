# Patient Registration App

A modern, browser-based patient registration system built with React and PGlite. This project demonstrates how to build a robust frontend-only application with database capabilities and real-time synchronization.

## Features

- **Simple Patient Registration**: Add patients with basic details like name, age, and gender
- **Smart Registration Numbers**: Auto-generates unique registration IDs (RXXXXXX format) for each patient
- **Data Persistence**: Your data stays safe even after browser refreshes
- **Multi-tab Support**: Work seamlessly across different browser tabs with real-time updates
- **SQL Query Interface**: Run custom SQL queries to explore your data

## Getting Started

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage Guide

### Adding a Patient
1. Fill in the patient's name, age, and gender
2. Click "Add Patient"
3. A unique registration number is automatically assigned

### Running SQL Queries
- Use the SQL query box at the bottom of the page
- Example queries:
  ```sql
  SELECT * FROM patients;
  SELECT * FROM patients WHERE age > 50;
  ```

### Multi-tab Features
- Open the app in multiple tabs
- Changes in one tab instantly reflect in others
- Perfect for medical staff working on different screens

## Technical Highlights

- **Frontend-Only Architecture**: No backend needed - everything runs in the browser
- **PGlite Integration**: SQL database running entirely in the browser
- **Real-time Sync**: Using BroadcastChannel API for tab synchronization
- **Data Integrity**: Robust error handling and data validation
- **Modern React Practices**: Hooks, functional components, and clean architecture

## Development Challenges & Solutions

1. **Challenge**: Implementing reliable multi-tab synchronization
   - Solution: Used BroadcastChannel API with careful state management
   - Result: Seamless real-time updates across tabs

2. **Challenge**: Ensuring data persistence
   - Solution: Leveraged PGlite's IndexedDB integration
   - Result: Reliable data storage without backend dependencies

3. **Challenge**: Registration number generation
   - Solution: Implemented unique ID generation with custom formatting
   - Result: Human-readable, unique patient identifiers

## Future Improvements

- Add search functionality
- Implement sorting in patient table
- Add patient history tracking
- Export data functionality

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

## Project Status

This project was developed as part of a technical assessment for Medblocks. It demonstrates implementation of a frontend-only patient registration system with focus on data persistence and multi-tab synchronization.

