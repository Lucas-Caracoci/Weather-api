import { api } from "../lib/axios";

const apiKey = import.meta.env.VITE_API_KEY;

export async function getInfoWeather(cidade) {
    const response = await api.get(`https://api.openweathermap.org/data/2.5/weather?q=${cidade}&lang=pt_br&appid=${apiKey}`);

    return response
}