// Clock
"use strict";
let apiIsCalled = false;
function getClockTime(apiIsCalled, apiHours, apiMinutes) {
  let apiCalled = true;
  apiCalled = apiIsCalled;
  let clock;
  let hours = apiHours;
  let minutes = apiMinutes;

  if (apiHours < 10) {
    hours = "0" + apiHours;
  } else {
    hours = apiHours;
  }
  clock = hours + ":" + minutes;
  document.getElementById("detail__time").innerHTML = clock;
}

function getDate() {
  const currentDate = new Date();
  const month = currentDate.toLocaleString("default", { month: "long" });
  const weekDay = currentDate.toLocaleString("default", { weekday: "long" });

  document.querySelector(
    ".general__heading"
  ).textContent = `${month}, ${currentDate.getFullYear()}`;
  document.querySelector(
    ".general__subheading"
  ).textContent = `${weekDay}, ${month} ${currentDate.getDate()}, ${currentDate.getFullYear()}`;
}

var saveInputValue;

getDate();
getClockTime();
setInterval(function () {
  if (saveInputValue) {
    getApiData(saveInputValue);
  }
}, 3000);

getApiData("Baku");

// Input City (serach)
document
  .querySelector(".search-input")
  .addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      const city = this.value;

      const apiData = getApiData(city);
    }
  });

// Fetch API
function getApiData(city) {
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "b8bcc3dfa0msh13afb966c0dbccap191d17jsneefcbcbcf97c",
      "X-RapidAPI-Host": "weatherapi-com.p.rapidapi.com",
    },
  };

  fetch(
    `https://weatherapi-com.p.rapidapi.com/forecast.json?q=${city}&days=4`,
    options
  )
    .then((response) => response.json())
    .then((response) => {
      saveInputValue = response.location.name;

      document.querySelector(".detail__city p").textContent =
        response.location.name;

      saveInputValue = response.location.name;

      document.querySelector(".detail__country p").textContent =
        response.location.country;

      document.querySelector(
        ".detail__weather-value p"
      ).textContent = `${response.current.temp_c}°C`;

      document.querySelector(".detail__weather-text p").textContent =
        response.current.condition.text;

      document.getElementById(
        "humidity"
      ).textContent = `${response.current.humidity}%`;
      document.getElementById(
        "wind-speed"
      ).textContent = `${response.current.wind_kph} km/h`;
      document.getElementById(
        "pressure"
      ).textContent = `${response.current.pressure_mb} mb`;
      document.getElementById(
        "chance-of-rain"
      ).textContent = `${response.forecast.forecastday[0].day.daily_chance_of_rain}%`;

      //Finding local time
      let localtime = response.location.localtime;
      localtime = localtime.split(" ")[1];
      let apiHours = localtime.split(":")[0];
      let apiMinutes = localtime.split(":")[1];

      //Finding sunrise time
      let sunriseClock =
        response.forecast.forecastday[0].astro.sunrise.split(" ")[0];
      let sunriseHours = sunriseClock.split(":")[0];
      let sunriseMinutes = sunriseClock.split(":")[1];

      //Finding sunset time
      let sunsetClock =
        response.forecast.forecastday[0].astro.sunset.split(" ")[0];
      let sunsetHours = +12 + Number(sunsetClock.split(":")[0]);
      let sunsetMinutes = sunsetClock.split(":")[1];

      //Creating variables
      let hoursLater = " hours later";
      let minutesLater = " minutes later";
      let hoursAgo = " hours ago";
      let minutesAgo = " minutes ago";

      let estimatedSunriseHour;
      let estimatedSunriseMinute;
      let estimatedSunsetHour;
      let estimatedSunsetMinute;

      let estimatedSunrise;
      let estimatedSunset;

      let calculateEstimate = function () {
        if (sunriseHours - Date.now > 1) {
          console.log(1 + 1);
        } else {
          console.log(2 + 2);
        }
      };

      calculateEstimate();

      // Writing to DOM
      document.querySelector(".detail__sunrise-time p").textContent =
        response.forecast.forecastday[0].astro.sunrise;
      document.querySelector(".detail__sunset-time p").textContent =
        response.forecast.forecastday[0].astro.sunset;
      document.querySelector(
        ".detail__sunrise-estimate p"
      ).textContent = `${estimatedSunrise}`;
      document.querySelector(
        ".detail__sunset-estimate p"
      ).textContent = `${estimatedSunset}`;

      let weatherIcon = response.current.condition.icon;
      document
        .querySelector(".detail__weather-icon img")
        .setAttribute("src", weatherIcon.replace("64x64", "128x128"));

      apiIsCalled = true;
      getClockTime(apiIsCalled, apiHours, apiMinutes);
    })

    .catch((err) => {
      clearInterval;
      console.error(err);
    });
}
