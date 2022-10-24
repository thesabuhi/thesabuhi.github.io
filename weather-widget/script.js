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
function getApiData(city, selectedDay) {
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

      //Selecting the day
      const forecastDay = response.forecast.forecastday;
      let selectedDay = 0;
      let forecast__block = document.querySelectorAll(".forecast__block");
      forecastDay.forEach((day, index) => {
        forecast__block[index].addEventListener("click", function () {
          selectedDay = index;
          console.log(selectedDay);
          console.log(response.forecast.forecastday[selectedDay].day.avgtemp_c);
        });
      });

      document.querySelector(".detail__city p").textContent =
        response.location.name;

      saveInputValue = response.location.name;

      document.querySelector(".detail__country p").textContent =
        response.location.country;

      document.querySelector(
        ".detail__weather-value p"
      ).textContent = `${response.forecast.forecastday[selectedDay].day.avgtemp_c}°C`;

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

      function calculateEstimate() {
        if (apiHours > 0 && apiHours < sunriseHours) {
          if (sunriseHours - apiHours > 1) {
            estimatedSunriseHour = sunriseHours - apiHours;
            estimatedSunsetHour = sunsetHours - apiHours;
            estimatedSunrise = `${estimatedSunriseHour} ${hoursLater}`;
            estimatedSunset = `${estimatedSunsetHour} ${hoursLater}`;
          } else if (sunriseHours - apiHours < 1) {
            estimatedSunriseMinute = Math.abs(sunriseMinutes - apiMinutes);
            estimatedSunsetHour = sunsetHours - apiHours;
            estimatedSunrise = `${estimatedSunriseMinute} ${minutesLater}`;
            estimatedSunset = `${estimatedSunsetHour} ${hoursLater}`;
          }
        } else if (sunriseHours < apiHours && apiHours < sunsetHours) {
          if (apiHours - sunriseHours > 1) {
            estimatedSunriseHour = apiHours - sunriseHours;
            estimatedSunsetHour = sunsetHours - apiHours;
            estimatedSunrise = `${estimatedSunriseHour} ${hoursAgo}`;
            estimatedSunset = `${estimatedSunsetHour} ${hoursLater}`;
          } else if (apiHours - sunriseHours < 1) {
            estimatedSunriseMinute = Math.abs(sunriseMinutes - apiMinutes);
            estimatedSunsetHour = sunsetHours - apiHours;
            estimatedSunrise = `${estimatedSunriseMinute} ${minutesAgo}`;
            estimatedSunset = `${estimatedSunsetHour} ${hoursLater}`;
          } else if (sunsetHours - apiHours < 1) {
            estimatedSunriseHour = apiHours - sunsetHours;
            estimatedSunsetMinute = sunsetMinutes - apiMinutes;
            estimatedSunrise = `${estimatedSunriseHour} ${hoursAgo}`;
            estimatedSunset = `${estimatedSunsetMinute} ${minutesLater}`;
          }
        } else if (apiHours > sunsetHours && sunsetHours > sunriseHours) {
          if (apiHours - sunsetHours > 1) {
            estimatedSunriseHour = 24 - sunsetHours + sunriseHours;
            estimatedSunsetHour = apiHours - sunsetHours;
            estimatedSunrise = `${estimatedSunriseHour} ${hoursLater}`;
            estimatedSunset = `${estimatedSunsetHour} ${hoursAgo}`;
          } else if (apiHours - sunsetHours < 1) {
            estimatedSunriseHour = 24 - sunsetHours + sunriseHours;
            estimatedSunsetMinute = apiMinutes - sunsetMinutes;
            estimatedSunrise = `${estimatedSunriseHour} ${hoursLater}`;
            estimatedSunset = `${estimatedSunsetMinute} ${minutesAgo}`;
          }
        }
      }

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

      //Chance of rain hourly
      document.getElementById("chance-of-rain-6").textContent =
        response.forecast.forecastday[0].hour[5].chance_of_rain + "%";
      document.getElementById("chance-of-rain-12").textContent =
        response.forecast.forecastday[0].hour[11].chance_of_rain + "%";
      document.getElementById("chance-of-rain-18").textContent =
        response.forecast.forecastday[0].hour[17].chance_of_rain + "%";
      document.getElementById("chance-of-rain-24").textContent =
        response.forecast.forecastday[0].hour[23].chance_of_rain + "%";

      document.querySelector(".chance-of-rain-progressbar-6").value =
        response.forecast.forecastday[0].hour[5].chance_of_rain;
      document.querySelector(".chance-of-rain-progressbar-12").value =
        response.forecast.forecastday[0].hour[11].chance_of_rain;
      document.querySelector(".chance-of-rain-progressbar-18").value =
        response.forecast.forecastday[0].hour[17].chance_of_rain;
      document.querySelector(".chance-of-rain-progressbar-24").value =
        response.forecast.forecastday[0].hour[23].chance_of_rain;

      //5 days weather forecast
      const forecastIcon = response.forecast.forecastday;
      const forecastTemp = response.forecast.forecastday;

      let forecast__dates = document.querySelectorAll(".forecast__date");
      forecastDay.forEach((day, index) => {
        const now = new Date();
        const month = now.toLocaleString("default", { month: "long" });
        const today = now.getDate();
        const td = new Date().toISOString().split("T")[0];
        const tomorrow = new Date(now);
        tomorrow.setDate(today + 1);
        const tmw = tomorrow.toISOString().split("T")[0];
        if (day.date === td) {
          forecast__dates[index].innerHTML = "Today";
        } else if (day.date === tmw) {
          forecast__dates[index].innerHTML = "Tomorrow";
        } else {
          forecast__dates[index].innerHTML = `${today + index} ${month}`;
        }
      });

      let forecast__icon = document.querySelectorAll(".forecast__icon");
      forecastDay.forEach((day, index) => {
        forecast__icon[
          index
        ].innerHTML = `<img src="${day.day.condition.icon}">`;
      });

      let forecast__temp = document.querySelectorAll(".forecast__value");
      forecastTemp.forEach((day, index) => {
        forecast__temp[index].innerHTML = `${day.day.avgtemp_c}°C`;
      });

      let weatherIcon = response.current.condition.icon;
      document
        .querySelector(".detail__weather-icon img")
        .setAttribute("src", weatherIcon.replace("64x64", "128x128"));

      apiIsCalled = true;
      getClockTime(apiIsCalled, apiHours, apiMinutes);
      console.log(response);
    })

    .catch((err) => {
      clearInterval;
      console.error(err);
    });
}
