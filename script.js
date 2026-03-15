/* ===== Elements ===== */
const container = document.querySelector(".container");
const weatherAnimation = document.querySelector(".weather_animation");
const cityBackground = document.querySelector(".city-background");

const temperatureField = document.querySelector(".temp p");
const locationField = document.querySelector(".time_location p:first-child");
const dateandTimeField = document.querySelector(".time_location p:last-child");
const conditionField = document.querySelector(".condition p");
const iconField = document.querySelector(".weather_icon");
const searchField = document.querySelector(".search_area");
const form = document.querySelector("form");

// NEW: Stats elements
const feelsLikeField = document.querySelector("[data-feelslike]");
const humidityField = document.querySelector("[data-humidity]");
const windField = document.querySelector("[data-wind]");
const uvField = document.querySelector("[data-uv]");
const sunriseField = document.querySelector("[data-sunrise]");
const sunsetField = document.querySelector("[data-sunset]");
const commentField = document.querySelector("[data-comment]");

/* ===== City Images Database ===== */
const cityImages = {
    "london": "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200",
    "alexandria": "https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=1200",
    "cairo": "https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=1200",
    "brazil": "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=1200",
    "rio de janeiro": "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=1200",
    "new york": "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=1200",
    "paris": "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200",
    "tokyo": "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200",
    "dubai": "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200",
    "Beijing": " https://images.unsplash.com/photo-1510001618818-4b4e3d86bf0f?w=870 "

};

/* ===== Default Location ===== */
let targetLocation = "Cairo";

/* ===== Events ===== */
form.addEventListener("submit", searchForLocation);

/* ===== Fetch Weather ===== */
async function fetchResult() {
    try {
        const url = `https://api.weatherapi.com/v1/current.json?key=d5c2facbb2de46849b044229262301&q=${targetLocation}`;

        const res = await fetch(url);
        if (!res.ok) throw new Error("City not found");

        const data = await res.json();

        const locationName = data.location.name;
        const time = data.location.localtime;
        const temp = data.current.temp_c;
        const condition = data.current.condition.text;
        const icon = data.current.condition.icon;
        
        // NEW: Additional data
        const feelsLike = data.current.feelslike_c;
        const humidity = data.current.humidity;
        const windSpeed = data.current.wind_kph;
        const uv = data.current.uv;

        updateDetails(temp, locationName, time, condition, icon, feelsLike, humidity, windSpeed, uv);
        
        // Fetch forecast for sunrise/sunset
        fetchForecast();
        
        // NEW: Show city image
        showCityImage(locationName);
    } catch (error) {
        alert("❌ Location not found");
    }
}

/* ===== NEW: Show City Image ===== */
function showCityImage(cityName) {
    const city = cityName.toLowerCase();
    
    // Check if we have an image for this city
    if (cityImages[city]) {
        cityBackground.style.backgroundImage = `url('${cityImages[city]}')`;
        cityBackground.classList.add("show");
    } else {
        // Hide background if no image found
        cityBackground.classList.remove("show");
    }
}

/* ===== Fetch Forecast for Sunrise/Sunset ===== */
async function fetchForecast() {
    try {
        const url = `https://api.weatherapi.com/v1/forecast.json?key=d5c2facbb2de46849b044229262301&q=${targetLocation}&days=1`;
        const res = await fetch(url);
        const data = await res.json();
        
        const sunrise = data.forecast.forecastday[0].astro.sunrise;
        const sunset = data.forecast.forecastday[0].astro.sunset;
        
        sunriseField.innerText = sunrise;
        sunsetField.innerText = sunset;
    } catch (error) {
        console.log("Could not fetch forecast data");
    }
}

/* ===== Update UI ===== */
function updateDetails(temp, locationName, time, condition, icon, feelsLike, humidity, windSpeed, uv) {
    const splitDate = time.split(" ")[0];
    const splitTime = time.split(" ")[1];

    const currentDay = getDayName(new Date(splitDate).getDay());

    temperatureField.innerText = `${temp}°`;
    locationField.innerText = locationName;
    dateandTimeField.innerText = `${splitTime} · ${currentDay} ${splitDate}`;
    conditionField.innerText = condition;
    iconField.src = `https:${icon}`;

    // NEW: Update stats with animation
    animateValue(feelsLikeField, feelsLike, "°");
    animateValue(humidityField, humidity, "%");
    animateValue(windField, windSpeed, " km/h");
    animateValue(uvField, uv, "");

    changeBackground(condition);
    updateFunnyComment(temp, condition);
}

/* ===== NEW: Funny Weather Comments ===== */
function updateFunnyComment(temp, condition) {
    let comment = "";
    
    // Temperature-based comments
    if (temp > 35) {
        const hotComments = [
            "Sky really woke up and chose violence 🌩️",
            "Weather said: try again tomorrow 💀",
            "Outside = emotional damage 💔",
            "Can I step outside without suffering? 😭",
            "Outside looking kinda suspicious 👀",
            "Is today a main character day or nah? 🤡"
        ];
        comment = hotComments[Math.floor(Math.random() * hotComments.length)];
    } 
    else if (temp > 25) {
        const niceComments = [
            "Is today a main character day or nah? 🤡",
            "Sky pls behave 🙏",
            "Actually decent outside 🌟",
            "This is giving main character energy ✨",
            "Weather said: it's your day bestie 💅"
        ];
        comment = niceComments[Math.floor(Math.random() * niceComments.length)];
    } 
    else if (temp > 15) {
        const coolComments = [
            "Is this hoodie weather or delusion? 🧥☀️",
            "Mood = weather 🤡",
            "Outside test 💀",
            "Weather update: vibe check passed ✅"
        ];
        comment = coolComments[Math.floor(Math.random() * coolComments.length)];
    } 
    else {
        const coldComments = [
            "Weather said: stay inside 🛌",
            "Outside = villain arc energy 🥶",
            "Can't feel my face type of weather 💀",
            "Weather really said no ❄️",
            "Blanket weather activated 🧣"
        ];
        comment = coldComments[Math.floor(Math.random() * coldComments.length)];
    }
    
    // Condition-based overrides
    condition = condition.toLowerCase();
    if (condition.includes("rain")) {
        const rainComments = [
            "Sky's crying again 😭💧",
            "Wet socks incoming 🌧️",
            "Rain said: not today 💀"
        ];
        comment = rainComments[Math.floor(Math.random() * rainComments.length)];
    } 
    else if (condition.includes("snow")) {
        comment = "Winter arc unlocked ❄️✨";
    }
    else if (condition.includes("thunder") || condition.includes("storm")) {
        comment = "Zeus is mad again ⚡💀";
    }
    
    commentField.innerText = comment;
    commentField.style.animation = "none";
    setTimeout(() => {
        commentField.style.animation = "slideIn 0.6s ease";
    }, 10);
}

/* ===== NEW: Animate Value Changes ===== */
function animateValue(element, value, suffix) {
    element.style.opacity = "0";
    setTimeout(() => {
        element.innerText = value + suffix;
        element.style.transition = "opacity 0.5s ease";
        element.style.opacity = "1";
    }, 200);
}

/* ===== Search ===== */
function searchForLocation(e) {
    e.preventDefault();

    if (searchField.value.trim() === "") return;

    targetLocation = searchField.value;
    fetchResult();
}

/* ===== Day Name ===== */
function getDayName(number) {
    switch (number) {
        case 0: return "Sunday";
        case 1: return "Monday";
        case 2: return "Tuesday";
        case 3: return "Wednesday";
        case 4: return "Thursday";
        case 5: return "Friday";
        case 6: return "Saturday";
    }
}

/* ===== Background Change ===== */
function changeBackground(condition) {
    container.className = "container fade-in";

    weatherAnimation.innerHTML = "";

    condition = condition.toLowerCase();

    if (condition.includes("sun") || condition.includes("clear")) {
        container.classList.add("sunny");
    } 
    else if (condition.includes("cloud")) {
        container.classList.add("cloudy");
    } 
    else if (condition.includes("rain") || condition.includes("drizzle")) {
        container.classList.add("rainy");
    } 
    else if (condition.includes("snow")) {
        container.classList.add("snowy");
        createSnowflakes();
    } 
    else if (condition.includes("mist") || condition.includes("fog")) {
        container.classList.add("misty");
    } 
    else {
        container.classList.add("night");
    }
}

/* ===== NEW: Create Snowflakes ===== */
function createSnowflakes() {
    for (let i = 0; i < 20; i++) {
        const snowflake = document.createElement("div");
        snowflake.className = "snowflake";
        snowflake.innerHTML = "❄";
        snowflake.style.left = Math.random() * 100 + "%";
        snowflake.style.animationDuration = (Math.random() * 3 + 2) + "s";
        snowflake.style.animationDelay = Math.random() * 2 + "s";
        snowflake.style.fontSize = (Math.random() * 1 + 0.5) + "rem";
        weatherAnimation.appendChild(snowflake);
    }
}

/* ===== Initial Load ===== */
fetchResult();