import weatherCodeMap from "./weather-code-map.json" with { type: "json" };
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

const BASE_URL = 'https://api.open-meteo.com/';
const API_ENDPOINT = 'v1/forecast';

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
    const data = await response.json();

    return {
        temperature: data.current.temperature_2m,
        condition: weatherCodeMap[String(data.current.weather_code) as keyof typeof weatherCodeMap] || 'Unknown',
        humidity: data.current.relative_humidity_2m,
        windSpeed: data.current.wind_speed_10m,
        precipitationProbability: data.daily.precipitation_probability_max?.[0] ?? 0
    };
}
