//WHEN I search for a city
//THEN I am presented with current and future conditions for that city and that city is added to the search history
var apiKey = 'd55facad5001a93beede25d1ef653239';

function weatherByCityName(cityName) {
return fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=imperial`)
.then(function(response) {return response.json()})
.then(function(data) {
    console.log(data)
    addCityToHistory(data.name, data.coord.lon, data.coord.lat)
    return fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${data.coord.lat}&lon=${data.coord.lon}&appid=${apiKey}&units=imperial`)
})
.then(function(response) {return response.json()})
.then(function(data) {return data});

}

weatherByCityName('Baltimore').then(function(response) {console.log(response)})

function addCityToHistory(cityName, lon, lat) {
    var item = localStorage.getItem('history');
    var currentHistory = item === null ? []  : JSON.parse(item)

currentHistory.push({cityName: cityName, lon: lon, lat: lat})
localStorage.setItem('history', JSON.stringify(currentHistory))
}

function searchButtonHandler() {
    
  var city = searchInputEl.value.trim()
  weatherByCityName(city).then(function(response) {
      console.log(response)
    setTodaysWeather(response, city);
    })

}

var searchInputEl = document.querySelector("#enter-city");
//WHEN I view current weather conditions for that city
//THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index
var todaysWeatherElId = "#today-weather";

function setTodaysWeather(weatherData, city) {

    document.querySelector('#city-name').innerHTML = `${city} (${new Date().toDateString()})`;
    document.querySelector("#current-pic").src=`http://openweathermap.org/img/w/${weatherData.current.weather[0].icon}.png`;
    document.querySelector('#temperature').innerHTML  = weatherData.current.temp;
    document.querySelector('#humidity').innerHTML  = weatherData.current.humidity;
    document.querySelector('#wind-speed').innerHTML  = weatherData.current.wind_speed;
    debugger;
    var uvi = parseFloat(weatherData.current.uvi)
    var uvColor = 'bg-success'
    if (uvi <= 2) {
        uvColor = 'bg-success'
    }
    
    else if (uvi > 2 && uvi < 5) {
        uvColor = 'bg-warning'
    }

    else {
        uvColor = 'bg-danger'

    }


    document.querySelector('#uv-index').innerHTML  = `<span class="badge ${uvColor}">${weatherData.current.uvi}</span>`;


}


//WHEN I view the UV index
//THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe





//WHEN I view future weather conditions for that city
//THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity








//WHEN I click on a city in the search history
//THEN I am again presented with current and future conditions for that city//