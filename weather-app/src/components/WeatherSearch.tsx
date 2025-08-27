import React, { useState, useEffect, useRef } from 'react';

interface Suggestion {
  name: string;
  country?: string;
  state?: string;
  lat?: number;
  lon?: number;
}

interface WeatherSearchProps {
  onSearch: (location: string) => void;
  onSuggest?: (query: string) => void;
  suggestions?: Suggestion[];
  searching?: boolean;
  placeholder?: string;
  searchBtnText?: string;
}

const WeatherSearch: React.FC<WeatherSearchProps> = ({ onSearch, onSuggest, suggestions = [], searching = false, placeholder = "Enter location...", searchBtnText = "Search" }) => {
  const [input, setInput] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (onSuggest) {
      const timeout = setTimeout(() => {
        if (input.trim()) onSuggest(input.trim());
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [input, onSuggest]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSearch(input.trim());
      setShowDropdown(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    setShowDropdown(true);
  };

  const handleSuggestionClick = (s: Suggestion) => {
    const loc = s.state ? `${s.name}, ${s.state}, ${s.country}` : `${s.name}, ${s.country}`;
    setInput(loc);
    setShowDropdown(false);
    setTimeout(() => onSearch(loc), 100); // Đảm bảo click không bị giật
    if (inputRef.current) inputRef.current.blur();
  };

  // Đóng dropdown khi click ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full max-w-xs mb-4">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          className="input input-bordered w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder={placeholder}
          value={input}
          onChange={handleInputChange}
          autoComplete="off"
          onFocus={() => setShowDropdown(true)}
        />
        <button
          type="submit"
          className="btn bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          {searchBtnText}
        </button>
      </form>
      {showDropdown && suggestions.length > 0 && (
        <ul ref={dropdownRef} className="absolute z-10 left-0 right-0 bg-white border border-gray-200 rounded shadow mt-1 max-h-56 overflow-y-auto">
          {searching && (
            <li className="px-4 py-2 text-gray-400">Loading...</li>
          )}
          {suggestions.map((s, idx) => (
            <li
              key={idx}
              className="px-4 py-2 cursor-pointer hover:bg-blue-100"
              onMouseDown={e => e.preventDefault()}
              onClick={() => handleSuggestionClick(s)}
            >
              {s.name}
              {s.state ? `, ${s.state}` : ''}
              {s.country ? `, ${s.country}` : ''}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default WeatherSearch;
