let container = document.getElementById('container')
let form = document.getElementById('form')
let input = document.getElementById('city-input')
let inputMsg = document.getElementById('msg')
let geolocationBtn = document.getElementById('geolocation-btn')
let descriptionIcon = document.getElementById('description-icon')

let api

// summoning the API
function fetchData(){
    inputMsg.innerText = 'Searching...'
    inputMsg.classList.add('searching')

    fetch(api)
        .then(response => response.json())
        .then(result => weatherDetails(result))
}

// input functions
// once the user pressed enter -> get the data of the city
function reqApi(city){
    api = `https://api.openweathermap.org/data/2.5/weather?q=${input.value}&units=metric&appid=${apiKey}`
    fetchData();
}

//if city is not valid show this error, else show weather info
function weatherDetails(info){
    if(info.cod === '404'){
        inputMsg.innerText = 'Invalid city, try again'
        inputMsg.classList.replace('searching', 'error')
    }else{
        //info declaration
        const location = info.name
        const country = info.sys.country
        const {temp, feels_like, humidity, pressure} = info.main
        const {id, description} = info.weather[0]
        const wind = info.wind.speed
        const date = new Date().toDateString()
        const condition = info.weather[0].main
        const weatherId = info.weather[0].id

        //changing html elements
        document.getElementById('location').innerHTML = `<i class='bx bxs-map'></i>${location}`
        document.getElementById('country').innerText = country
        document.getElementById('degrees').innerText = `${Math.floor(temp)}°c`
        document.getElementById('description').innerText = description
        document.getElementById('date').innerText = date
        document.getElementById('feels-like').innerText = `${Math.floor(feels_like)}°c`
        document.getElementById('humidity').innerText = `${humidity}%`
        document.getElementById('wind').innerText = `${wind}km`
        document.getElementById('pressure').innerText = pressure

        //main icon
        if (weatherId >= 701 && weatherId <= 781){
            descriptionIcon.src = `icons/fog.png`
        }else{
            descriptionIcon.src = `icons/${condition}.png`
        }

        inputMsg.classList.remove('searching', 'error')
        container.classList.add('active')

        //replace spaces with + so the link actually works if location has more than one word
        let noSpaceLocation = location.replace(" ", "+")
        document.body.style.backgroundImage = `url(https://source.unsplash.com/1600x900/?${noSpaceLocation})`

    }
}
input.addEventListener('keyup', e =>{
    if(input.value !== '' && e.key === 'Enter'){
        reqApi(input.value)
    }
})

// geolocation functions
//if geolocation is allowed -> get current position
function onSuccess(position){
    const {latitude, longitude} = position.coords
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`
    fetchData();
}

//if geolocation is not allowed or not supported show this error
function onError(error){
    inputMsg.innerText = 'Geolocation is unavailable'
    inputMsg.classList.add('error')
}

geolocationBtn.addEventListener('click', () =>{
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(onSuccess, onError)
    }
})

//back button
const back = document.getElementById('back')

back.addEventListener('click', () => {
    container.classList.remove('active')
    form.classList.add('active')
})