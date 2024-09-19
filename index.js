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

    // Populate dropdown for the first time on page load
    populateDropdown();

    const API_KEY = '7fdd900994b9456b832215556241009';
    const API_BASE_URL = 'http://api.weatherapi.com/v1';

    // getWeatherByCityName("hyderabad")

    // event listner for searchButton
    document.getElementById('searchBtn').addEventListener('click', function () {
        const cityInput = document.getElementById('city');
        const city = cityInput.value;
        if (city) {
            cityDropdown.value = "";
            console.log('City detected as', city, "will find weather");
            // find weather by city name
            getWeatherByCityName(city)
            cityInput.value = "";
        } else {
            showError('Please enter a city name.');
            cityDropdown.value = "";
        }
    });

    document.getElementById('city').addEventListener('keypress', function (event) {

        if (event.key === 'Enter') {
            console.log("enter pressed")
            event.preventDefault(); // Prevent form submission
            const searchBtn = document.getElementById('searchBtn')
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
        const errorText = document.getElementById('errorText');
        // Update the error message
        console.log(errorText)
        errorElem.textContent = message;
        // Make the error container visible
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
        const convertedDate = localtime.split(' ')[0]; // Extract just the date part
        // Create a new Date object from the date string
        const dateObj = new Date(convertedDate);

        // Format the date using toLocaleDateString with options
        const options = { weekday: 'long', day: 'numeric', month: 'short' };
        const formattedDate = dateObj.toLocaleDateString('en-US', options);

        cityNameElem.textContent = cityName;
        dateElem.textContent = `${formattedDate}`;
        conditionTextElem.textContent = weatherData.condition.text;
        conditionIconElem.innerHTML = `<img src="${data.current.condition.icon}" alt="Weather Condition Icon" class="w-20 h-20">`;
        temperatureElem.textContent = `${weatherData.temp_c}°C`;
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
            const dayDate = new Date(day.date).toDateString(); // e.g., "Mon Sep 16 2024"
            const [dayOfWeek, month, dayOfMonth] = dayDate.split(' ');

            // Reassemble the date string without the year and add a comma after the day
            const forecastDate = `${dayOfWeek}, ${dayOfMonth} ${month}`;
            const maxTemp = day.day.maxtemp_c;
            const minTemp = day.day.mintemp_c;
            const conditionText = day.day.condition.text;
            const conditionIcon = day.day.condition.icon;  // URL for the condition icon

            // Create forecast card
            const forecastCard = `
                <div class="shadow-lg ring-1 bg-white/20 ring-white/5 p-4 backdrop-blur-lg rounded-lg flex flex-col items-left">
                    <div class="flex flex-row items-center text-white rounded-full mb-2"> 
                        <img src="${conditionIcon}" alt="${conditionText}" class="w-16 h-16">
                        <div>
                        <h3 class="text-xl font-bold text-white">${forecastDate}</h3>
                        <p class="text-gray-300 text-base">${conditionText}</p>
                        </div>
                    </div> 
                    <div class="flex flex-row p-2 items-center mt-auto">
                    <i class="fa-solid fa-temperature-half fa-2x pr-2"></i>
                            <div class="pb-2 text-sm">
                                <p class="text-gray-300">Max: ${maxTemp}°C</p>
                                <p class="text-gray-300">Min: ${minTemp}°C</p>
                            </div>
                    </div>   
                <div>
            `;

            // Append forecast card to the container
            forecastDaysElem.innerHTML += forecastCard;
        });

        // Make the forecast container visible
        forecastContainer.classList.remove('hidden');

    }

});



