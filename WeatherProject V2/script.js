// API keys - REPLACE THESE WITH YOUR OWN KEYS
const UNSPLASH_KEY = '_xqkOS4mp0b2MfkW6Y17lLqJR0uXwJWZkKpoqHQb8l8';
const WEATHER_API_KEY = 'fc6cac987215470ab37154414251104';

// DOM elements
const searchButton = document.getElementById('searchButton');
const locationInput = document.getElementById('locationInput');


// Event listeners
searchButton.addEventListener('click', getWeather);
locationInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        getWeather();
    }
});

async function getWeather() {
    const location = locationInput.value.trim();
    if (!location) {
        alert('Please enter a location');
        return;
    }
    
    try {
        // First get the background image
        await setLocationBackground(location);
        
        // Then get weather data
        const weatherData = await fetchWeatherData(location);
        displayWeather(weatherData);
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to get weather data. Please try again.');
    }
}

async function setLocationBackground(location) {
    const randomPage = Math.floor(Math.random() * 5) + 1; // Random page between 1-5
    const timestamp = new Date().getTime(); // Prevent caching
    
    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(location)}&client_id=${UNSPLASH_KEY}&orientation=landscape&per_page=10&page=${randomPage}&${timestamp}`;
    
    
    
    try {
        const response = await fetch(url);
        const data = await response.json();

        console.log('API Response of Wallpaper :', data); // Before error checking 

        if (data.results && data.results.length > 0) {
            // Select a random image from the results
            const randomIndex = Math.floor(Math.random() * Math.min(data.results.length, 5));
            console.log(randomIndex);
            const selectedImage = data.results[randomIndex];
             // Create a temporary image to check dimensions
             const img = new Image();
             img.src = selectedImage.urls.full;
             
             img.onload = function() {
                 // Calculate the ideal display size
                 const windowRatio = window.innerWidth / window.innerHeight;
                 const imageRatio = img.width / img.height;
                 
                 // Apply optimized background styles
                 document.body.style.backgroundImage = `url(${selectedImage.urls.full})`;
                 document.body.style.backgroundSize = imageRatio > windowRatio ? "auto 100%" : "100% auto";
                 document.body.style.backgroundRepeat = "no-repeat";
                 document.body.style.backgroundPosition = "center center";
                 document.body.style.backgroundAttachment = "fixed";
                 document.body.style.imageRendering = "-webkit-optimize-contrast"; // For pixel perfection
                 document.body.style.imageRendering = "crisp-edges"; // Standard property
                 document.body.style.backfaceVisibility = "hidden";
             }
            
        } else {
            document.body.style.backgroundImage = 'url(https://images.unsplash.com/photo-1499002238440-d264edd596ec?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80)';
        }
    } catch (error) {
        console.error("Error fetching background:", error);
        document.body.style.backgroundImage = 'url(https://images.unsplash.com/photo-1499002238440-d264edd596ec?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80)';
    }

}

async function fetchWeatherData(location) {

    const url = `https://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${encodeURIComponent(location)}`;
    
    const response = await fetch(url);
    const data = await response.json();

    console.log('API Response of weather based on Location :', data); // Before error checking 
    
    if (data.error) {
        throw new Error(data.error.message || 'Weather data not available');
    }
    
    return data;
}

function displayWeather(data) {
     // Add null checks in case API structure changes
     const current = data.current || {};
     const condition = current.condition || {};
     
     document.getElementById('temperature').textContent = `${current.temp_c ?? '--'}°C`;
     document.getElementById('weatherDescription').textContent = condition.text || 'N/A';
     document.getElementById('humidity').textContent = `${current.humidity ?? '--'}%`;
     document.getElementById('wind').textContent = `${current.wind_kph ?? '--'} km/h`;
     document.getElementById('feelsLike').textContent = `${current.feelslike_c ?? '--'}°C`;
}