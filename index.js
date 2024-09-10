document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('searchBtn').addEventListener('click', function () {
        const city = document.getElementById('city').value;
        if (city) {
            console.log('City detected as', city, "will find weather");
            // Will add API call here later
        }
    });

    document.getElementById('locationBtn').addEventListener('click', function () {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                console.log('Searching for location using device:', latitude, longitude);
                // TODO: Add api call here
            }, function (error) {
                console.error('Error getting location:', error);
            });
        } else {
            alert('Geolocation is not supported by this browser.');
        }
    });

});

const API_KEY = '7fdd900994b9456b832215556241009';
const BASE_URL = 'http://api.weatherapi.com/v1';
