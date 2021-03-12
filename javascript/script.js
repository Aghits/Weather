let weatherApi = '';

let weatherBaseEndpoint = 'https://api.openweathermap.org/data/2.5/weather?units=metric&appid=' + weatherApi
let forecastBaseEndPoint = 'https://api.openweathermap.org/data/2.5/forecast?units=metric&appid=' + weatherApi
let cityBaseEndPoint = 'https://api.teleport.org/api/cities/?search=';

let searchInput = document.querySelector('.weathersearch')
let city = document.querySelector('.weathercity')
let day = document.querySelector('.weatherday')
let humidity = document.querySelector('.weatherindicatorhumidity>.value')
let wind = document.querySelector('.weatherindicatorwind>.value')
let pressure = document.querySelector('.weatherindicatorpressure>.value')
let img = document.querySelector('.weatherimg')
let temperature = document.querySelector('.weathertemperature>.value')
let forecastBlock = document.querySelector('.weatherforecast')
let suggestions = document.querySelector('#suggestions');

let weatherImages = [
    {
        url: 'images/clear-sky.png',
        id: [800]
    },
    {
        url: 'images/broken-clouds.png',
        id: [803, 804]
    },
    {
        url: 'images/few-clouds.png',
        id: [801]
    },
    {
        url: 'images/mist.png',
        id: [701, 711, 721, 731, 721, 741, 761, 771, 781]
    },
    {
        url: 'images/rain.png',
        id: [500, 501, 502, 503, 504]
    },
    {
        url: 'images/scattered-clouds.png',
        id: [802]
    }, 
    {
        url: 'images/shower-rain.png',
        id: [521, 521, 522, 531, 300, 301, 302, 310, 311, 312, 313, 314, 321]
    }, 
    {
        url: 'images/snow.png',
        id: [511, 600, 601, 602, 611, 612, 613, 615, 616, 621, 622]
    }, 
    {
        url: 'images/thunderstrom.png',
        id: [200, 201, 202, 210, 211, 212, 221, 230, 231, 232]
    }
]

let getWeatherByCityName = async (city) => {
    let endpoint = weatherBaseEndpoint + '&q=' + city;
    let response = await fetch(endpoint);
    let weather = await response.json();
    console.log(weather);
    return weather;
}

let getForecastByCityId = async (id) => {
    let endpoint = forecastBaseEndPoint + '&id=' + id;
    let result = await fetch(endpoint);
    let forecast = await result.json();
    let forecastList = forecast.list;
    let daily = [];

    forecastList.forEach(day => {
        let date = new Date(day.dt_txt.replace(' ', "T"));
        let hours = date.getHours();
        if ( hours === 12 ) {
            daily.push(day);
        }
    })

    return daily;
}

searchInput.addEventListener('keydown', async (e) => {
    if(e.keyCode === 13) {
        let weather = await getWeatherByCityName(searchInput.value);
        let cityID = weather.id;
        updateCurrentWeather(weather);
        let forecast = await getForecastByCityId(cityID);
        updateForecast(forecast)
    }
})

/*searchInput.addEventListener('input', async () => {
    let endpoint = cityBaseEndPoint + searchInput.value;
    let result = await (await fetch(endpoint)).json();
    suggestions.innerHTML = '';
    let cities = result._embedded['city:search-results'];
    let length = cities.length > 5 ? 5 : cities.length;
    for( let i = 0; i < length; i++ ) {
        let option = document.createElement('option');
        option.value = cities[i].matching_full_name;
        suggestions.appendChild(option)
    }
    console.log(result)
})*/

let updateCurrentWeather = (data) => {
    city.textContent = data.name + ', ' + data.sys.country;
    day.textContent = dayOfWeek();
    humidity.textContent = data.main.humidity;
    pressure.textContent = data.main.pressure;
    let windDirection;
    let deg = data.wind.deg;
    if (deg > 45 && deg <= 135) {
        windDirection = 'East';
    } else if (deg > 135 && deg <= 225) {
        windDirection = 'South';
    } else if (deg > 225 && deg <= 315) {
        windDirection = 'West';
    } else {
        windDirection = 'North';
    }
    wind.textContent = windDirection + ', ' + data.wind.speed;
    temperature.textContent = data.main.temp > 0 ? '+' + Math.round(data.main.temp) : Math.round(data.main.temp)
    let imgID = data.weather[0].id;
    weatherImages.forEach( obj => {
        if ( obj.id.includes(imgID)) {
            img.src = obj.url;
        }
    })
}

let updateForecast = (forecast) => {
    forecastBlock.innerHTML = '';
    forecast.forEach(day => {
        let iconURL = 'https://openweathermap.org/img/wn/' + day.weather[0].icon + '@2x.png';
        let dayName = dayOfWeek(day.dt * 1000);
        let temperature = day.main.temp > 0 ? '+' + Math.round(day.main.temp) : Math.round(day.main.temp)

        let forecastItem = `<article class="weatherforecastitem">
        <img src="${iconURL}" alt="${day.weather[0].description}" class="weatherforecasticon">
        <h3 class="weatherforecastday">${dayName}</h3>
        <p class="weatherforecasttemperature"><span class="value">${temperature}</span>&deg;C</p>
    </article>`;
    forecastBlock.insertAdjacentHTML('beforeend', forecastItem);
    })
}

let dayOfWeek = (dt = new Date().getTime()) => {
    return new Date(dt).toLocaleDateString('en-EN', {'weekday': 'long'});
}
