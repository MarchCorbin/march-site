function fetchStockTickerData() {
    const yahooAPIKey = 'a340cc5244msh8ff76e1cad7e910p19cb02jsn76edee8bf4aa';  // Use your key
    const yahooAPIHost = 'apidojo-yahoo-finance-v1.p.rapidapi.com';
    const url = `https://apidojo-yahoo-finance-v1.p.rapidapi.com/market/get-movers?region=US`;

    fetch(url, {
        method: 'GET',
        headers: {
            'x-rapidapi-host': yahooAPIHost,
            'x-rapidapi-key': yahooAPIKey
        }
    })
    .then(response => {
        if (!response.ok) {
            // If the response is not ok, we assume it's due to rate limits or errors
            throw new Error('API maxed out or unavailable');
        }
        return response.json();
    })
    .then(data => {
        // If the data is valid, populate the stock ticker
        const stocks = data.finance.result[0].quotes;
        let tickerHTML = '';

        stocks.forEach(stock => {
            if (stock.regularMarketPrice && stock.regularMarketChangePercent !== undefined) {
                tickerHTML += `${stock.symbol}: $${stock.regularMarketPrice} (${stock.regularMarketChangePercent.toFixed(2)}%) &nbsp;&nbsp;|&nbsp;&nbsp;`;
            }
        });

        document.getElementById('ticker-content').innerHTML = tickerHTML;
        document.getElementById('nyse-widget').style.display = 'block';  // Show the widget
    })
    .catch(err => {
        console.error('Error fetching stock ticker data:', err);
        document.getElementById('nyse-widget').style.display = 'none';  // Hide the widget
    });
}

// Call the function to update the ticker on page load
fetchStockTickerData();
