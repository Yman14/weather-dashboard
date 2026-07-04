import { getWeather } from "./api.js";
import {type WeatherResponse } from "./weatherInterface.js";

const cities = [
  "Manila",
  "Tokyo",
  "Singapore",
  "London",
  "New York",
  "Sydney"
];


const rawContainer = document.querySelector<HTMLDivElement>("#weather-container");
const refreshBtn = document.querySelector<HTMLButtonElement>("#refresh-btn");

if(!rawContainer){
    throw new Error("weather container missing");
    
}
if (!refreshBtn) {
    throw new Error("Refresh button missing.");
}

const weatherContainer = rawContainer;
window.addEventListener("load", loadWeather);
refreshBtn.addEventListener("click", loadWeather);




async function loadWeather() {
    try {
        showLoading();

        const promises = cities.map(city => getWeather(city));
        const results = await Promise.allSettled(promises);
        
        weatherContainer.innerHTML = "";

        // results.forEach((result, i) => {
        //     if(result.status === "fulfilled"){
        //         renderWeather(result.value);
        //     } else {
        //         renderError(cities[i] ?? "Unknown City");
        //     }
        // });
        const html = results
            .map((result, index) => 
                result.status === "fulfilled" 
                    ? createWeatherCard(result.value)
                    : createErrorCard(cities[index] ?? "Uknown city")
            )
            .join("");
        weatherContainer.innerHTML = html;


    } catch(error) {
        console.error(error);
        weatherContainer.innerHTML =`
            <p class="fatal-error">
                something went wrong.
            </p>
        `;
    }
    
}

function showLoading() {
    weatherContainer.innerHTML = "";

    cities.forEach(city => {
        weatherContainer.innerHTML += `
            <div class="card loading">
                <div class="spinner"></div>
                Loading ${city}...
            </div>
        `;
    });

}

function createWeatherCard(data: WeatherResponse): string {
    const weatherClass = getWeatherClass(data.current.condition.text);
    return `
        <div class="card ${weatherClass}">
            <h2>${data.location.name}</h2>
            <p>${data.location.localtime}</p>
            <img src="${data.current.condition.icon}" alt="${data.current.condition.text}">
            <h3>${data.current.temp_c}°C</h3>
            <p>${data.current.condition.text}</p>
             <p>Humidity: ${data.current.humidity}%</p>
            <p>Wind: ${data.current.wind_kph} kph</p>
        </div>
    `;
}
function createErrorCard(city: string): string {
    return `
        <div class="card error">
            <h2>${city}</h2>
            <p>Unable to load weather.</p>
        </div>
    `;
}

function renderWeather(data: WeatherResponse) {
    const weatherClass = getWeatherClass(data.current.condition.text);
    weatherContainer.innerHTML += `
        <div class="card ${weatherClass}">
            <h2>${data.location.name}</h2>
            <p>${data.location.localtime}</p>
            <img src="${data.current.condition.icon}" alt="${data.current.condition.text}">
            <h3>${data.current.temp_c}°C</h3>
            <p>${data.current.condition.text}</p>
             <p>Humidity: ${data.current.humidity}%</p>
            <p>Wind: ${data.current.wind_kph} kph</p>
        </div>
    `;
}

function renderError(city: string){
    weatherContainer.innerHTML += `
        <div class="card error">
            <h2>${city}</h2>
            <p>Unable to load weather.</p>
        </div>
    `;
}

//card color
function getWeatherClass(condition: string): string {
    const text = condition.toLowerCase();

    if (["sun", "clear", "fair"].some(k => text.includes(k))) {
        return "sunny";
    }

    if (["rain", "drizzle", "shower", "thunderstorm", "sleet"].some(k => text.includes(k))) {
        return "rain";
    }

    if (["cloud", "overcast", "mist", "fog", "haze"].some(k => text.includes(k))) {
        return "cloudy";
    }

    return "default-weather";
}