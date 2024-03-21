// import fetch from 'node-fetch';
// import mongoose from 'mongoose';

// // MongoDB connection
// mongoose.connect('mongodb+srv://pawarshiv2023:shivkanya@cluster1.klsiueo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1');
// const db = mongoose.connection;

// db.on('error', console.error.bind(console, 'MongoDB connection error:'));
// db.once('open', () => {
//   console.log('Connected to MongoDB');
// });

// // Define schema
// const postSchema = new mongoose.Schema({
//   id: {
//     type: Number,
//     required: true
//   },
//   title: {
//     type: String,
//     required: true
//   },
//   description: {
//     type: String,
//     required: true
//   },
//   price: {
//     type: Number,
//     required: true
//   },
//   category: {
//     type: String,
//     required: true
//   },
//   sold: {
//     type: Boolean,
//     required: true
//   },
//   image: {
//     type: String,
//     required: true
//   },
//   dateOfSale: {
//     type: Date,
//     required: true
//   }
// });

// const Post = mongoose.model('Post', postSchema);

// async function getPosts() {
//   try {
//     const myPosts = await fetch('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
//     const response = await myPosts.json();
//     for (let i = 0; i < response.length; i++) {
//       const post = new Post({
//         id: response[i]['id'],
//         title: response[i]['title'],
//         description: response[i]['description'],
//         price: response[i]['price'],
//         category: response[i]['category'],
//         sold: response[i]['sold'],
//         image: response[i]['image'],
//         dateOfSale: response[i]['dateOfSale']
//       });
//       await post.save(); // Wait for save operation to complete
//     }
//     console.log('Data fetched and saved successfully');
//   } catch (error) {
//     console.error('Error fetching data:', error.message);
//   }
// }

// getPosts();

// index.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Import the cors middleware
const userRoutes = require('./routes/userRoutes'); // Assuming you have transaction routes defined in this file
const Transaction = require('./models/Transaction'); // Import the Transaction model

const app = express();
const PORT = 8002
;

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/', userRoutes);

// MongoDB connection
mongoose.connect('mongodb+srv://pawarshiv2023:shivkanya@cluster1.klsiueo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(error => {
  console.error('MongoDB connection error:', error);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
