document.addEventListener('DOMContentLoaded', function () {
    const weatherContainerElem = document.getElementById('weatherContainer');
    const cityNameElem = document.getElementById('cityName');
    const conditionTextElem = document.getElementById('conditionText');
    const conditionIconElem = document.getElementById('conditionIcon');
    const temperatureElem = document.getElementById('temperature');
    const feelsLikeElem = document.getElementById('feelsLike');
    const windElem = document.getElementById('wind');
    const humidityElem = document.getElementById('humidity');
    
    document.getElementById('searchBtn').addEventListener('click', function () {
        const city = document.getElementById('city').value;
        if (city) {
            console.log('City detected as', city, "will find weather");
            getWeatherByCityName(city)
        }
    });

    document.getElementById('locationBtn').addEventListener('click', function () {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                console.log('Searching for location using device:', latitude, longitude);
                getWeatherByCoordinates(latitude, longitude)
            }, function (error) {
                console.error('Error getting location:', error);
            });
        } else {
            alert('Geolocation is not supported by this browser.');
        }
    });

    

    const API_KEY = '7fdd900994b9456b832215556241009';
    const API_BASE_URL = 'http://api.weatherapi.com/v1';

    // function to get the weather in a particular city using its name
    async function getWeatherByCityName(cityName) {
        const url = `${API_BASE_URL}/current.json?key=${API_KEY}&q=${encodeURIComponent(cityName)}`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log('Weather data for city:', data);
            displayWeatherData(data);
            // Process and display data as needed
        } catch (error) {
            console.error('Error fetching weather data:', error);
        }
    }

    // function to get the weather in a area by location
    async function getWeatherByCoordinates(lat, lon) {
        const url = `${API_BASE_URL}/current.json?key=${API_KEY}&q=${lat},${lon}`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log('Weather data for current location:', data);
            displayWeatherData(data);
            // Process and display data as needed
        } catch (error) {
            console.error('Error fetching weather data:', error);
        }
    }

    function displayWeatherData(data) {
        const weatherData = data.current;
        const cityName = data.location.name;

        cityNameElem.textContent = cityName;
        conditionTextElem.textContent = weatherData.condition.text;
        conditionIconElem.src = `http:${weatherData.condition.icon}`;
        temperatureElem.textContent = `Temperature: ${weatherData.temp_c}°C`;
        feelsLikeElem.textContent = `Feels Like: ${weatherData.feelslike_c}°C`;
        windElem.textContent = `Wind: ${weatherData.wind_kph} km/h`;
        humidityElem.textContent = `Humidity: ${weatherData.humidity}%`;

        weatherContainerElem.classList.remove('hidden');
    }

});

