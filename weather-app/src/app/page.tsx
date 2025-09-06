"use client";
import React, { useState } from "react";
import WeatherSearch from "../components/WeatherSearch";
import WeatherInfo from "../components/WeatherInfo";
import MetabaseEmbed from "../components/MetabaseEmbed";
import Head from "next/head";


const METABASE_EMBED_URL = "http://localhost:3001/public/dashboard/0dac7688-ec78-446a-9206-7dc056ab5c98"; // Thay bằng link public dashboard của bạn

const LANGUAGES = {
  vi: {
    title: "Weather Dashboard",
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

  const handleSearch = async (location: string) => {
    setLoading(true);
    setError(null);
    setWeather(null);
    try {
      const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY || "your_api_key_here";
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
    <>
      <Head>
        <title>Weather Dashboard</title>
      </Head>
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
          suggestions={suggestions}
          placeholder={LANGUAGES[lang].searchPlaceholder}
          searchBtnText={LANGUAGES[lang].searchBtn}
        />
        <WeatherInfo weather={weather} loading={loading} error={error} />
        <MetabaseEmbed src={METABASE_EMBED_URL} />
      </div>
    </>
  );
}
