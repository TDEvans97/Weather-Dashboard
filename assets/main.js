// Assign global variables
const APIkey = "6c7f61887c30b6349c82c56d2a97a947"
var citySelector = $('#citySelector');
var cityInput = $('#city');
var searchHistory = $('#past-searches');
var searchBtn = $('.searchBtn')
var currentWeather = $('#currentWeather');
var card = $('#card');
var dailyForecast = $('.dailyForecast');
var historyVal;
var historyArr = [];

// On startup, look for previously searched cities in local storage
let init = function () {
    let localStorageCities = JSON.parse(localStorage.getItem('cities'));
    if (localStorageCities !== null) {
        for (let i = 0; i < localStorageCities.length; i++) {
            let historyBtn = document.createElement('button');
            historyBtn.setAttribute('class', 'btn btn-secondary mb-2 searchBtn');
            historyBtn.setAttribute('style', 'width: 100%; margin: 5px 0 5px 0;');
            historyBtn.setAttribute('type', 'button'); historyBtn.setAttribute('id', localStorageCities[i]);
            historyBtn.textContent = localStorageCities[i];
            searchHistory.append(historyBtn);
            historyArr = localStorageCities;
        }
    }
}

let formSubHandle = function (e) {
    e.preventDefault();

    let cityName = cityInput.val();
    localStorage.setItem('cityName', cityName.toUpperCase());
    if (cityName) {
        getWeatherData(cityName);
    } else {
        alert('Please enter a city');
    };

    // Put this result in the history Arr of local storage to get back on reload
    historyArr.push(cityName);

    localStorage.setItem('cities', JSON.stringify(historyArr));
    // creates buttons for search history
    let historyBtn = document.createElement('button');

    historyBtn.setAttribute('class', 'btn btn-secondary mb-2 searchBtn');
    historyBtn.setAttribute('style', 'width: 100%; margin: 5px 0 5px 0;');
    historyBtn.setAttribute('type', 'button');
    historyBtn.setAttribute('id', cityName);

    historyBtn.textContent = cityName;
    searchHistory.append(historyBtn);
};

let getWeatherData = function (location) {
    let weatherCall = 'https://api.openweathermap.org/data/3.0/onecall?lat=' + location[0].lat + '&lon=' + location[0].lon + '&appid=' + APIkey
    fetch(weatherCall)
        .then(function (response) {
            if (response.ok) {
                response.json().then(
                    displayWeather(data)
                )
            }
            console.error();
        })
};

// Render fetched data to the page
let displayWeather = function (weather) {
    card.empty();
    dailyForecast.empty();
    currentWeather.empty();
    let searchCity = cityInput.val().toUpperCase();
    let weatherIcon = document.createElement('img')
    weatherIcon.setAttribute('src', 'https://openweathermap.org/img/wn/' + weather.current.weather[0].icon + '.png');
    weatherIcon.setAttribute('width', '40');
    let heading = document.createElement('h3');
    heading.textContent = localStorage.getItem('cityName') + ': ' + moment().format('l');
    let temp = document.createElement('span');
    temp.textContent = 'Temp: ' + weather.current.temp + '℉';
    let wind = document.createElement('span');
    wind.textContent = 'Wind: ' + weather.current.wind_speed + "mph";
    let humidity = document.createElement('span');
    humidity.textContent = 'Humidity: ' + weather.current.humidity + '%'
    let uv = document.createElement('span');
    let index = document.createElement('span');
    index.textContent = weather.current.uvi
    if (weather.current.uvi <= 2) {
        index.setAttribute('style', 'background-color: green; padding: 0 10px; border-radius: 4px;')
    } else if (3 <= weather.current.uvi <= 5) {
        index.setAttribute('style', 'background-color: yellow; padding: 0 10px; border-radius: 4px;')
    } else if (5 < weather.current.uvi < 8) {
        index.setAttribute('style', 'background-color: orange; padding: 0 10px; border-radius: 4px;')
    } else if (weather.current.uvi <= 10) {
        index.setAttribute('style', 'background-color: red; padding: 0 10px; border-radius: 4px;')
    }
    uv.textContent = "UV Index: ";
    currentWeather.append(heading, weatherIcon);
    heading.append(weatherIcon);
    currentWeather.append(temp);
    currentWeather.append(wind);
    currentWeather.append(humidity);
    currentWeather.append(uv);
    uv.append(index);
    let unix = weather.daily.sunrise;
    let fiveDay = document.createElement('h4');
    fiveDay.setAttribute('class', 'col-12')
    fiveDay.textContent = "5-Day Forecast:"
    card.append(fiveDay);
    for (let i = 1; i < 6; i++) {
        let dayIconVal = weather.daily[i].weather[0].icon
        let unix = weather.daily[i].sunrise;
        let dayTempVal = weather.daily[i].temp.day;
        let dayWindVal = weather.daily[i].wind_speed;
        let dayHumidityVal = weather.daily[i].humidity;
        let dayCard = document.createElement('div');
        dayCard.setAttribute('style', 'height: 175px; width: 150px; border: solid black 1px; border-radius: 5px; background-color: gray; color: white; margin: 20px; display: flex; flex-direction: column; justify-content: space-between; padding: 5px');
        let dayDate = document.createElement('span'); dayDate.setAttribute('style', 'font-weight: bold; font-size: 1.2rem');
        let dayIcon = document.createElement('img');
        let dayTemp = document.createElement('span');
        let dayWind = document.createElement('span');
        let dayHumidity = document.createElement('span');
        dayDate.textContent = moment.unix(unix).format('l');
        dayIcon.setAttribute('src', 'https://openweathermap.org/img/wn/' + dayIconVal + '.png');
        dayIcon.setAttribute('width', '40');
        dayTemp.textContent = 'Temp: ' + dayTempVal + '℉'
        dayWind.textContent = 'Wind: ' + dayWindVal + 'mph'
        dayHumidity.textContent = 'Humidity: ' + dayHumidityVal + '%'
        card.append(dayCard);
        dayCard.append(dayDate, dayIcon, dayTemp, dayWind, dayHumidity);
    }
}

// Form click event 
citySelector.submit(formSubHandle);

//Get previous searched cities to the fetch
searchHistory.on('click', searchBtn.self, function (e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    historyVal = e.target.textContent.toUpperCase();
    localStorage.setItem('cityName', historyVal);
    if (historyVal) {
        getWeatherData(historyVal);
    }
});

init();