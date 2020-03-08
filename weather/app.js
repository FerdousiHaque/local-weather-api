
// SELECT ELEMENTS
const iconElement = document.querySelector(".weather-icon");
const tempElement = document.querySelector(".temperature-value p");
const descElement = document.querySelector(".temperature-description p");
const locationElement = document.querySelector(".location p");
const notificationElement = document.querySelector(".notification");
const feelsElement = document.querySelector(".feel p");
const maxElement = document.querySelector(".maxtemp p");
const minElement = document.querySelector(".mintemp p");
const pressureElement = document.querySelector(".pressure p");
const humidityElement = document.querySelector(".humidity p");
const windElement = document.querySelector(".wind p");
const sunrElement = document.querySelector(".risesun p");
const sunsElement = document.querySelector(".setsun p");

// App data
const weather = {};

weather.temperature = {
    unit : "celsius"
}

// APP CONSTS AND VARS
const KELVIN = 273;
// API KEY
const key = "82005d27a116c2880c8f0fcb866998a0";

// CHECK IF BROWSER SUPPORTS GEOLOCATION
if('geolocation' in navigator){
    navigator.geolocation.getCurrentPosition(setPosition, showError);
}else{
    notificationElement.style.display = "block";
    notificationElement.innerHTML = "<p>Browser doesn't Support Geolocation</p>";
}

// SET USER'S POSITION
function setPosition(position){
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    
    getWeather(latitude, longitude);
}

// SHOW ERROR WHEN THERE IS AN ISSUE WITH GEOLOCATION SERVICE
function showError(error){
    notificationElement.style.display = "block";
    notificationElement.innerHTML = `<p> ${error.message} </p>`;
}

// GET WEATHER FROM API PROVIDER
function getWeather(latitude, longitude){
    let api = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;
    
    fetch(api)
        .then(function(response){
            let data = response.json();
            return data;
        })
        .then(function(data){
            weather.temperature.value = Math.floor(data.main.temp - KELVIN);
            weather.description = data.weather[0].description;
            weather.iconId = data.weather[0].icon;
            weather.city = data.name;
            weather.country = data.sys.country;
            weather.feels =  Math.floor(data.main.feels_like - KELVIN);
            weather.mintemp = Math.floor(data.main.temp_min - KELVIN);
            weather.maxtemp = Math.floor(data.main.temp_max - KELVIN);
            weather.pressure = data.main.pressure;
            weather.humidity = data.main.humidity;
            weather.wind = data.wind.speed;
            weather.sunrise = data.sys.sunrise;
            weather.sunset = data.sys.sunset;
        })
        .then(function(){
            displayWeather();
        });
}

// DISPLAY WEATHER TO UI
function displayWeather(){
    iconElement.innerHTML = `<img src="icons/${weather.iconId}.png"/>`;
    tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
    descElement.innerHTML = weather.description;
    locationElement.innerHTML = `${weather.city}, ${weather.country}`;
    feelsElement.innerHTML = `${weather.feels}°<span>C</span>`;
    maxElement.innerHTML = `${weather.maxtemp}°<span>C</span>`;
    minElement.innerHTML = `${weather.mintemp}°<span>C</span>`;
    pressureElement.innerHTML = `${weather.pressure}`;
    humidityElement.innerHTML = `${weather.humidity}`;
    windElement.innerHTML = `${weather.wind}`;
    sunrElement.innerHTML = `${weather.sunrise}`;
    sunsElement.innerHTML = `${weather.sunset}`;
}

// C to F conversion
function celsiusToFahrenheit(temperature){
    return (temperature * 9/5) + 32;
}

// WHEN THE USER CLICKS ON THE TEMPERATURE ELEMENET
tempElement.addEventListener("click", function(){
    if(weather.temperature.value === undefined) return;
    
    if(weather.temperature.unit == "celsius"){
        let fahrenheit = celsiusToFahrenheit(weather.temperature.value);
        fahrenheit = Math.floor(fahrenheit);
        
        tempElement.innerHTML = `${fahrenheit}°<span>F</span>`;
        weather.temperature.unit = "fahrenheit";
    }else{
        tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
        weather.temperature.unit = "celsius"
    }
});

