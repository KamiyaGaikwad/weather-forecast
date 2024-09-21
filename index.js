document.addEventListener('DOMContentLoaded', function () {
    //extract elements present in the weatherContainer
    const weatherContainerElem = document.getElementById('weatherContainer');
    const cityNameElem = document.getElementById('cityName');
    const dateElem = document.getElementById('todayDate');
    const conditionTextElem = document.getElementById('conditionText');
    const conditionIconElem = document.getElementById('conditionIcon');
    const temperatureElem = document.getElementById('temperature');
    const feelsLikeElem = document.getElementById('feelsLike');
    const windElem = document.getElementById('wind');
    const humidityElem = document.getElementById('humidity');
    const loadingContainer = document.getElementById("loadingContainer")
    const forecastContainer = document.getElementById('forecastContainer');
    const forecastDaysElem = document.getElementById('forecastDays');

    // Extract elements from the dropdwon container
    const dropdownContainer = document.getElementById('dropdownContainer')
    const cityDropdown = document.getElementById('cityDropdown');

    // Extract the error container and the error container text
    const errorElem = document.getElementById('errorContainer');
    const errorText = document.getElementById('errorText');

    // Populate dropdown for the first time on page load
    populateDropdown();

    // Constants for using the Weather API, API key and the API Base URL
    const API_KEY = '7fdd900994b9456b832215556241009';
    const API_BASE_URL = 'http://api.weatherapi.com/v1';

    // getWeatherByCityName("hyderabad")

    // event listner for click on searchButton
    document.getElementById('searchBtn').addEventListener('click', function () {
        // get the city input element by its id
        const cityInput = document.getElementById('city');
        // extract the value in the city input box
        const city = cityInput.value;

        // if  city is present reset the input value
        if (city) {
            cityDropdown.value = "";
            // console.log('City detected as', city, "will find weather");
            // find weather by city name
            getWeatherByCityName(city)
            cityInput.value = "";
        } else {
            // show error if city name is not entered
            showError('Please enter a city name.');
            cityDropdown.value = "";
        }
    });

    // add a keydown event listner to the city input to detect press of enter key
    document.getElementById('city').addEventListener('keypress', function (event) {
        // simulate click of "Search" button when user presses enter in the city input
        if (event.key === 'Enter') {
            console.log("enter pressed")
            event.preventDefault(); // Prevent form submission
            const searchBtn = document.getElementById('searchBtn')
            searchBtn.click(); // Trigger the search button click event
        }
    });

    // add an event listener to the location Button
    document.getElementById('locationBtn').addEventListener('click', function () {
        hideError()
        showLoader()

        // hide weather container by removing flex and adding hidden class            
        weatherContainerElem.classList.remove('flex');
        weatherContainerElem.classList.add('hidden');

        // find the latitude and longitude of the user using ab browser function
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                console.log('Searching for location using device:', latitude, longitude);
                // find the weather at users location by coordinates
                getWeatherByCoordinates(latitude, longitude)
            }, function (error) {
                console.error('Error getting location:', error);
                // if error hide the loader
                hideLoader()
                // show the error message for location permission
                showError("Error getting location, ensure that location permission is enabled")
            });
        } else {
            // show an alert if geolocation is not supported by the browser
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

    // function to show the loading container
    function showLoader() {
        loadingContainer.classList.remove("hidden")
        loadingContainer.classList.add("flex")
    }

    // function to hide the loading container
    function hideLoader() {
        loadingContainer.classList.remove("flex")
        loadingContainer.classList.add("hidden")
    }

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

    // function to read cities from local storage and populate then to the dropdown
    function populateDropdown() {
        // read "recentCities" from the localStorage and parse it as a JSON
        const cities = JSON.parse(localStorage.getItem('recentCities')) || [];
        if (cities.length === 0) {
            dropdownContainer.style.display = 'none'; // Hide dropdown if no cities are there
        }
        // if any cities are present then populate them into the dropdown
        else {
            // add the default placeholder value for the dropdown (disabled)
            cityDropdown.innerHTML = '<option value="" disabled selected>Select recently searched cities</option>';
            // iterate through city array and populate them to the dropdown
            cities.forEach(city => {
                const option = document.createElement('option');
                option.value = city;
                option.textContent = city;
                cityDropdown.appendChild(option);
            });
            dropdownContainer.style.display = 'block'; // Show dropdown container if cities are present
        }
    }

    // Function to call the weather APi given the URL (city or location based)
    async function callWeatherAPI(url) {
        // Clear previous error if any
        hideError();
        // show the loader while we do the api call
        showLoader();

        try {

            // hide weather container            
            weatherContainerElem.classList.remove('flex');
            weatherContainerElem.classList.add('hidden');
            
            // execute the api call for fetching the weather details for the selected city or location
            const response = await fetch(url);
            // console.log(response.statusText)
            // handle case where the response is not 2xx (not OK)
            if (!response.ok) {
                if (response.status === 400 || 404) {
                    showError('City not found. Please check the city name.');
                } else if (response.status === 500) {
                    showError('Server error. Please try again later.');
                } else {
                    showError(`An unexpected error occurred: ${response.statusText}`);
                }
                return; // to exit the function if response is not OK
            }
            
            // extract the data from the response if the response is 200 (2xx or OK)
            const data = await response.json();
            // console.log('Weather data for city:', data);
            // if the status is 200 but API returns an error message we will show an error to the user
            if (data.error) {
                showError('Error fetching weather data.');
            }
            else {
                // display the weather data in the weather container
                displayWeatherData(data);
                // add this city to the recent city dropdown and to local storage
                addCityToDropdown(data.location.name);
            }

        } catch (error) {
            // Handle network-related errors (no internet)
            if (error.name === 'TypeError') {
                showError('Network error. Please check your internet connection.');
            } else {
                showError('An unexpected error occurred. Please try again.');
            }
            console.error('Error fetching weather data:', error);
        }
        finally {
            // in either case of try or catch hide the loader 
            hideLoader()
        }
    }

    // function to get the weather in a particular city using its name
    async function getWeatherByCityName(cityName) {
        // create the URL for the API call using the city name
        const url = `${API_BASE_URL}/current.json?key=${API_KEY}&q=${encodeURIComponent(cityName)}`;
        callWeatherAPI(url)

    }

    // function to get the weather in a area by location
    async function getWeatherByCoordinates(lat, lon) {
        // create the url for the api call using the latitude and longitude
        const url = `${API_BASE_URL}/current.json?key=${API_KEY}&q=${lat},${lon}`;
        callWeatherAPI(url)
    }

    // Function to display error messages in the weather container itself
    // Function to display error messages
    function showError(message) {
        // Update the error message
        console.log(errorText)
        errorText.textContent = message;
        // Make the error container visible
        errorElem.classList.remove('hidden');
        errorElem.classList.add('flex');

        // hide the forcecast container and the weather container
        weatherContainerElem.classList.remove('flex');
        weatherContainerElem.classList.add('hidden');
        forecastContainer.classList.remove('flex');
        forecastContainer.classList.add('hidden');
    }

    // Function to hide the error message
    function hideError() {
        // set the error text to empty string
        errorText.textContent = '';
        errorElem.classList.remove('flex');
        errorElem.classList.add('hidden');
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

        // set the city name
        cityNameElem.textContent = cityName;
        // set the date in weather element
        dateElem.textContent = `${formattedDate}`;
        // set the condition text
        conditionTextElem.textContent = weatherData.condition.text;
        // render the condition image using the URL of the icon in the API
        conditionIconElem.innerHTML = `<img src="${data.current.condition.icon}" alt="Weather Condition Icon" class="w-20 h-20">`;
        // set the temperature
        temperatureElem.textContent = `${weatherData.temp_c}°C`;
        // set the feels like temperature
        feelsLikeElem.textContent = `Feels Like: ${weatherData.feelslike_c}°C`;
        // set the wind data
        windElem.textContent = `Wind: ${weatherData.wind_kph} km/h`;
        // set the humidity data
        humidityElem.textContent = `Humidity: ${weatherData.humidity}%`;
        
        // show the weather container
        weatherContainerElem.classList.remove('hidden');
        weatherContainerElem.classList.add('flex');

        // get the weather forecase by cityName
        getWeatherForecast(cityName)

    }

    // function to get the weather forecast using cityName
    async function getWeatherForecast(cityName) {
        const url = `${API_BASE_URL}/forecast.json?key=${API_KEY}&q=${encodeURIComponent(cityName)}&days=3`;  
        // We can adjust days as needed by the free api allows 3 days so I am keeping it 3 

        try {
            // get the weather forecase by city name
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
        
        // Remove previous city forecast data
        forecastDaysElem.innerHTML = '';

        forecastDays.forEach(day => {
            const dayDate = new Date(day.date).toDateString(); // e.g., "Mon Sep 16 2024"
            const [dayOfWeek, month, dayOfMonth] = dayDate.split(' ');

            // Arrange the date string without the year and add a comma after the day
            const forecastDate = `${dayOfWeek}, ${dayOfMonth} ${month}`;
            const maxTemp = day.day.maxtemp_c;
            const minTemp = day.day.mintemp_c;
            const conditionText = day.day.condition.text;
            const conditionIcon = day.day.condition.icon;  // URL for the condition icon

            // Create forecast card using talwind classes
            const forecastCard = `
                    <article class="shadow-lg ring-1 bg-white/20 ring-white/5 p-4 backdrop-blur-lg rounded-lg flex flex-col items-left">
                    <header class="flex flex-row items-center text-white rounded-full mb-2"> 
                        <img src="${conditionIcon}" alt="${conditionText}" class="w-16 h-16">
                        <section>
                            <h3 class="text-xl font-bold text-white">${forecastDate}</h3>
                            <p class="text-gray-300 text-base">${conditionText}</p>
                        </section>
                    </header> 
                    <section class="flex flex-row p-2 items-center mt-auto">
                        <i class="fa-solid fa-temperature-half fa-2x pr-2"></i>
                        <section class="pb-2 text-sm">
                            <p class="text-gray-300">Max: ${maxTemp}°C</p>
                            <p class="text-gray-300">Min: ${minTemp}°C</p>
                        </section>
                    </section>   
                </article>
        
            `;

            // Append forecast card to the forecast container
            forecastDaysElem.innerHTML += forecastCard;
        });

        // Make the forecast container visible
        forecastContainer.classList.remove('hidden');
        forecastContainer.classList.add('flex');

    }

});



