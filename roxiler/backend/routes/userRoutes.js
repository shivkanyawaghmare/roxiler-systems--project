const express = require('express');
const router = express.Router();
const axios = require('axios');
const Transaction = require('../models/Transaction');

router.get('/initialize-database', async (req, res) => {
  try {
    // Fetch JSON data from the third-party API
    const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
    const data = response.data;

    // Initialize the database with seed data
    await Transaction.insertMany(data);

    res.send('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error.message);
    res.status(500).send('Error initializing database');
  }
});

router.get('/transactions', async (req, res) => {
  try {
    // Extract query parameters
    let { search = '', page = 1, transactionsPerPage = 10, month } = req.query;

    // Parse page and transactionsPerPage as integers
    page = parseInt(page);
    transactionsPerPage = parseInt(transactionsPerPage);

    // Construct MongoDB query for search
    const searchQuery = {};
    if (search) {
      searchQuery.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { price: parseFloat(search) }
      ];
    }

    // If month is provided, filter transactions based on the month
    if (month) {
      const parsedMonth = new Date(month);
      if (!isNaN(parsedMonth.getTime())) {
        const startDate = new Date(parsedMonth.getFullYear(), parsedMonth.getMonth(), 1);
        const endDate = new Date(parsedMonth.getFullYear(), parsedMonth.getMonth() + 1, 0);
        searchQuery.dateOfSale = { $gte: startDate, $lte: endDate };
      }
    }

    // Count total matching documents
    const totalCount = await Transaction.countDocuments(searchQuery);

    // Calculate total pages
    const totalPages = Math.ceil(totalCount / transactionsPerPage);

    // Ensure page is within valid range
    page = Math.max(1, Math.min(page, totalPages));

    // Retrieve transactions with pagination
    const transactions = await Transaction.find(searchQuery)
      .skip((page - 1) * transactionsPerPage)
      // .limit(transactionsPerPage);

    // Send response
    res.json({
      total: totalCount,
      page: page,
      transactionsPerPage: transactionsPerPage,
      totalPages: totalPages,
      transactions: transactions
    });
  } catch (error) {
    console.error('Error listing transactions:', error.message);
    res.status(500).json({ error: 'Error listing transactions' });
  }
});

router.get('/statistics', async (req, res) => {
  const { month } = req.query;

  // Validate the month parameter
  if (!month) {
    return res.status(400).json({ error: 'Month parameter is required' });
  }

  try {
    // Parse the month into a Date object
    const parsedMonth = new Date(month);

    // Get the start and end dates of the month
    const startDate = new Date(parsedMonth.getFullYear(), parsedMonth.getMonth(), 1);
    const endDate = new Date(parsedMonth.getFullYear(), parsedMonth.getMonth() + 1, 0);

    // Perform statistics calculations
    const totalSaleAmount = await Transaction.aggregate([
      {
        $match: {
          dateOfSale: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: { _id: null, totalAmount: { $sum: '$price' } }
      }
    ]);

    const totalSoldItems = await Transaction.countDocuments({
      dateOfSale: { $gte: startDate, $lte: endDate },
      sold: true
    });

    const totalNotSoldItems = await Transaction.countDocuments({
      dateOfSale: { $gte: startDate, $lte: endDate },
      sold: false
    });

    res.json({
      totalSaleAmount: totalSaleAmount.length > 0 ? totalSaleAmount[0].totalAmount : 0,
      totalSoldItems,
      totalNotSoldItems
    });
  } catch (error) {
    console.error('Error fetching statistics:', error.message);
    res.status(500).send('Error fetching statistics');
  }
});

router.get('/bar-chart', async (req, res) => {
  const { month } = req.query;

  try {
    // Group transactions by price range
    const priceRanges = await Transaction.aggregate([
      {
        $match: { dateOfSale: { $regex: `.*${month}.*`, $options: 'i' } }
      },
      {
        $bucket: {
          groupBy: '$price',
          boundaries: [0, 100, 200, 300, 400, 500, 600, 700, 800, 900, Infinity],
          default: 'Other',
          output: { count: { $sum: 1 } }
        }
      }
    ]);

    res.json(priceRanges);
  } catch (error) {
    console.error('Error fetching bar chart data:', error.message);
    res.status(500).send('Error fetching bar chart data');
  }
});

module.exports = router;
