document.addEventListener('DOMContentLoaded', function () {
    //extract elemnets in the weatherContainer
    const weatherContainerElem = document.getElementById('weatherContainer');
    const cityNameElem = document.getElementById('cityName');
    const conditionTextElem = document.getElementById('conditionText');
    const conditionIconElem = document.getElementById('conditionIcon');
    const temperatureElem = document.getElementById('temperature');
    const feelsLikeElem = document.getElementById('feelsLike');
    const windElem = document.getElementById('wind');
    const humidityElem = document.getElementById('humidity');

    // empty state of the dropdown
    const dropdownContainer = document.getElementById('dropdownContainer')
    const cityDropdown = document.getElementById('cityDropdown');

    // event listner for searchButton
    document.getElementById('searchBtn').addEventListener('click', function () {
        const city = document.getElementById('city').value;
        if (city) {
            console.log('City detected as', city, "will find weather");
            // find weather by city name
            getWeatherByCityName(city)
            // add this city to the recent city dropdown and to local storage
            addCityToDropdown(city);
        }
    });

    document.getElementById('locationBtn').addEventListener('click', function () {
        // find the latitude and longitude of the user
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                console.log('Searching for location using device:', latitude, longitude);
                // find the weather at users location by coordinates
                getWeatherByCoordinates(latitude, longitude)
            }, function (error) {
                console.error('Error getting location:', error);
            });
        } else {
            // show an alert is geolocation is not supported
            alert('Geolocation is not supported by this browser.');
        }
    });

    // event listner for city selection dropdown when a new city is selected
    cityDropdown.addEventListener('change', function () {
        const selectedCity = cityDropdown.value;
        if (selectedCity) {
            // find the weather using the current selected city name
            getWeatherByCityName(selectedCity);
        }
    });

    // function to add current city to dropdown
    function addCityToDropdown(city) {
        // read cities from local storage
        let cities = JSON.parse(localStorage.getItem('recentCities')) || [];

        // Add new cities to the array
        if (!cities.includes(city)) {
            cities.unshift(city);
            if (cities.length > 7) {
                cities.pop(); // only keep the last 7 cities in the array
            }
            // add city object to local storage
            localStorage.setItem('recentCities', JSON.stringify(cities));
            // add the newly added city to existing dropdown as well
            populateDropdown();
        }
    }

    function populateDropdown() {
        const cities = JSON.parse(localStorage.getItem('recentCities')) || [];
        if (cities.length === 0) {
            dropdownContainer.style.display = 'none'; // Hide dropdown if no cities are there
        }

        else {
            cityDropdown.innerHTML = '<option value="" disabled selected>Select recently searched cities</option>';
            cities.forEach(city => {
                const option = document.createElement('option');
                option.value = city;
                option.textContent = city;
                cityDropdown.appendChild(option);
            });
            dropdownContainer.style.display = 'block'; // Show dropdown container if cities are present
        }
    }


    // Populate dropdown for the first time on page load
    populateDropdown();

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
            addCityToDropdown(data.location.name)
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
        conditionIconElem.innerHTML = `<img src="${data.current.condition.icon}" alt="Weather Condition Icon" class="w-24 h-24">`;
        temperatureElem.textContent = `Temperature: ${weatherData.temp_c}°C`;
        feelsLikeElem.textContent = `Feels Like: ${weatherData.feelslike_c}°C`;
        windElem.textContent = `Wind: ${weatherData.wind_kph} km/h`;
        humidityElem.textContent = `Humidity: ${weatherData.humidity}%`;

        weatherContainerElem.classList.remove('hidden');
    }

});

