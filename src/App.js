import React, { useEffect, useState, useRef, useCallback } from 'react';
import { PGlite } from '@electric-sql/pglite';
import PatientForm from './components/PatientForm';
import PatientTable from './components/PatientTable';
import SQLQuery from './components/SQLQuery';
import './styles.css';

function App() {
  const dbRef = useRef(null);
  const [patients, setPatients] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [patientsPerPage] = useState(10);
  const broadcastChannelRef = useRef(null);
  const [isDbReady, setIsDbReady] = useState(false);

  // Memoize fetchPatients to prevent infinite loops
  const fetchPatients = useCallback(async () => {
    if (!dbRef.current || !isDbReady) return;
    
    try {
      const result = await dbRef.current.query('SELECT * FROM patients ORDER BY created_at ASC');
      setPatients(result.rows);
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  }, [isDbReady]);

  useEffect(() => {
    const setupDB = async () => {
      try {
        // Create a new database connection
        dbRef.current = await PGlite.create({
          dataDir: 'idb://patients-db'
        });

        await dbRef.current.exec(`
          CREATE TABLE IF NOT EXISTS patients (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            age INTEGER CHECK(age > 0 AND age < 150),
            gender TEXT CHECK(gender IN ('Male', 'Female', 'Other')) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );
        `);

        setIsDbReady(true);
        await fetchPatients();

        // Setup broadcast channel for multi-tab sync
        broadcastChannelRef.current = new BroadcastChannel('patient-sync');
        broadcastChannelRef.current.onmessage = async (event) => {
          if (event.data === 'sync') {
            // Recreate database connection on sync
            dbRef.current = await PGlite.create({
              dataDir: 'idb://patients-db'
            });
            await fetchPatients();
          }
        };
      } catch (error) {
        console.error('Error setting up database:', error);
      }
    };

    setupDB();

    // Cleanup function
    return () => {
      if (broadcastChannelRef.current) {
        broadcastChannelRef.current.close();
      }
    };
  }, [fetchPatients]);

  const broadcastChange = () => {
    if (broadcastChannelRef.current) {
      broadcastChannelRef.current.postMessage('sync');
    }
  };

  const addPatient = async (patient) => {
    if (!dbRef.current || !isDbReady) return;

    try {
      // Capitalize the name before inserting
      const capitalizedName = patient.name
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');

      await dbRef.current.exec(`
        INSERT INTO patients (id, name, age, gender, created_at)
        VALUES ('${patient.id}', '${capitalizedName}', ${patient.age}, '${patient.gender}', CURRENT_TIMESTAMP);
      `);
      
      // Fetch updated data immediately
      await fetchPatients();
      broadcastChange();
      
    } catch (error) {
      console.error('Error adding patient:', error);
      alert('Error: Invalid data. Please check the values and try again.');
    }
  };

  const deletePatient = async (id) => {
    if (!dbRef.current || !isDbReady) return;

    const confirmDelete = window.confirm('Are you sure you want to delete this patient?');
    if (!confirmDelete) return;

    try {
      await dbRef.current.exec(`DELETE FROM patients WHERE id = '${id}';`);
      
      // Fetch updated data immediately
      await fetchPatients();
      broadcastChange();

      // Adjust current page if necessary after deletion
      const maxPage = Math.ceil((patients.length - 1) / patientsPerPage);
      if (currentPage > maxPage) {
        setCurrentPage(Math.max(1, maxPage));
      }
    } catch (error) {
      console.error('Error deleting patient:', error);
      alert('Failed to delete patient.');
    }
  };

  // Get current patients for pagination
  const indexOfLastPatient = currentPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  const currentPatients = patients.slice(indexOfFirstPatient, indexOfLastPatient);
  const totalPages = Math.ceil(patients.length / patientsPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container">
      <h1>Patient Records</h1>
      <PatientForm onAdd={addPatient} />
      <PatientTable 
        patients={currentPatients}
        onDelete={deletePatient}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={paginate}
        patientsPerPage={patientsPerPage}
      />
      <SQLQuery db={dbRef.current} />
    </div>
  );
}

export default App;