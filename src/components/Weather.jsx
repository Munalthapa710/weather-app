import React, { useEffect, useRef, useState } from 'react'
import './Weather.css'
import search_icon from '../assets/search.png'
import clear_icon from '../assets/clear.png'
import cloud_icon from '../assets/cloud.png'
import drizzle_icon from '../assets/dizzle.png'
import humidity_icon from '../assets/humidity.png'
import rain_icon from '../assets/rain.png'
import snow_icon from '../assets/snowy.png'
import wind_icon from '../assets/wind.png'


const Weather = () => {

  const inputRef = useRef() /*Creates a reference to the input element allow reading without re-render*/ 
  const[WeatherData, setWeatherData]= useState(false); 
  
  {/*WeatherData stores weather info
     setWeatherData updates weather info
     Initial value = false*/ }

  const allIcons={
    "01d":clear_icon,
    "01n": clear_icon,
    "02d" : cloud_icon,
    "02n": cloud_icon,
    "03d" : cloud_icon,
    "03n": cloud_icon,
    "04d" : drizzle_icon,
    "04n": drizzle_icon,
    "09d":rain_icon,
    "09n": rain_icon,
    "010d" : rain_icon,
    "010n": rain_icon,
    "013d": snow_icon,
    "013n": snow_icon,
  }

  const search =async(city)=>{
    if(city === ""){
      alert("Enter city name!")
      return;
    }
    try{
      const url=`https://api.openweathermap.org/data/2.5/weather?q=
      ${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;
      const response =await fetch(url); /*Sends request to OpenWeather API and Waits for server response */
      const data =await response.json(); /*Converts response to JavaScript object */
      
      if (!response.ok){ /*Handle api like if city not found or invalid api */
        alert(data.message);
        return;
      }
      console.log(data); /*for debugging */
      
      const icon = allIcons[data.weather[0].icon] || clear_icon; /*read icon and match all and fallback if not found */
     
      /*Updates state → triggers re-render and extract all*/
      setWeatherData({
        humidity:data.main.humidity,
        windspeed:data.wind.speed,
        temperature:Math.floor(data.main.temp),
        location:data.name,
        icon: icon
      })
      
    }catch(error){ /*Handles network or unexpected errors*/
setWeatherData(false);
console.error("Error in fetching data")
    }
  }
  useEffect(()=>{ /*Runs once when component mounts || deafult city*/
   search("Kathmandu");
  },[])
  /*render part */
  return (
    <div className='weather'> 
      <div className="search-bar">
        <input ref={inputRef} type="text" placeholder='Search' /> 
        <img src={search_icon} alt="" onClick={()=> search(inputRef.current.value)}/>
      </div>
      {WeatherData?<>
      <img src={WeatherData.icon} alt="" className='weather-icon' />
      <p className='temperature'>{WeatherData.temperature}°C</p>
      <p className='location'>{WeatherData.location}</p>
      <div className="weather-data">
        <div className="col">
          <img src={humidity_icon} alt="" />
          <div>
            <p>{WeatherData.humidity}%</p>
            <span>
              Humidity
            </span>
          </div>
        </div>

        <div className="col">
          <img src={wind_icon} alt="" />
          <div>
            <p>{WeatherData.windspeed}km/hr</p>
            <span>
              Wind Speed
            </span>
          </div>
        </div>
      </div>
      </>:<></>}
    </div>
  )
}

export default Weather
