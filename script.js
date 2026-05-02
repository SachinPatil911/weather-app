// Weather App - JavaScript
// Uses OpenWeatherMap API

// DOM Elements
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const tempElement = document.getElementById('temp');
const cityElement = document.getElementById('city');
const descriptionElement = document.getElementById('description');
const humidityElement = document.getElementById('humidity');
const windSpeedElement = document.getElementById('windSpeed');
const feelsLikeElement = document.getElementById('feelsLike');
const weatherIconElement = document.getElementById('weatherIcon');
const errorMessage = document.getElementById('errorMessage');
const apiKeyInput = document.getElementById('apiKeyInput');
const saveApiKeyBtn = document.getElementById('saveApiKey');

// API Configuration
let apiKey = localStorage.getItem('weatherApiKey') || '';
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather?units=metric&q=';

// Initialize
if (apiKey) {
    apiKeyInput.value = apiKey;
    apiKeyInput.type = 'password';
}

// Weather Icon Mapping
const weatherIcons = {
    '01d': 'https://cdn-icons-png.flaticon.com/512/869/869869.png',  // clear sky day
    '01n': 'https://cdn-icons-png.flaticon.com/512/869/869860.png',  // clear sky night
    '02d': 'https://cdn-icons-png.flaticon.com/512/866/866489.png',  // few clouds day
    '02n': 'https://cdn-icons-png.flaticon.com/512/866/866506.png',  // few clouds night
    '03d': 'https://cdn-icons-png.flaticon.com/512/865/865775.png',  // scattered clouds
    '03n': 'https://cdn-icons-png.flaticon.com/512/865/865775.png',
    '04d': 'https://cdn-icons-png.flaticon.com/512/865/865812.png',  // broken clouds
    '04n': 'https://cdn-icons-png.flaticon.com/512/865/865812.png',
    '09d': 'https://cdn-icons-png.flaticon.com/512/865/865863.png',  // shower rain
    '09n': 'https://cdn-icons-png.flaticon.com/512/865/865863.png',
    '10d': 'https://cdn-icons-png.flaticon.com/512/865/865835.png',  // rain day
    '10n': 'https://cdn-icons-png.flaticon.com/512/865/865835.png',  // rain night
    '11d': 'https://cdn-icons-png.flaticon.com/512/865/865879.png',  // thunderstorm
    '11n': 'https://cdn-icons-png.flaticon.com/512/865/865879.png',
    '13d': 'https://cdn-icons-png.flaticon.com/512/857/857492.png',  // snow
    '13n': 'https://cdn-icons-png.flaticon.com/512/857/857492.png',
    '50d': 'https://cdn-icons-png.flaticon.com/512/865/865814.png',  // mist
    '50n': 'https://cdn-icons-png.flaticon.com/512/865/865814.png'
};

// Default Icon
const defaultIcon = 'https://cdn-icons-png.flaticon.com/512/869/869869.png';

// Save API Key
saveApiKeyBtn.addEventListener('click', () => {
    const key = apiKeyInput.value.trim();
    if (key) {
        apiKey = key;
        localStorage.setItem('weatherApiKey', key);
        apiKeyInput.type = 'password';
        
        // Show success feedback
        saveApiKeyBtn.textContent = 'Saved!';
        saveApiKeyBtn.style.background = 'linear-gradient(135deg, #66bb6a, #43a047)';
        
        setTimeout(() => {
            saveApiKeyBtn.textContent = 'Save API Key';
            saveApiKeyBtn.style.background = 'linear-gradient(135deg, #4fc3f7, #29b6f6)';
        }, 1500);
    } else {
        showError('Please enter a valid API key');
    }
});

// Fetch Weather Data
async function checkWeather(city) {
    if (!apiKey) {
        showError('Please enter your API key first');
        return;
    }
    
    try {
        const response = await fetch(apiUrl + city + `&appid=${apiKey}`);
        
        if (response.status === 404) {
            showError('City not found. Please try again.');
            return;
        }
        
        if (response.status === 401) {
            showError('Invalid API key. Please check and try again.');
            return;
        }
        
        if (response.status !== 200) {
            showError('Error fetching weather data. Please try again.');
            return;
        }
        
        const data = await response.json();
        updateWeatherUI(data);
        hideError();
        
    } catch (error) {
        console.error('Error:', error);
        showError('Network error. Please check your connection.');
    }
}

// Update UI with Weather Data
function updateWeatherUI(data) {
    // Temperature
    tempElement.textContent = Math.round(data.main.temp) + '°C';
    
    // City Name
    cityElement.textContent = data.name + ', ' + data.sys.country;
    
    // Description
    descriptionElement.textContent = data.weather[0].description;
    
    // Humidity
    humidityElement.textContent = data.main.humidity + '%';
    
    // Wind Speed (convert m/s to km/h)
    const windSpeedKmh = (data.wind.speed * 3.6).toFixed(1);
    windSpeedElement.textContent = windSpeedKmh + ' km/h';
    
    // Feels Like
    feelsLikeElement.textContent = Math.round(data.main.feels_like) + '°C';
    
    // Weather Icon
    const iconCode = data.weather[0].icon;
    weatherIconElement.src = weatherIcons[iconCode] || defaultIcon;
    
    // Remove loading state
    tempElement.classList.remove('loading');
}

// Show Error Message
function showError(message) {
    errorMessage.querySelector('p').textContent = message;
    errorMessage.classList.add('show');
    
    // Auto hide after 3 seconds
    setTimeout(() => {
        hideError();
    }, 3000);
}

// Hide Error Message
function hideError() {
    errorMessage.classList.remove('show');
}

// Event Listeners
searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        checkWeather(city);
    } else {
        showError('Please enter a city name');
    }
});

// Search on Enter key
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const city = cityInput.value.trim();
        if (city) {
            checkWeather(city);
        }
    }
});

// Allow pasting API key
apiKeyInput.addEventListener('click', () => {
    if (apiKeyInput.value === apiKey) {
        apiKeyInput.type = 'text';
    }
});

// Initialize with default search
cityInput.focus();
