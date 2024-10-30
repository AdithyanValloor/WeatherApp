
// HTML ELEMENTS

const form = document.querySelector('form')
const loader = document.getElementById('loading')
const searchBtn = document.querySelector('.btn-search')
const apiKey = 'befd984de4d3c050671d4eb935e6c660';

// WINDOW LOAD

window.addEventListener('load', async ()=>{

    // DEFAULT LOCATION

    const weatherData = await weatherAPICall('kochi')
    const airQuality = await airQualityAPI(weatherData)

    displyWeather(weatherData,airQuality)


    // CURRENT LOCATION OF USER 

    getLocation()


})

//=========================================== WEATHER API ===========================================


async function weatherAPICall(city){

    const api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`

    try {
        
        const response = await fetch(api)

        const data = await response.json()
        
        return data


    } catch (error) {
        
        console.log(error);
        
        
    }

}

//=========================================== LOCATION API ===========================================

async function locationAPI(data){
    
    const lat = data.coords.latitude
    const lon = data.coords.longitude
    
    const geoAPI = `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&apiKey=2405f082d4024ac0ab90c6ad57c79a00`
    
    try {
        
        const response = await fetch(geoAPI)
        
        const data = await response.json()
        
        const city = data.features[0].properties.city
        
        return city        
        
    } catch (error) {

        console.log(error);
        
    }

}

//=========================================== AIR QUALITY API ===========================================

async function airQualityAPI(data){

    console.log(data);
    
    const lat = data.coord.lat

    const lon = data.coord.lon
    
    const airAPI = `https://api.openweathermap.org/data/2.5/air_pollution?&lat=${lat}&lon=${lon}&appid=${apiKey}`

    try {
        
        const response = await fetch(airAPI)

        const data = await response.json()
        
        console.log(data);

        return data

    } catch (error) {

        console.log(error);
        
    }

}



//=========================================== GET LOCATION FUNCTION =========================================== 

function getLocation(){

    navigator.geolocation.getCurrentPosition(locationSuccess,locationFailed)

    async function locationSuccess(position){

        console.log(position);

        const cityData = await locationAPI(position)

        const weatherData = await weatherAPICall(cityData)

        const airQuality = await airQualityAPI(weatherData)

        const location = true

        displyWeather(weatherData,airQuality,location)

    }
    
    function locationFailed(){
    
        console.log('error getting location');
    
        return 'error getting location'
    
    }

}

// =========================================== USER SEARCH ===========================================


form.addEventListener('submit', async (e)=>{
    
    e.preventDefault()

    let city = document.querySelector('.user-input').value

    console.log(city);

    const weatherData = await weatherAPICall(city)
    
    console.log(weatherData);

    if(weatherData.cod === '404'){
        
        console.log('location not found');

        document.querySelector('.user-input').placeholder = '⚠︎ Location not found'
        
    }else{
        
        document.querySelector('.user-input').placeholder = 'Search your city'

    }

    document.querySelector('.user-input').value = ''

    const airQuality = await airQualityAPI(weatherData)

    displyWeather(weatherData,airQuality)
    
})

// =========================================== DISPLAY WEATHER FUNCTION ===========================================

function displyWeather(data,air,location){

    console.log(data);
    
    const o3 = air.list[0].components.o3
    const no2 = air.list[0].components.no2
    const pm25 = air.list[0].components.pm10
    const co = air.list[0].components.co

    const windspeed = Math.trunc(data.wind.speed * 3.6)

    const temp = Math.trunc( data.main.temp - 273.15)
    const maxTemp = Math.trunc(data.main.temp_max - 273.15)
    const minTemp = Math.trunc(data.main.temp_min - 273.15)
    const feelsLikeTemp = Math.trunc(data.main.feels_like - 273.15)
    const country = data.sys.country
    const placeName = data.name
    const pressure = data.main.pressure
    const humidity = data.main.humidity
    const visibility = data.visibility/1000
    const description = data.weather[0].description

    const sunrise = sunriseSunset(data,'sunrise')
    const sunset = sunriseSunset(data,'sunset')

    const currentTime = getDate(data,'getTime')
    const currentDate = getDate(data,'getDate')
    
    const icon = iconFetch(data)

    let locationHTML = `<p>${placeName} now,</p>`

    location ? locationHTML = `
    
        <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#e8eaed"><path d="M517-144 416-416 144-517v-35l672-264-264 672h-35Zm19-156 152-388-388 152 171 65 65 171Zm-65-171Z"/></svg>
        <p>${placeName} now,</p>
                
    `
        :
        
        locationHTML = `
        <p>${placeName} now,</p>
    `

    displaylogo = `

        <h1>Weather Now</h1>
        <img src="${icon}" alt="" width="50px">

    `
    
    displayHTML = `

        <div class="top">
            <div class="weather">
                <div class="weather-inner">
                    <div class="weather-img">
                        <div class="location-now">
                            ${locationHTML}
                        </div>
                        <img src= ${icon} alt="">
                    </div>
                    <div>
                        <h1>${temp}°c</h1>
                        <h2>${description} <br> ${maxTemp}°c/${minTemp}°c</h2>
                    </div>
                </div>
                <hr>
                <div class="weather-inner-bottom">
                    <div class="date">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Z"/></svg>    
                        <p>
                            ${currentDate}
                        </p>
                    </div>
                    <div class="location">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M480-480q33 0 56.5-23.5T560-560q0-33-23.5-56.5T480-640q-33 0-56.5 23.5T400-560q0 33 23.5 56.5T480-480Zm0 294q122-112 181-203.5T720-552q0-109-69.5-178.5T480-800q-101 0-170.5 69.5T240-552q0 71 59 162.5T480-186Zm0 106Q319-217 239.5-334.5T160-552q0-150 96.5-239T480-880q127 0 223.5 89T800-552q0 100-79.5 217.5T480-80Zm0-480Z"/></svg>   
                        <p>
                            ${placeName} , ${country}
                        </p>
                    </div>
                </div>
            </div>
            <div class="other-details">
                <div class="right-1">
                     <div class="right-1">
                        <div class="time">
                            <p>Current time</p>
                            <div>
                                <img src="./svg/schedule_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24.svg" alt="" style="margin: 0 12.5px;">
                                <h2>${currentTime}</h2>
                            </div>
                        </div>
                        <div class="wind">
                            <p>Wind Speed</p>
                            <div>
                                <img src="./icons/windsock.svg" alt="">
                                <h2>${windspeed} kph</h2>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="right-2">
                    <div class="sunrise">
                        <div>
                            <p>Sunrise</p>
                        </div>
                        <div class="sunriseTime">
                            <img src="./icons/sunrise.svg" alt="">
                            <h2>${sunrise}</h2>
                        </div>
                    </div>
                    <div class="sunrise">
                        <div>
                            <p>Sunset</p>
                        </div>
                        <div class="sunriseTime">
                            <img src="./icons/sunset.svg" alt="">
                            <h2>${sunset}</h2>
                        </div>
                    </div>
                </div>
                <div class="right-3">
                    <p>Air Quality</p>
                    <div class="air-quality-content">
                        <img src="./icons/wind.svg" alt="">
                        <div class="air-values-container">
                            <div class="air-values">
                                <p>Pm10</p>                      
                                <h2>${pm25}</h2>          
                            </div>   
                            <div class="air-values">
                                <p>Co</p>                      
                                <h2>${co}</h2>
                            </div>   
                            <div class="air-values">
                                <p>No2</p>                      
                                <h2>${no2}</h2>
                            </div>   
                            <div class="air-values">
                                <p>O3</p>                   
                                <h2>${o3}</h2>
                            </div>   
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="other-details-2">
            <div class="bottom-1">
                <p>Feels like</p>
                <div>
                    <img src="./icons/thermometer-glass-celsius.svg" alt="" >
                    <h3>${feelsLikeTemp}°c</h3>
                </div>
            </div>
            <div class="bottom-2">
                <p>Pressure</p>
                <div>
                    <img src="./icons/barometer.svg" alt="" >
                    <h3>${pressure}hPa</h3>
                </div>
            </div>
            <div class="bottom-3">
                <p>Humidity</p>
                <div>
                    <img src="./icons/humidity.svg" alt="" >
                    <h3>${humidity}%</h3>
                </div>
            </div>
            <div class="bottom-4">
                <p>Visibility</p>
                <div>
                    <img src="./svg/visibility_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24.svg" alt="" style="margin: 0 12.25px;">
                    <h3>${visibility}km</h3>
                </div>
            </div>
        </div>
     
    `
    
    document.querySelector('.weather-container').innerHTML = displayHTML
    document.querySelector('.title').innerHTML = displaylogo
    
}

// =========================================== GET SUNRISE AND SUNSET TIME ===========================================

function sunriseSunset(data,req){

    let unixVal = 0

    if(req === 'sunrise'){

        unixVal = data.sys.sunrise;

    }

    if(req === 'sunset'){

        unixVal = data.sys.sunset

    }

    var dateinLocal = new Date((unixVal + data.timezone) * 1000);

    var meridian = dateinLocal.getUTCHours()>12 ? 'pm' : 'am'
    const hours = dateinLocal.getUTCHours()%12;
    const minutes = '0' + dateinLocal.getUTCMinutes()

    const finaleTime = hours + ':' + minutes.substr(-2) + ' ' +meridian
    
    return finaleTime

}

var timeIn24 = 0

//=========================================== GET CURRENT TIME & DATE ===========================================


function getDate(data,req){

    const date = new Date()
    const localTime = date.getTime()
    const localOffset = date.getTimezoneOffset() * 60000
    const utc = localTime + localOffset
    var currentTimeNow = utc + (1000 * data.timezone)
    var cityTime = new Date(currentTimeNow)

    timeIn24 = cityTime.getHours()
    
    const d = new Intl.DateTimeFormat('en-in',{
        dateStyle: 'full'
    })

    const t = new Intl.DateTimeFormat('en-in',{
        timeStyle:"short"
    })

    const formatedTime = t.format(cityTime)
    const formatedDate = d.format(cityTime)


    if(req === 'getTime'){
        
        return formatedTime

    }

    if(req === 'getDate'){

        return formatedDate
    }
    
}

// =========================================== GET WEATHER ICON ===========================================

function iconFetch(data){

    console.log(timeIn24);

    
    if(timeIn24 === 0 || timeIn24 < 6){

        if(data.weather[0].description === "scattered clouds" ){
            return "./icons/partly-cloudy-night.svg"
        }
        else if(data.weather[0].description === "broken clouds"){
            return "./icons/partly-cloudy-night.svg"
        }
        else if(data.weather[0].description === "few clouds"){
            return "./icons/partly-cloudy-night.svg"
        }
        
        if(data.weather[0].main === "Clear"){
            return "./icons/clear-night.svg"
        }
    }

    else if(timeIn24 > 5 ){

        if(data.weather[0].description === "scattered clouds" ){
            return "./icons/partly-cloudy-day.svg"
        }
        else if(data.weather[0].description === "broken clouds"){
            return "./icons/partly-cloudy-day.svg"
        }
        else if(data.weather[0].description === "few clouds"){
            return "./icons/partly-cloudy-day.svg"
        }
        
        if(data.weather[0].main === "Clear"){
            return "./icons/clear-day.svg"
        }
       
    }

    else if(timeIn24 > 17){

        if(data.weather[0].description === "scattered clouds" ){
            return "./icons/partly-cloudy-night.svg"
        }
        else if(data.weather[0].description === "broken clouds"){
            return "./icons/partly-cloudy-night.svg"
        }
        else if(data.weather[0].description === "few clouds"){
            return "./icons/partly-cloudy-night.svg"
        }
        
        if(data.weather[0].main === "Clear"){
            return "./icons/clear-night.svg"
        }
       
    }

    if( data.weather[0].description === "overcast clouds"){
        return "./icons/cloudy.svg"
    }
    if( data.weather[0].main === "Clouds"){
        return "./icons/cloudy.svg"
    }
    else if(data.weather[0].main === "Haze"){
        return "./icons/haze.svg"
    }
    else if(data.weather[0].main === "Rain"){
        return "./icons/rain.svg"
    }
    else if(data.weather[0].main === "Smoke"){
        return "./icons/smoke.svg"
    }
    else if(data.weather[0].main === "Fog"){
        return "./icons/fog.svg"
    }
    else if(data.weather[0].main === "Dust"){
        return "./icons/dust.svg"
    }
    else if(data.weather[0].main === "Hail"){
        return "./icons/hail.svg"
    }
    else if(data.weather[0].main === "Drizzle"){
        return "./icons/drizzle.svg"
    }
    else if(data.weather[0].main === "Tornado"){
        return "./icons/tornado.svg"
    }
    else if(data.weather[0].main === "Snow"){
        return "./icons/snow.svg"
    }
    else if(data.weather[0].main === "Hurricane"){
        return "./icons/hurricane.svg"
    }
    else if(data.weather[0].main === "Sleet"){
        return "./icons/sleet.svg"
    }
    else if(data.weather[0].main === "Thunderstorm"){
        return "./icons/thunderstorms-rain.svg"
    }
    else if(data.weather[0].main === "Mist"){
        return "./icons/mist.svg"
    }
      
}
