import React from 'react';

interface WeatherInfoProps {
  weather: {
    name: string;
    main: { temp: number; humidity: number };
    weather: { description: string; icon: string }[];
    wind: { speed: number };
  } | null;
  loading: boolean;
  error: string | null;
}

const WeatherInfo: React.FC<WeatherInfoProps> = ({ weather, loading, error }) => {
  if (loading) return <div className="text-blue-500">Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!weather) return null;

  return (
    <div className="bg-white rounded shadow p-4 mb-6 w-full max-w-md mx-auto">
      <div className="flex items-center gap-4 mb-2">
        <img
          src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
          alt={weather.weather[0].description}
          className="w-16 h-16"
        />
        <div>
          <h2 className="text-xl font-bold">{weather.name}</h2>
          <p className="capitalize text-gray-600">{weather.weather[0].description}</p>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <span>Temperature: <b>{weather.main.temp}°C</b></span>
        <span>Humidity: <b>{weather.main.humidity}%</b></span>
        <span>Wind: <b>{weather.wind.speed} m/s</b></span>
      </div>
    </div>
  );
};

export default WeatherInfo;
