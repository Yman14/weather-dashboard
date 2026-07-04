const API_KEY = "6723b65d04a3408396e82505260407";

const BASE_URL = "https://api.weatherapi.com/v1/current.json";

export async function getWeather(city: string) {
    try {
        const response = await fetch(
            `${BASE_URL}?key=${API_KEY}&q=${city}`
        );

        if (!response.ok) {
            throw new Error("Unable to fetch weather.");
        }

        return await response.json();
    } catch(error) {
        console.error(error);
        throw new Error(`Failed to load ${city}`);
    }
}