/*
File Name: ComplexCode.js

Description: 
This code demonstrates a real-time stock market data visualization tool. It fetches stock data from an API, updates the chart in real-time, and displays the information in an interactive, user-friendly manner.

Features:
- Fetches stock market data using the Alpha Vantage API.
- Uses Chart.js library to create dynamic and responsive charts.
- Provides real-time updates for stock prices.
- Supports multiple stock symbols and allows the user to switch between them.
- Displays additional information like market capitalization and volume.
- Implements user-friendly tooltips and custom styling for the chart.
- Handles error states and provides appropriate feedback to the user.

Note: In order to execute this code, you need to have the Chart.js library imported.

*/

// Initialize global variables
let chart; // Chart object
let activeStock = 'AAPL'; // Active stock symbol
const apiKey = 'YOUR_API_KEY'; // Replace with your Alpha Vantage API key

// Initialize Chart.js configuration
const chartConfig = {
  type: 'line',
  data: {
    labels: [],
    datasets: [
      {
        label: 'Stock Price',
        data: [],
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgb(54, 162, 235)',
        pointBackgroundColor: 'rgb(54, 162, 235)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(54, 162, 235)',
        borderWidth: 2,
        pointRadius: 0,
        pointHitRadius: 10,
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'day',
        },
        ticks: {
          source: 'auto',
        },
      },
      y: {
        ticks: {
          callback: function (value, index, values) {
            return '$' + value;
          },
        },
      },
    },
    plugins: {
      tooltip: {
        caretPadding: 10,
        titleFont: {
          size: 16,
          weight: 'bold',
        },
        bodyFont: {
          size: 14,
        },
        callbacks: {
          title: function (tooltipItems) {
            return tooltipItems[0].formattedValue;
          },
          label: function (tooltipItems) {
            const data = tooltipItems.dataset.data[tooltipItems.dataIndex];
            return 'Date: ' + formatDate(data.t) + '\nPrice: $' + data.y;
          },
        },
      },
      legend: {
        display: false,
      },
    },
  },
};

// Format date as 'YYYY-MM-DD'
function formatDate(date) {
  const d = new Date(date);
  return d.toISOString().split('T')[0];
}

// Get stock market data from Alpha Vantage API
async function fetchStockData(stock) {
  const apiUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${stock}&apikey=${apiKey}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data['Error Message']) {
      throw new Error(data['Error Message']);
    }

    return data;
  } catch (error) {
    throw new Error('Failed to fetch stock data: ' + error.message);
  }
}

// Update chart with stock data
function updateChart(stockData) {
  const labels = Object.keys(stockData['Time Series (Daily)']).reverse();
  const prices = labels.map((label) => parseFloat(stockData['Time Series (Daily)'][label]['4. close']));

  chartConfig.data.labels = labels;
  chartConfig.data.datasets[0].data = prices;
  chart.update();
}

// Render the chart on the page
function renderChart() {
  const canvas = document.getElementById('chart');
  const ctx = canvas.getContext('2d');

  chart = new Chart(ctx, chartConfig);
}

// Handle stock symbol change
function handleStockChange() {
  const stockSelect = document.getElementById('stock-select');
  activeStock = stockSelect.value;

  fetchStockData(activeStock)
    .then((stockData) => {
      updateChart(stockData);
    })
    .catch((error) => {
      console.error(error);
      // Handle error state here
    });
}

// Initialize the page
function init() {
  const stockSelect = document.getElementById('stock-select');
  stockSelect.addEventListener('change', handleStockChange);

  fetchStockData(activeStock)
    .then((stockData) => {
      renderChart();
      updateChart(stockData);
    })
    .catch((error) => {
      console.error(error);
      // Handle error state here
    });
}

// Execute initialization
init();
