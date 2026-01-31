import { useEffect, useState } from 'react';
import './App.css'
import SearchInput from './components/search-input/SearchInput'
import WeatherCard from './components/weather-card/WeatherCard'
import LightDarkSwitch from './components/light-dark-switch/LightDarkSwitch';
import { MinLength } from './utils/validators/MinLength';
import { Pattern } from './utils/validators/Pattern';
import { Required} from './utils/validators/Required';
import { apiKey } from './utils/constants';


function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [theme, setTheme] = useState('dark');
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('weatherHistory');
    return saved ? JSON.parse(saved) : [];
  });
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [weatherError, setWeatherError] = useState(null);
  const [backupLocation, setBackupLocation] = useState(null);
  

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);
  
  useEffect(() => {
    localStorage.setItem('weatherHistory', JSON.stringify(history));
  }, [history]);

  const handleSearchError = (errorMessage) => {
  setWeatherError(errorMessage);
    if (errorMessage) {
      setWeatherData(null); 
    }
  };

  const handleSearchSuccess = (newData) => {
    setWeatherError(null);
    setWeatherData(newData);
    if(newData && newData.name){
      const historyItem = {
        id: `${newData.name}-${Date.now()}`,
        name: newData.name,
        country: newData.sys.country,
        date: new Date().toLocaleString('en-GB', {
          day: '2-digit', month: '2-digit', year: 'numeric',
          hour: '2-digit', minute: '2-digit', hour12: true
        }).replace(/\//g, '-').replace(',', ''),
        lat: newData.coord.lat,
        lon: newData.coord.lon
      };
    
      setHistory(prev => {
        const filtered = prev.filter(item => item.name !== newData.name);
        return [historyItem, ...filtered].slice(0, 10);
      });
    } 
  };

const deleteHistoryItem = (id) => {
  setHistory(prev => prev.filter(item => item.id !== id));
};

const reSearchFromHistory = async (item) => {
  setWeatherError(null);
  setIsSearchLoading(true);
  setWeatherData(null); 

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${item.name},${item.country.toLowerCase()}&units=metric&APPID=${apiKey}`
    );

    const data = await response.json();

    if (data.cod !== 200) {
      throw new Error(data.message || "Something is gone wrong!");
    } else {
       const locationToRestore = {
      displayLabel: `${item.name}, ${item.country}`,
      city: item.name,
      country: item.country
    };
      setBackupLocation(locationToRestore);
      handleSearchSuccess(data);
    }

   
  } catch{
    setWeatherError(err.message);
  } finally {
    setIsSearchLoading(false);
  }
};

 const inputValidators = [
    new Required('Input cannot be empty'),
    new MinLength(2,'Min. 2 characters required'),
    new Pattern( /[a-zA-Z\u00C0-\u017F\s\-'’]+/, 'Invalid characters')
  ];

  return (
    <>
    <LightDarkSwitch theme={theme} onToggle={toggleTheme} />
     <SearchInput
     label="Country"
     placeholder="Insert a country"
     onSearchSuccess={handleSearchSuccess}
     onSearchError={handleSearchError}
     validators={inputValidators}
     theme={theme}
     backupLocation={backupLocation}
    />
    <WeatherCard data={weatherData} 
      theme={theme}
      history={history}
      onDeleteHistory={deleteHistoryItem}
      onReSearch={reSearchFromHistory}
      isLoading={isSearchLoading}
      error={weatherError}
      />
    </>
  )
}

export default App
