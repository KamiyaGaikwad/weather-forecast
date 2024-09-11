document.addEventListener('DOMContentLoaded', function () {
    //extract elemnets in the weatherContainer
    const weatherContainerElem = document.getElementById('weatherContainer');
    const cityNameElem = document.getElementById('cityName');
    const dateElem = document.getElementById('todayDate');
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
        }else {
            showError('Please enter a city name.');
        }
    });

    cityNameElem.addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent form submission
            searchBtn.click(); // Trigger the search button click event
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

        // Clear previous error if any
        hideError();

        try {

            const response = await fetch(url);
            if (!response.ok) {
                showError('Error fetching weather data. Please try another city or alternative name');
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log('Weather data for city:', data);
            if (data.error) {
                showError('Error fetching weather data. Please try another city or alternative name');
            }
            else {
                displayWeatherData(data);
                 // add this city to the recent city dropdown and to local storage
                 addCityToDropdown(data.location.name);
            }


        } catch (error) {
            showError('Error fetching weather data. Please try another city or alternative name');
            console.error('Error fetching weather data:', error);
        }
    }

    // function to get the weather in a area by location
    async function getWeatherByCoordinates(lat, lon) {
        const url = `${API_BASE_URL}/current.json?key=${API_KEY}&q=${lat},${lon}`;

        // Clear previous error data if any
        hideError();

        try {
            const response = await fetch(url);
            if (!response.ok) {
                showError('Error fetching weather data. Please try another city or alternative name');
            }
            const data = await response.json();
            if (data.error) {
                showError('Error fetching weather data. Please try another city or alternative name');
            }
            else {
                console.log('Weather data for current location:', data);
                displayWeatherData(data);
                addCityToDropdown(data.location.name)
            }

        } catch (error) {
            showError('Error fetching weather data. Please try another city or alternative name');
            console.error('Error fetching weather data:', error);
        }
    }

    // Function to display error messages in the weather container itself
    // Function to display error messages
    function showError(message) {
        const errorElem = document.getElementById('errorContainer');
        errorElem.textContent = message;
        errorElem.classList.remove('hidden');
        weatherContainerElem.classList.add('hidden');
        
        const forecastContainer = document.getElementById('forecastContainer');
        forecastContainer.classList.add('hidden'); 
    }

    // Function to hide the error message
    function hideError() {
        const errorElem = document.getElementById('errorContainer');
        errorElem.textContent = '';
        errorElem.classList.add('hidden');
    }

    // Function to clear the previous weather data populated during last api call
    function clearWeatherData() {
        weatherContainerElem.innerHTML = ''; // Clear previous weather data
    }

    // function to display weather data in the weather container
    function displayWeatherData(data) {
        const weatherData = data.current;
        const cityName = data.location.name;
        // Extract date from API's location.localtime
        const localtime = data.location.localtime;
        const formattedDate = localtime.split(' ')[0]; // Extract just the date part


        cityNameElem.textContent = cityName;
        dateElem.textContent = `Today's Date: ${formattedDate}`;
        conditionTextElem.textContent = weatherData.condition.text;
        conditionIconElem.innerHTML = `<img src="${data.current.condition.icon}" alt="Weather Condition Icon" class="w-24 h-24">`;
        temperatureElem.textContent = `Temperature: ${weatherData.temp_c}°C`;
        feelsLikeElem.textContent = `Feels Like: ${weatherData.feelslike_c}°C`;
        windElem.textContent = `Wind: ${weatherData.wind_kph} km/h`;
        humidityElem.textContent = `Humidity: ${weatherData.humidity}%`;
        weatherContainerElem.classList.remove('hidden');
        getWeatherForecast(cityName)

    }

    // function to get the weather forecast using cityName
    async function getWeatherForecast(cityName) {
        const url = `${API_BASE_URL}/forecast.json?key=${API_KEY}&q=${encodeURIComponent(cityName)}&days=3`;  // Adjust days as needed

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log('Weather forecast data for city:', data);

            // Display forecast data
            displayWeatherForecast(data.forecast.forecastday);
        } catch (error) {
            console.error('Error fetching forecast data:', error);
        }



    }

    // function to display the weatherforceast in the forecast container
    function displayWeatherForecast(forecastDays) {
        const forecastContainer = document.getElementById('forecastContainer');
        const forecastDaysElem = document.getElementById('forecastDays');

        // Remove previous city forecast data
        forecastDaysElem.innerHTML = '';

        forecastDays.forEach(day => {
            const forecastDate = new Date(day.date).toDateString();
            const maxTemp = day.day.maxtemp_c;
            const minTemp = day.day.mintemp_c;
            const conditionText = day.day.condition.text;
            const conditionIcon = day.day.condition.icon;  // URL for the condition icon

            // Create forecast card
            const forecastCard = `
                <div class="bg-gray-700 p-4 rounded-lg flex flex-col items-center">
                    <h3 class="text-xl text-white">${forecastDate}</h3>
                    <img src="${conditionIcon}" alt="${conditionText}" class="w-16 h-16 mb-2">
                    <p class="text-white">Max Temp: ${maxTemp}°C</p>
                    <p class="text-white">Min Temp: ${minTemp}°C</p>
                    <p class="text-white">${conditionText}</p>
                </div>
            `;

            // Append forecast card to the container
            forecastDaysElem.innerHTML += forecastCard;
        });

        // Make the forecast container visible
        forecastContainer.classList.remove('hidden');

    }

});



