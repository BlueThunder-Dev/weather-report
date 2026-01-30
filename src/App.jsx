import { useEffect, useState } from 'react';
import './App.css'
import SearchInput from './components/search-input/SearchInput'
import WeatherCard from './components/weather-card/WeatherCard'
import { MinLength } from './utils/validators/MinLength';
import { Pattern } from './utils/validators/Pattern';
import { Required} from './utils/validators/Required';

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [history, setHistory] = useState(() => {
    // 1. Inizializzazione sicura: legge dal disco o parte vuoto
    const saved = localStorage.getItem('weatherHistory');
    return saved ? JSON.parse(saved) : [];
  });

  // 2. Persistenza Automatica
  useEffect(() => {
    localStorage.setItem('weatherHistory', JSON.stringify(history));
  }, [history]); // Esegue il salvataggio ogni volta che aggiungi o elimini

  const handleWeatherUpdate = (data) => {
    setWeatherData(data);
  }; 

  const handleSearchSuccess = (newData) => {
    setWeatherData(newData);
    
    const historyItem = {
      id: `${newData.name}-${Date.now()}`, // ID più robusto
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
      // Rimuoviamo eventuali duplicati della stessa città per portarla in cima
      const filtered = prev.filter(item => item.name !== newData.name);
      return [historyItem, ...filtered].slice(0, 10);
    });
  };

 // Elimina record
const deleteHistoryItem = (id) => {
  setHistory(prev => prev.filter(item => item.id !== id));
};

const reSearchFromHistory = async (item) => {
  try {
    const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${item.city},${item.country.toLowerCase()}&units=metric&APPID=${apiKey}`
    );
    const data = await response.json();
    setWeatherData(data);
  } catch (err) {
    console.error("Failed to re-fetch", err);
  }
};
 const inputValidators = [
    new Required('Input cannot be empty'),
    new MinLength(2,'Min. 2 characters required'),
    new Pattern( /[a-zA-Z\u00C0-\u017F\s\-\'’]+/, 'Invalid characters')
  ];

  return (
    <>
     <SearchInput
     label="Country"
     placeholder="Insert a country"
     onSearchSuccess={handleWeatherUpdate}
     validators={inputValidators}
    />
    {weatherData && <WeatherCard data={weatherData} 
      history={history}
      onDeleteHistory={deleteHistoryItem}
      onReSearch={reSearchFromHistory}/>}
    </>
  )
}

export default App
