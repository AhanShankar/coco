import Moon from '@/assets/icons/Moon';
import Cloud from "../assets/icons/Cloud";
import Rain from "../assets/icons/Rain";
import Sun from "../assets/icons/Sun";
import { getDayOrNight } from './helper';
import weatherCodeMap from "./weather-code-map.json" with { type: "json" };

const BASE_URL = 'https://api.open-meteo.com/';
const API_ENDPOINT = 'v1/forecast';
const CACHE_TTL = 3 * 60 * 1000; // 3 minutes
let weatherCache: WeatherCache | null = null;

interface WeatherCache {
    data: WeatherData;
    timestamp: number;
}
export interface WeatherData {
    temperature: number;
    condition: string;
    humidity: number;
    windSpeed: number;
    precipitationProbability: number;
}

export enum CurrentParam {
    Temperature2m = "temperature_2m",
    RelativeHumidity2m = "relative_humidity_2m",
    WindSpeed10m = "wind_speed_10m",
    WeatherCode = "weather_code"
}

export enum DailyParam {
    PrecipitationProbabilityMax = "precipitation_probability_max"
}

export interface WeatherOptions {
    latitude: number;
    longitude: number;
    current?: CurrentParam[];
    daily?: DailyParam[];
    timezone?: string;
}
interface weatherResponse {
    current: {
        temperature_2m: number;
        weather_code: number;
        relative_humidity_2m: number;
        wind_speed_10m: number;
    },
    daily: {
        precipitation_probability_max: number[];
    }
}
function getCachedWeather() {
    if (!weatherCache) return null;
    const now = Date.now();
    if (now - weatherCache.timestamp > CACHE_TTL)
        return null;
    return weatherCache.data;
}

export default async function getWeatherData(options: WeatherOptions): Promise<WeatherData> {
    const {
        latitude,
        longitude,
        current,
        daily,
        timezone = 'auto'
    } = options;

    console.log("Fetching weather data for:", options);
    let currentStr, dailyStr;
    if (current)
        currentStr = current.join(',');
    if (daily)
        dailyStr = daily.join(',');

    const url = `${BASE_URL}${API_ENDPOINT}?latitude=${latitude}&longitude=${longitude}&current=${currentStr}&daily=${dailyStr}&timezone=${timezone}`;
    const response = await fetch(url);
    const data: weatherResponse = await response.json();
    const cachedWeather = getCachedWeather();

    if (cachedWeather) {
        console.log("Using cached weather data");
        return cachedWeather;
    }

    const weather: WeatherData = {
        temperature: data.current.temperature_2m,
        condition: weatherCodeMap[String(data.current.weather_code) as keyof typeof weatherCodeMap] || 'Unknown',
        humidity: data.current.relative_humidity_2m,
        windSpeed: data.current.wind_speed_10m,
        precipitationProbability: data.daily.precipitation_probability_max?.[0] ?? 0
    };
    weatherCache = { data: weather, timestamp: Date.now() };
    return weather;
}

export function getWeatherIcon(condition: string, height: number, width: number): React.JSX.Element {
    if (condition.includes("Cloud"))
        return <Cloud height={height} width={width} />;
    if (condition.includes("Rain"))
        return <Rain height={height} width={width} />;
    if (condition.includes("Clear")) {
        const time = getDayOrNight()
        if (time === "day")
            return <Sun height={height} width={width} />;
        return <Moon height={height} width={width} />;
    }
    return <></>;
}
