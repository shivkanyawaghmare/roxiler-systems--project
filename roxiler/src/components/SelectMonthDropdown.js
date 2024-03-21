//SelectMonthDropdown.js
import React from 'react';

const SelectMonthDropdown = ({ selectedMonth, handleMonthChange ,fetchNextTransactions}) => {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const handleChange = (e) => {
    handleMonthChange(e);
    fetchNextTransactions(); // Call the fetchNextTransactions callback after updating the selected month
  };
  return (
    <div className='select-month'>
      <label htmlFor="selectMonth">Select Month : </label>
      <select id="selectMonth" value={selectedMonth} onChange={handleMonthChange}>
        {months.map((month, index) => (
          <option key={index} value={month}>{month}</option>
        ))}
      </select>
    </div>
  );
}

export default SelectMonthDropdown;
