import React, { useState } from 'react';

const getShortRegistrationNumber = (uuid) => {
  return 'R' + uuid.slice(0, 6).toUpperCase();
};

const formatValue = (value) => {
  if (value instanceof Date) {
    return value.toLocaleString();
  }
  if (value === null || value === undefined) {
    return '';
  }
  // Format the registration number exactly like PatientTable
  if (typeof value === 'string' && value.length === 36) { // UUID length
    return getShortRegistrationNumber(value);
  }
  return value;
};

function SQLQuery({ db }) {
  const [sqlQuery, setSqlQuery] = useState('');
  const [queryResult, setQueryResult] = useState([]);

  const handleRunQuery = async () => {
    if (!sqlQuery.trim()) {
      alert("Please enter a SQL query.");
      return;
    }

    try {
      const result = await db.query(sqlQuery);
      // Format the results before setting state
      const formattedResults = result.rows.map(row => {
        const formattedRow = {};
        for (const key in row) {
          // Skip created_at column and rename id to registration_number
          if (key !== 'created_at') {
            const displayKey = key === 'id' ? 'registration_number' : key;
            formattedRow[displayKey] = formatValue(row[key]);
          }
        }
        return formattedRow;
      });
      setQueryResult(formattedResults);
    } catch (error) {
      alert("Invalid SQL query or error:\n" + error.message);
      setQueryResult([]);
    }
  };

  return (
    <div>
      <h2>Run Raw SQL Query</h2>
      <textarea
        rows="3"
        cols="60"
        placeholder=" Enter SQL (e.g. SELECT * FROM patients) "
        value={sqlQuery}
        onChange={(e) => setSqlQuery(e.target.value)}
        style={{ display: 'block', marginBottom: 10 }}
      />
      <button onClick={handleRunQuery}>Run Query</button>

      {queryResult.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <h3>Query Result</h3>
          <table border="1" cellPadding="8">
            <thead>
              <tr>
                {Object.keys(queryResult[0]).map((key) => (
                  <th key={key}>{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {queryResult.map((row, index) => (
                <tr key={index}>
                  {Object.values(row).map((val, i) => (
                    <td key={i}>{val}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default SQLQuery;