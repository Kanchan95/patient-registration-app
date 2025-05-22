import React from 'react';

function PatientTable({ patients, onDelete, currentPage, totalPages, onPageChange, patientsPerPage }) {
  // Function to create a shorter registration number from UUID
  const getShortRegistrationNumber = (uuid) => {
    return 'R' + uuid.slice(0, 6).toUpperCase();
  };

  return (
    <div className="table-container">
      <h2>All Patients</h2>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Registration No</th>
            <th>Name</th>
            <th>Age</th>
            <th>Gender</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient, index) => (
            <tr key={patient.id}>
              <td>{(currentPage - 1) * patientsPerPage + index + 1}</td>
              <td>{getShortRegistrationNumber(patient.id)}</td>
              <td>{patient.name}</td>
              <td>{patient.age}</td>
              <td>{patient.gender}</td>
              <td>
                <button className="delete-btn" onClick={() => onDelete(patient.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {totalPages > 1 && (
        <div className="pagination">
          {currentPage > 1 && (
            <button 
              onClick={() => onPageChange(currentPage - 1)}
              className="page-btn"
            >
              Previous
            </button>
          )}
          
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index + 1}
              onClick={() => onPageChange(index + 1)}
              className={`page-btn ${currentPage === index + 1 ? 'active' : ''}`}
            >
              {index + 1}
            </button>
          ))}
          
          {currentPage < totalPages && (
            <button
              onClick={() => onPageChange(currentPage + 1)}
              className="page-btn"
            >
              Next
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default PatientTable;