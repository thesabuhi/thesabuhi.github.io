// Clock
"use strict";
function getClockTime() {
  const d = new Date();
  d.getHours();
  d.getMinutes();
  let clock;
  if (d.getMinutes() < 10) {
    clock = d.getHours() + ":" + "0" + d.getMinutes();
  } else {
    clock = d.getHours() + ":" + d.getMinutes();
  }

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

getDate();
getClockTime();
setInterval(getClockTime, 500);

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
    `https://weatherapi-com.p.rapidapi.com/forecast.json?q=${city}&days=10`,
    options
  )
    .then((response) => response.json())
    .then((response) => {
      document.querySelector(".detail__city p").textContent =
        response.location.name;
      document.querySelector(".detail__country p").textContent =
        response.location.country;
      document.querySelector(
        ".detail__weather-value p"
      ).textContent = `${response.current.temp_c}°C`;
      document.querySelector(".detail__weather-text p").textContent =
        response.current.condition.text;
      let weatherIcon = response.current.condition.icon;
      document
        .querySelector(".detail__weather-icon img")
        .setAttribute("src", weatherIcon.replace("64x64", "128x128"));

      console.log(response);
    })

    .catch((err) => {
      console.error(err);
    });
}
