
# Weather App (Next.js)

This is a simple one-page weather web app built with Next.js, TypeScript, Tailwind CSS, and ESLint. Features:

- Location search box
- Displays weather information for the searched location
- Embeds a visualization chart from Apache Superset

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Run the development server:**
   ```bash
   npm run dev
   ```
3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Customization
- Update the Superset embed URL in the main page to point to your chart/dashboard.
- Weather data is fetched from a public API (e.g., OpenWeatherMap). You may need to add your API key in the code or as an environment variable.

## Project Structure
- `src/app/` - Main Next.js app code
- `src/components/` - React components
- `src/styles/` - Tailwind and global styles

## License
MIT
