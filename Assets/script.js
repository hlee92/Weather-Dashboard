//WHEN I search for a city
//THEN I am presented with current and future conditions for that city and that city is added to the search history
var apiKey = 'd55facad5001a93beede25d1ef653239';

function weatherByCityName(cityName) {
    return fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=imperial`)
        .then(function (response) { return response.json() })
        .then(function (data) {
            console.log(data)
            addCityToHistory(data.name, data.coord.lon, data.coord.lat)
            return fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${data.coord.lat}&lon=${data.coord.lon}&appid=${apiKey}&units=imperial`)
        })
        .then(function (response) { return response.json() })
        .then(function (data) { return data });

}

function addCityToHistory(cityName, lon, lat) {
    var item = localStorage.getItem('history');
    var currentHistory = item === null ? [] : JSON.parse(item)

    currentHistory.push({ cityName: cityName, lon: lon, lat: lat })
    localStorage.setItem('history', JSON.stringify(currentHistory))
    createHistoryList();
}

function createHistoryList() {
    var item = localStorage.getItem('history');
    var currentHistory = item === null ? [] : JSON.parse(item)
    var listItems = "";
    for (var i = 0; i < currentHistory.length; i++) {
        listItems += `<a href="#" data-history-index="${i}" class="list-group-item historyItem list-group-item-action">${currentHistory[i].cityName}</a>`

    }
    document.querySelector("#history").innerHTML = listItems;
}

document.addEventListener("click", function (event) {
    if (event.target.classList.contains('historyItem')) {
        weatherByCityName(event.target.innerHTML).then(function (response) {
            console.log(response)
            setDisplayedWeather(response, event.target.innerHTML);
        })
    }
});

createHistoryList();


function searchButtonHandler() {

    var city = searchInputEl.value.trim()
    weatherByCityName(city).then(function (response) {
        console.log(response)
        setDisplayedWeather(response, city);
    })

}

function clearHistory() {
    localStorage.removeItem('history')
    createHistoryList();
}

var searchInputEl = document.querySelector("#enter-city");


//WHEN I view current weather conditions for that city
//THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index
var todaysWeatherElId = "#today-weather";

function setDisplayedWeather(weatherData, city) {

    document.querySelector('#city-name').innerHTML = `${city} (${new Date(weatherData.current.dt * 1000).toDateString()})`;
    document.querySelector("#current-pic").src = `http://openweathermap.org/img/w/${weatherData.current.weather[0].icon}.png`;
    document.querySelector('#temperature').innerHTML = weatherData.current.temp;
    document.querySelector('#humidity').innerHTML = weatherData.current.humidity;
    document.querySelector('#wind-speed').innerHTML = weatherData.current.wind_speed;

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

    document.querySelector('#uv-index').innerHTML = `<span class="badge ${uvColor}">${weatherData.current.uvi}</span>`;
    var fivedayitems = ""
    for (var i = 0; i < 5; i++) {
        fivedayitems += ` <div class="col-md-2 forecast bg-primary text-white m-2 rounded">
        <div>${new Date(weatherData.daily[i].dt * 1000).toDateString()}</div>
        <img src="http://openweathermap.org/img/w/${weatherData.daily[i].weather[0].icon}.png" alt="">
        <div>Temp: <span>${weatherData.daily[i].temp.day}</span></div>
        <div>Humidity: <span>${weatherData.daily[i].humidity}</span></div>
        <div>Wind Speed: <span>${weatherData.daily[i].wind_speed}</span></div>
        </div>`

    }
    document.querySelector("#fivedayrows").innerHTML = fivedayitems
}