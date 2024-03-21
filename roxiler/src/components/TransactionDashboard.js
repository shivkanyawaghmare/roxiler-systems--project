import React, { useState, useEffect } from 'react';
import SelectMonthDropdown from './SelectMonthDropdown';
import TransactionsStatistics from './TransactionStatistic';
import './TransactionDashboard.css';
import axios from 'axios';
import BarChart from './BarChart';
const TransactionDashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedMonth, setSelectedMonth] = useState('March');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [transactionsPerPage] = useState(10);



  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
    setCurrentPage(1);
  };
  useEffect(() => {

    const fetchTransactions = async () => {
      try {
        const selectedDate = new Date(selectedMonth + ' 1, 2022'); // Assume year is 2022 for simplicity
        const formattedDate = selectedDate.toISOString().split('T')[0];
        
        const response = await axios.get(`http://localhost:8002/api/transactions?month=${formattedDate}`);
        if (response.status !== 200) {
          throw new Error('Failed to fetch data');
        }

        setTransactions(response.data.transactions);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error('Error fetching data:', error);
  
      }
    };

    fetchTransactions();
  }, [selectedMonth, currentPage,transactionsPerPage]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset current page when searching
  
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };


  // Logic for searching transactions
  const filteredTransactions = transactions.filter(transaction =>
    transaction.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(transaction.price).toLowerCase().includes(searchTerm.toLowerCase())
  );
  
// console.log('searchTerm:', searchTerm);
// console.log('filteredTransactions:', filteredTransactions);

  // Logic for pagination
  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = filteredTransactions.slice(indexOfFirstTransaction, indexOfLastTransaction);
  
  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className='dashboard-container' style={{ textAlign: 'center' }}>
      <h1 className='dashboard-header'>Transaction Dashboard</h1>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
      <input className='search-input'
          type="text"
          placeholder=" Search transactions...."
          value={searchTerm}
          onChange={(e) => handleSearchChange(e)}
        />
        <SelectMonthDropdown selectedMonth={selectedMonth} handleMonthChange={handleMonthChange} />
      </div>
      <table style={{ margin: '10px auto',backgroundColor:'antiquewhite' }}>
        {/* Table header */}
        <thead>
          <tr>
            <th>Title</th>
            <th>ID</th>
            <th>Description</th>
            <th>Price</th>
            <th>Category</th>
            <th>Sold</th>
            <th>Image</th>
          </tr>
        </thead>
        {/* Table body */}
        <tbody>
          {currentTransactions.map(transaction => (
            <tr key={transaction._id}>
              <td>{transaction.title}</td>
              <td>{transaction.id}</td>
              <td>{transaction.description}</td>
              <td>{transaction.price}</td>
              <td>{transaction.category}</td>
              <td>{transaction.sold ? 'Yes' : 'No'}</td>
              <td><img src={transaction.image} alt={transaction.title} style={{ width: '50px', height: '50px' }} /></td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
      </div>
      {/* Pagination */}
      <div>
      <div className='prevnext'>
        <button onClick={handlePrevPage} disabled={currentPage === 1}>Previous</button>
        <span>Page {currentPage} of {totalPages}</span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>Next</button>
      </div>
      <div ><TransactionsStatistics/></div>
    </div>

    </div>
  );
}

export default TransactionDashboard;


