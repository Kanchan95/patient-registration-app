import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

function PatientForm({ onAdd }) {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !age || !gender) return;

    const newPatient = {
      id: uuidv4(),
      name: name.trim(),
      age: parseInt(age),
      gender: gender
    };

    onAdd(newPatient);
    setName('');
    setAge('');
    setGender('');
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h2>Register New Patient</h2>
      <div className="form-row">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Age"
          min="1"
          max="149"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          required
        />
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          required
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        <button type="submit">Add Patient</button>
      </div>
    </form>
  );
}

export default PatientForm;