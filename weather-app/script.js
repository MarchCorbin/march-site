function getWeatherForecast(lat, lon) {
    const apiKey = '3dcf5e49131746baab6161412242809';  // Replace with your WeatherAPI key
    const forecastUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${lat},${lon}&days=7`;  // No need for units parameter

    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => {
            console.log('WeatherAPI Response:', data);

            displayCurrentWeather(data.current);
            displayForecast(data.forecast.forecastday, lat, lon);  // Pass lat, lon
            if (data.forecast.forecastday[0].hour) {
                displayHourlyForecast(data.forecast.forecastday[0].hour, lat, lon);  // Pass lat, lon
            } else {
                console.error("No hourly data available");
            }
        })
        .catch(error => {
            console.error('Error fetching WeatherAPI data:', error);
        });
}


function displayCurrentTime() {
    const currentTime = new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });

    // Display the formatted time and add a class to bold it
    document.getElementById('current-time').innerHTML = `<strong>${currentTime}</strong>`;  // Bold the time
}


// Call the function initially and then update it every minute
displayCurrentTime();
setInterval(displayCurrentTime, 60000);



// Fallback function to get simple current weather
function getSimpleCurrentWeather(lat, lon, apiKey) {
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;

    fetch(currentWeatherUrl)
        .then(response => response.json())
        .then(data => {
            // Get current weather data
            const temp = data.main.temp;
            const description = data.weather[0].description;
            const iconCode = data.weather[0].icon;  // Get the weather icon code

            // Display current weather
            document.getElementById('location').innerText = `Current Temperature: ${temp}°C`;
            document.getElementById('weather').innerText = description;

            // Map OpenWeatherMap icons to your local Weather Icons classes
            const weatherIcon = document.getElementById('weather-icon');
            const weatherIconsMap = {
                '01d': 'wi-day-sunny',
                '01n': 'wi-night-clear',
                '02d': 'wi-day-cloudy',
                '02n': 'wi-night-cloudy',
                '03d': 'wi-cloud',
                '03n': 'wi-cloud',
                '04d': 'wi-cloudy',
                '04n': 'wi-cloudy',
                '09d': 'wi-showers',
                '09n': 'wi-showers',
                '10d': 'wi-day-rain',
                '10n': 'wi-night-rain',
                '11d': 'wi-thunderstorm',
                '11n': 'wi-thunderstorm',
                '13d': 'wi-snow',
                '13n': 'wi-snow',
                '50d': 'wi-fog',
                '50n': 'wi-fog'
            };

            // Remove existing classes and set the correct weather icon class
            const iconClass = weatherIconsMap[iconCode] || 'wi-na';  // Fallback to 'wi-na' if iconCode is not found
            weatherIcon.className = `wi ${iconClass}`;  // Assign the new class for the icon

            // Make sure the weather icon is visible
            weatherIcon.style.opacity = '1';

            // Theme the entire page based on the current weather
            const body = document.body;

            if (description.includes('rain')) {
                body.style.backgroundColor = '#1a1a2e';  // Dark blue for rain
                body.style.color = '#fff';  // White text for contrast
            } else if (description.includes('cloud')) {
                body.style.backgroundColor = '#3e3e3e';  // Gray for cloudy
                body.style.color = '#fff';  // White text for contrast
            } else if (description.includes('clear')) {
                body.style.backgroundColor = '#f5ba13';  // Bright yellow for clear
                body.style.color = '#000';  // Black text for contrast
            } else if (description.includes('snow')) {
                body.style.backgroundColor = '#d0e9ff';  // Light blue for snow
                body.style.color = '#000';  // Black text for contrast
            } else if (description.includes('fog') || description.includes('mist')) {
                body.style.backgroundColor = '#cfcfcf';  // Light gray for fog/mist
                body.style.color = '#000';  // Black text for contrast
            } else {
                body.style.backgroundColor = '#444';  // Default background
                body.style.color = '#fff';  // White text
            }
        })
        .catch(error => {
            console.error('Error fetching current weather data:', error);
        });
}

// Helper function to format date as "Day (Mon)", e.g., "Mon 09/28"
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { weekday: 'short', month: 'numeric', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
}

// Modify the existing loop for displaying the 7-day forecast
forecastData.forEach(day => {
    const date = formatDate(day.date);
    const temp = day.day.avgtemp_c.toFixed(1);  // Average temperature in Celsius
    const description = day.day.condition.text;  // Weather condition description
    const iconCode = day.day.condition.icon;  // Weather icon URL

    const forecastHTML = `
        <div class="forecast-day">
            <p><strong>${date}</strong></p>
            <img src="${iconCode}" alt="${description}">
            <p>${temp}°C, ${description}</p>
        </div>
    `;
    forecastContainer.innerHTML += forecastHTML;
});


// Display current weather at the top
function displayCurrentWeather(weatherData) {
    const temp = weatherData.temp_f;  // Use Fahrenheit
    const description = weatherData.condition.text;
    const iconCode = weatherData.condition.icon;

    const currentWeatherHTML = `
        <p><strong>Current Temperature: ${temp}°F</strong></p>  <!-- Fahrenheit -->
        <p>${description}</p>
        <img src="${iconCode}" alt="${description}">
    `;
    document.getElementById('current-weather').innerHTML = currentWeatherHTML;
}



// Display the 7-day forecast in a horizontal layout
function displayForecast(forecastData, lat, lon) {
    const forecastContainer = document.getElementById('forecast-container');
    forecastContainer.innerHTML = '';  // Clear previous data

    forecastData.forEach(day => {
        const date = new Date(day.date);
        const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' });
        const formattedDate = date.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' });
        const tempHigh = day.day.maxtemp_f.toFixed(1);
        const tempLow = day.day.mintemp_f.toFixed(1);
        const description = day.day.condition.text;
        const iconCode = day.day.condition.icon;

        const dailyItem = document.createElement('a');
        dailyItem.href = `https://www.weather.com/weather/tenday/l/${lat},${lon}`;
        dailyItem.target = "_blank";
        dailyItem.classList.add('forecast-day');

        dailyItem.innerHTML = `
            <p class="day">${dayOfWeek} (${formattedDate})</p>
            <img src="${iconCode}" alt="${description}">
            <p>${tempHigh}°F / ${tempLow}°F, ${description}</p>
        `;

        forecastContainer.appendChild(dailyItem);
    });

    // Highlight the current day
    const today = new Date().toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' });
    document.querySelectorAll('.forecast-day').forEach(item => {
        const dayText = item.querySelector('.day').innerText;
        if (dayText.includes(today)) {
            item.classList.add('current-day');
        }
    });
}






// Function to display hourly data
function displayHourly(hourlyData) {
    const hourlyContainer = document.getElementById('hourly-container');
    hourlyContainer.innerHTML = '';  // Clear previous data

    hourlyData.slice(0, 24).forEach(hour => {
        const time = hour.time.split(' ')[1];  // Extract time from the time field
        const temp = hour.temp_c.toFixed(1);  // Temperature in Celsius
        const description = hour.condition.text;  // Weather condition description
        const iconCode = hour.condition.icon;  // Weather icon URL

        const hourlyHTML = `
            <div class="hourly-forecast">
                <p><strong>${time}</strong></p>
                <img src="${iconCode}" alt="${description}">
                <p>${temp}°C, ${description}</p>
            </div>
        `;
        hourlyContainer.innerHTML += hourlyHTML;
    });
}

// Display the 24-hour forecast
function displayHourlyForecast(hourlyData, lat, lon) {
    const hourlyForecastContainer = document.getElementById('hourly-forecast');
    hourlyForecastContainer.innerHTML = '';  // Clear any previous data

    hourlyData.slice(0, 24).forEach(hour => {
        const time = new Date(hour.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const temp = hour.temp_f.toFixed(1);
        const description = hour.condition.text;
        const iconCode = hour.condition.icon;

        const hourlyItem = document.createElement('a');
        hourlyItem.href = `https://www.weather.com/weather/hourbyhour/l/${lat},${lon}`;
        hourlyItem.target = "_blank";
        hourlyItem.classList.add('hourly-forecast-item');

        const currentHour = new Date().getHours();
        const hourTime = new Date(hour.time).getHours();
        const currentHourClass = (hourTime === currentHour) ? 'current-hour' : '';

        hourlyItem.innerHTML = `
            <div class="${currentHourClass}">
                <p>${time}</p>
                <img src="${iconCode}" alt="Weather icon">
                <p>${temp}°F</p>
            </div>
        `;

        hourlyForecastContainer.appendChild(hourlyItem);
    });

    // Scroll to the current hour (ensure smooth scrolling to the current hour forecast)
    const currentHourElement = document.querySelector('.current-hour');
    if (currentHourElement) {
        currentHourElement.scrollIntoView({ inline: 'center', behavior: 'smooth' });
    }
}


// Get user's location and fetch weather
function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            fetchCityState(lat, lon);  // Display City, State
            getWeatherForecast(lat, lon);  // Fetch weather based on user's location
        });
    } else {
        console.log('Geolocation is not supported by this browser.');
    }
}


function fetchCityState(lat, lon) {
    const geoApiKey = 'bdc_e86699da52434ac5a1afa9db00ddc5e9';  // Replace with your geocoding API key
    const geoUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`;

    fetch(geoUrl)
        .then(response => response.json())
        .then(data => {
            const city = data.city;
            const state = data.principalSubdivision;

            // Display City, State above the current time
            document.getElementById('location').innerHTML = `<strong>${city}, ${state}</strong>`;
        })
        .catch(error => {
            console.error('Error fetching location data:', error);
        });
}


