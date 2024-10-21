function getTopCryptos() {
    const cryptoTable = document.getElementById('crypto-table');
    const url = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=3&page=1&sparkline=false&price_change_percentage=1h,24h,7d,30d,200d,1y';

    fetch(url)
        .then(response => response.json())
        .then(data => {
            cryptoTable.innerHTML = '';  // Clear any existing data
            data.forEach(crypto => {
                const price = crypto.current_price.toLocaleString();  // Format price with commas
                const change24h = crypto.price_change_percentage_24h_in_currency || 0;  // 24h change
                const changeMTD = crypto.price_change_percentage_30d_in_currency || 0;  // MTD from 30-day price change
                const changeYTD = crypto.price_change_percentage_1y_in_currency || 0;   // YTD from 1-year price change
                const coinLink = `https://www.coingecko.com/en/coins/${crypto.id}`;  // Link to detailed page

                // Wrap both image and text in a single clickable <a> tag
                const coinDisplay = `<a href="${coinLink}" target="_blank" style="color: white; text-decoration: none;">
                                        <img src="${crypto.image}" alt="${crypto.name}" style="width: 24px; vertical-align: middle; margin-right: 10px;">
                                        ${crypto.name}
                                     </a>`;

                // Update row with formatted price and clickable coin image and name
                const row = `
                    <tr>
                        <td>${coinDisplay}</td>
                        <td>$${price}</td>  <!-- Display formatted price -->
                        <td style="color: ${change24h < 0 ? 'red' : 'green'};">${change24h.toFixed(2)}%</td>
                        <td style="color: ${changeMTD < 0 ? 'red' : 'green'};">${changeMTD.toFixed(2)}%</td>
                        <td style="color: ${changeYTD < 0 ? 'red' : 'green'};">${changeYTD.toFixed(2)}%</td>
                    </tr>
                `;
                cryptoTable.innerHTML += row;
            });
        })
        .catch(error => {
            console.error('Error fetching cryptocurrency data:', error);
            cryptoTable.innerHTML = '<tr><td colspan="5">Error fetching data</td></tr>';
        });
}
