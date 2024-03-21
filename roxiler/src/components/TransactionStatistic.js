import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TransactionDashboard = () => {
  const [selectedMonth, setSelectedMonth] = useState('March'); // Initialize selected month state
  const [totalSaleAmount, setTotalSaleAmount] = useState(0); // Initialize state variables for statistics
  const [totalSoldItems, setTotalSoldItems] = useState(0);
  const [totalNotSoldItems, setTotalNotSoldItems] = useState(0);

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        // Convert selected month string into date format
        const selectedDate = new Date(selectedMonth + ' 1, 2022'); // Assume year is 2022 for simplicity
        const formattedDate = selectedDate.toISOString().split('T')[0];

        const response = await axios.get(`http://localhost:8002/api/statistics?month=${formattedDate}`);
        setTotalSaleAmount(response.data.totalSaleAmount);
        setTotalSoldItems(response.data.totalSoldItems);
        setTotalNotSoldItems(response.data.totalNotSoldItems);
      } catch (error) {
        console.error('Error fetching statistics:', error);
      }
    };

    fetchStatistics();
  }, [selectedMonth]); // Fetch statistics data whenever selectedMonth changes

  return (
    <div>
      <div><h1 className='dashboard-header'> Transactions Statistics</h1></div>
      <div className='statistic select-month search-input' >
        <label >Select Month:</label>
        <select value={selectedMonth} onChange={handleMonthChange}>
          <option value="January">January</option>
          <option value="February">February</option>
          <option value="March">March</option>
          <option value="April">April</option>
          <option value="May">May</option>
          <option value="June">June</option>
          <option value="July">July</option>
          <option value="August">August</option>
          <option value="September">September</option>
          <option value="October">October</option>
          <option value="November">November</option>
          <option value="December">December</option>
          {/* Add more options for other months */}
        </select>
      </div>
      <div className='stdata'>
        <p>Total Sale Amount: {totalSaleAmount}</p>
        <p>Total Sold Items: {totalSoldItems}</p>
        <p>Total Not Sold Items: {totalNotSoldItems}</p>
      </div>
    </div>
  );
};

export default TransactionDashboard;

