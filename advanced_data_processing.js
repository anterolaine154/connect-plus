// filename: advanced_data_processing.js

/*
This JavaScript code performs advanced data processing tasks, including:
- Data fetching from a remote API
- Filtering and manipulating data
- Statistical analysis
- Data visualization using charts

Please note that this code is for illustrative purposes only and may not work without proper configuration and setup.

Author: Your Name
Date: (Enter the date here)
*/

// Import required libraries
const axios = require('axios');
const Chart = require('chart.js');

// Define global variables
let rawData = [];
let processedData = [];

// Fetch data from the remote API
async function fetchData() {
  try {
    const response = await axios.get('https://api.example.com/data');
    rawData = response.data;
  } catch (error) {
    console.error('Error fetching data:', error.message);
    return;
  }

  // Perform data processing tasks
  processedData = rawData
    .filter((item) => item.category === 'A')
    .map((item) => ({
      id: item.id,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
    }));

  // Perform statistical analysis on the processed data
  const totalQuantity = processedData.reduce((acc, item) => acc + item.quantity, 0);
  const averagePrice = processedData.reduce((acc, item) => acc + item.price, 0) / processedData.length;
  const maxQuantity = Math.max(...processedData.map((item) => item.quantity));
  
  // Generate a bar chart using Chart.js
  const ctx = document.getElementById('myChart').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: processedData.map((item) => item.name),
      datasets: [
        {
          label: 'Quantity',
          data: processedData.map((item) => item.quantity),
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
        {
          label: 'Price',
          data: processedData.map((item) => item.price),
          backgroundColor: 'rgba(153, 102, 255, 0.2)',
          borderColor: 'rgba(153, 102, 255, 1)',
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}

// Call the fetchData function to start the data processing and visualization
fetchData();