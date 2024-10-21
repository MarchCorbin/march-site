let chartInstance;

function updateStock() {
    const symbol = document.getElementById('stock-symbol').value;
    if (symbol) {
        getNYSEData(symbol);  // Fetch and update stock data
        getStockHistory(symbol);  // Fetch and update chart with historical data
    }
}

function getNYSEData(symbol) {
    const yahooAPIKey = 'a340cc5244msh8ff76e1cad7e910p19cb02jsn76edee8bf4aa';  // Replace with your RapidAPI key
    const yahooAPIHost = 'apidojo-yahoo-finance-v1.p.rapidapi.com';
    const url = `https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v2/get-summary?symbol=${symbol}&region=US`;

    fetch(url, {
        method: 'GET',
        headers: {
            'x-rapidapi-host': yahooAPIHost,
            'x-rapidapi-key': yahooAPIKey
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log('Yahoo API Stock Summary Response:', data);

        const price = data.price.regularMarketPrice.raw;
        const change = data.price.regularMarketChangePercent.raw;

        document.getElementById('nyse-price').innerText = `Price: $${price.toFixed(2)}`;
        document.getElementById('nyse-change').innerText = `Change: ${change.toFixed(2)}%`;

        // Fetch historical data for the stock
        getStockHistory(symbol);
    })
    .catch(error => {
        console.error('Error fetching Yahoo stock data:', error);
    });
}

function getStockData() {
    const symbol = document.getElementById('stock-symbol').value;  // Get stock symbol from input
    if (!symbol) {
        alert('Please enter a stock symbol!');
        return;
    }

    // Call the function to fetch stock data for the entered symbol
    getStockHistory(symbol);
}



function getStockHistory(symbol) {
    const yahooAPIHost = 'apidojo-yahoo-finance-v1.p.rapidapi.com';
    const yahooAPIKey = 'a340cc5244msh8ff76e1cad7e910p19cb02jsn76edee8bf4aa'; // Replace with your key

    fetch(`https://${yahooAPIHost}/stock/v2/get-chart?interval=1d&region=US&symbol=${symbol}&range=1mo`, {
        method: 'GET',
        headers: {
            'x-rapidapi-key': yahooAPIKey,
            'x-rapidapi-host': yahooAPIHost,
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log('Chart Data:', data); // This helps you see the structure

        const labels = [];  // Dates
        const prices = [];  // Closing prices

        // Parsing the API data structure for timestamps and close prices
        const timeSeries = data.chart.result[0].timestamp;
        const closePrices = data.chart.result[0].indicators.quote[0].close;

        timeSeries.forEach((timestamp, index) => {
            const date = new Date(timestamp * 1000);  // Convert timestamp to milliseconds
            labels.push(date.toISOString().split('T')[0]);  // Format date as YYYY-MM-DD
            prices.push(closePrices[index]);
        });

        // Ensure labels and prices are correctly populated
        console.log('Parsed Labels (Dates):', labels);
        console.log('Parsed Prices:', prices);

        // Update the chart with fetched data
        updateChart(labels, prices, symbol)

        // Update the price and change elements
        document.getElementById('nyse-price').innerText = `Price: $${prices[prices.length - 1].toFixed(2)}`;
        const change = ((prices[prices.length - 1] - prices[prices.length - 2]) / prices[prices.length - 2]) * 100;
        document.getElementById('nyse-change').innerText = `Change: ${change.toFixed(2)}%`;
    })
    .catch(error => console.error('Error fetching stock data:', error));
}




let stockChartInstance = null;

function updateChart(labels, prices, symbol) {
    if (window.stockChartInstance) {
        window.stockChartInstance.destroy(); // Destroy previous chart instance
    }

    const ctx = document.getElementById('stockChart').getContext('2d');
    window.stockChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: `${symbol} Stock Price ($)`, // Update label with the stock symbol
                data: prices,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: false,
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'day'
                    },
                    ticks: {
                        color: 'white',
                        font: {
                            size: 14
                        }
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.2)'
                    }
                },
                y: {
                    ticks: {
                        color: 'white',
                        font: {
                            size: 14
                        }
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.2)'
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: 'white',
                        font: {
                            size: 16
                        }
                    }
                }
            }
        }
    });
}








