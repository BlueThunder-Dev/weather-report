## Weather Report
Weather Report is a high-performance, responsive dashboard where the user can search for a specified location the weather conditions in real time

## Key Features
# 1. Intelligent Search
Predictive Suggestion Engine: Powered by the SuggestionCombobox component, offering real-time city filtering.

# 2. Dual-Engine Theming (Light/Dark)

Dynamic Visuals: The UI shifts between a "Golden Hour" light mode and a "Deep Space" dark mode, utilizing a centralized CSS Variable system for consistency.

Accessible Toggle: The LightDarkSwitch is fully ARIA-compliant, providing screen readers with accurate state information.

# 3. Weather Intelligence Display
Real-Time Metrics: Instant access to temperature, weather conditions, and atmospheric data.

Smooth Transitions: Integrated LoadingSpinner with dynamic scaling logic ensures a polished feel during data fetching.

## Configuration & API Setup
For security reasons, API keys are managed through environment variables.

Get a Key: Register at OpenWeatherMap to receive an API Key.

Create .env: In the root directory, create a .env file.

Add your Key:

Code Snippet:
VITE_WEATHER_API_KEY=your_actual_api_key_here
Reviewer Note: For convenience during the technical assessment, a temporary .env file has been included in the ZIP package. In a production workflow, this file is excluded via .gitignore.

## Installation & Usage
Bash
# 1. Install dependencies
npm install

# 2. Run the development server
npm run dev

# 3. Execute all unit tests
npm run test

# 4. Build for production
npm run build

## Author
Pierpaolo Corsale - Technical Assessment Project - 1 February 2026
