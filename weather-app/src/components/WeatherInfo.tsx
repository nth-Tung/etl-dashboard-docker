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
  lang?: 'vi' | 'en'; // Thêm prop lang
}

const LABELS = {
  vi: {
    temperature: 'Nhiệt độ',
    humidity: 'Độ ẩm',
    wind: 'Gió',
  },
  en: {
    temperature: 'Temperature',
    humidity: 'Humidity',
    wind: 'Wind',
  }
};

const WeatherInfo: React.FC<WeatherInfoProps> = ({ weather, loading, error, lang = 'en' }) => {
  if (loading) return <div className="text-blue-500">{lang === 'vi' ? 'Đang tải...' : 'Loading...'}</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!weather) return null;
  const labels = LABELS[lang];
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
        <span>{labels.temperature}: <b>{weather.main.temp}°C</b></span>
        <span>{labels.humidity}: <b>{weather.main.humidity}%</b></span>
        <span>{labels.wind}: <b>{weather.wind.speed} m/s</b></span>
      </div>
    </div>
  );
};

export default WeatherInfo;
