# Weather Forecast Application

This project is a simple weather forecast app developed using **JavaScript**, **HTML**, and **Tailwind CSS**. 
The application fetches and shows weather data from the Weather API.

It can show the weather by City name or your current location, you can also find your last 7 recent searches in the City dropdown.

The app can also show weather forecast for the City upto 3 days (More if you have a paid API Key).

This app is responsive and optimized for multiple screen sizes, including desktop, iPad Mini, and iPhone SE.

## Table of Contents
- [Live Link](#live-link)
- [GitHub Repository](#github-repository)
- [Objective](#objective)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Prerequisites](#prerequisites)
- [Setup Instructions](#setup-instructions)
- [Using the application](#using-the-application)
- [Error Handling](#error-handling)
- [Folder Structure](#folder-structure)


## Live Link
Live Weather Forecast Application: [https://weather-forecast-app-kamiya.netlify.app/](https://weather-forecast-app-kamiya.netlify.app/)

## GitHub Repository
GitHub Repository: [https://github.com/KamiyaGaikwad/weather-forecast](https://github.com/KamiyaGaikwad/weather-forecast)

## Objective
The goal of this project was to build a functional weather application that can show real-time weather information and weather forecast based on user inputed city or city based on location, through a weather API.

## Features
- **Search Weather by City Name:** Users can input a city name to find current weather data.
- **Location-Based Weather:** Detect the user’s location and displays the weather forecast.
- **Recent Searches Dropdown:** Store the recently searched cities in local/session storage, enabling users to quickly select and view weather data for their previous searches.
- **Responsive Design:** The UI is responsive for different screen sizes (desktop, iPad Mini, iPhone SE).
- **Weather Forecast:** Displays weather details like temperature, wind speed, and humidity for the current day and a 3-day weather forecast for their location
- **Error Handling:** Shows appropriate error messages when the API call fails or invalid inputs are entered.
  
## Technologies Used
- **JavaScript**
- **HTML**
- **Tailwind CSS** (for responsive UI design)
- **WeatherAPI.com API** (weather API)
- **Local/Session Storage** (for storing recently searched cities)

## Prerequisites

Make sure you have the following installed:
- **Node.js** (https://nodejs.org)
- **npm** (comes with Node.js)


## Installation

## Setup Instructions

1. **Clone the repository**:
   ```bash
   git clone https://github.com/KamiyaGaikwad/weather-forecast
   ```
2. **Install dependencies**:
   Run the following command in your project directory to install the necessary dependencies (including Tailwind CSS and PostCSS):
   ```bash
   npm install
   ```

3. **Build Tailwind CSS**:

   Run:
   ```bash
   npx tailwindcss -i ./input.css -o ./output.css --watch
   ```

4. **Run the application**:
   - **Using a Live Server (Recommended)**
     1. Install a live server globally (if you don’t have it installed):
        ```bash
        npm install -g live-server
        ```
     2. Run the live server in the project directory:
        ```bash
        live-server
        ```
  

## Using the application

- **City Search**: Enter a city name in the input field and click the "Search" button to fetch weather details.
- **Current Location**: Click the "Use Current Location" button to retrieve weather data based on your current location.
- **Recent Searches**: Use the dropdown menu to select from recently searched cities and view their weather data.

## Error Handling

The application handles potential issues such as:
- Invalid or empty search queries
- API request failures
- Location detection errors
- Displays relevant error messages to users in case of issues.

## Folder Structure

```
Weather-Forecast-App/
├── assets/             # Icons, GIFs, and favicon files
├── index.html          # JavaScript file for handling Weather API calls and output display
├── input.css           # File for custom tailwind configuration
├── output.css          # File genrated by tailwind based on input.css and other custom values
├── tailwind.config.js  # Tailwind CSS configuration file
└── README.md           # Project documentation
```
