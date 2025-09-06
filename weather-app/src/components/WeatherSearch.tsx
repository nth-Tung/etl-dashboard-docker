import React, { useState, useRef } from 'react';

interface Suggestion {
  name: string;
}

interface WeatherSearchProps {
  onSearch: (location: string) => void;
  suggestions?: Suggestion[];
  placeholder?: string;
  searchBtnText?: string;
}

const WeatherSearch: React.FC<WeatherSearchProps> = ({ onSearch, suggestions = [], placeholder = "Chọn thành phố...", searchBtnText = "Tìm kiếm" }) => {
  const [input, setInput] = useState('');
  const [filtered, setFiltered] = useState<Suggestion[]>(suggestions);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);
    setShowDropdown(true);
    setFiltered(
      suggestions.filter(city => city.name.toLowerCase().includes(value.toLowerCase()))
    );
  };

  const handleSelect = (city: Suggestion) => {
    setInput(city.name);
    setShowDropdown(false);
    onSearch(city.name);
    if (inputRef.current) inputRef.current.blur();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSearch(input.trim());
      setShowDropdown(false);
    }
  };

  return (
    <div className="relative w-full max-w-xs mb-4">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="w-full relative">
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
          {showDropdown && (
            <ul className="absolute z-10 left-0 right-0 bg-white border border-gray-200 rounded shadow mt-1 max-h-56 overflow-y-auto">
              {filtered.length === 0 && (
                <li className="px-4 py-2 text-gray-400">Không có kết quả</li>
              )}
              {filtered.map((city, idx) => (
                <li
                  key={idx}
                  className="px-4 py-2 cursor-pointer hover:bg-blue-100"
                  onMouseDown={e => e.preventDefault()}
                  onClick={() => handleSelect(city)}
                >
                  {city.name}
                </li>
              ))}
            </ul>
          )}
        </div>
        <button
          type="submit"
          className="btn bg-blue-500 text-white px-6 py-2 rounded flex items-center justify-center h-full hover:bg-blue-600 transition whitespace-nowrap min-w-[110px]"
        >
          {searchBtnText}
        </button>
      </form>
    </div>
  );
};

export default WeatherSearch;
