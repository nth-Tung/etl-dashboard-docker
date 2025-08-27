"use client";
import React, { useState } from "react";
import WeatherSearch from "../components/WeatherSearch";
import WeatherInfo from "../components/WeatherInfo";
import SupersetEmbed from "../components/SupersetEmbed";


const SUPERSET_EMBED_URL = "http://localhost:8088/superset/explore/?form_data=%7B%7D"; // Update this to your chart/dashboard

const LANGUAGES = {
  vi: {
    title: "Bảng điều khiển thời tiết",
    searchPlaceholder: "Nhập địa điểm...",
    searchBtn: "Tìm kiếm",
    loading: "Đang tải...",
    notFound: "Không tìm thấy địa điểm",
    error: "Lỗi lấy dữ liệu thời tiết"
  },
  en: {
    title: "Weather Dashboard",
    searchPlaceholder: "Enter location...",
    searchBtn: "Search",
    loading: "Loading...",
    notFound: "Location not found",
    error: "Error fetching weather"
  }
};



export default function Home() {
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Danh sách cứng các thành phố lớn Việt Nam (giống pipeline)
  const CITY_SUGGESTIONS = [
    { name: "Ha Noi" },
    { name: "Ho Chi Minh" },
    { name: "Da Nang" },
    { name: "Hai Phong" },
    { name: "Can Tho" },
    { name: "Nha Trang" },
    { name: "Hue" },
    { name: "Vung Tau" },
    { name: "Bien Hoa" },
    { name: "Buon Ma Thuot" }
  ];
  const [suggestions, setSuggestions] = useState<any[]>(CITY_SUGGESTIONS);
  const [searching, setSearching] = useState(false);
  const [lang, setLang] = useState<'vi' | 'en'>('en');

  // Gợi ý location bằng filter local
  const handleSuggest = (query: string) => {
    if (!query) {
      setSuggestions(CITY_SUGGESTIONS);
      return;
    }
    setSearching(true);
    setTimeout(() => {
      setSuggestions(
        CITY_SUGGESTIONS.filter(city =>
          city.name.toLowerCase().includes(query.toLowerCase())
        )
      );
      setSearching(false);
    }, 100);
  };

  // Khi chọn location từ gợi ý hoặc nhập đúng tên
  const handleSearch = async (location: string) => {
    setLoading(true);
    setError(null);
    setWeather(null);
    try {
      const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY || "c7c9b5c93d52cf6d6d0204e1e58df0de";
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&appid=${apiKey}&units=metric&lang=${lang}`
      );
      if (!res.ok) throw new Error(LANGUAGES[lang].notFound);
      const data = await res.json();
      setWeather(data);
    } catch (err: any) {
      setError(err.message || LANGUAGES[lang].error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 flex flex-col items-center py-10 px-4">
      <div className="flex justify-end w-full max-w-2xl mb-2">
        <button
          className={`px-3 py-1 rounded-l ${lang === 'en' ? 'bg-blue-500 text-white' : 'bg-white text-blue-500 border border-blue-500'}`}
          onClick={() => setLang('en')}
        >EN</button>
        <button
          className={`px-3 py-1 rounded-r ${lang === 'vi' ? 'bg-blue-500 text-white' : 'bg-white text-blue-500 border border-blue-500'}`}
          onClick={() => setLang('vi')}
        >VI</button>
      </div>
      <h1 className="text-3xl font-bold mb-6 text-blue-800">{LANGUAGES[lang].title}</h1>
      <WeatherSearch
        onSearch={handleSearch}
        onSuggest={handleSuggest}
        suggestions={suggestions}
        searching={searching}
        placeholder={LANGUAGES[lang].searchPlaceholder}
        searchBtnText={LANGUAGES[lang].searchBtn}
      />
      <WeatherInfo weather={weather} loading={loading} error={error} />
      <SupersetEmbed src={SUPERSET_EMBED_URL} />
    </div>
  );
}
