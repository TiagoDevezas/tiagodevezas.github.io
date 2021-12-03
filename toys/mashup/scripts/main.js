"use strict";

const ICON_BASE_URL = "./images/weather-";
const EXTENSION = ".svg.png";

const PLACE_API_BASE_URL =
  "https://secure.geonames.org/searchJSON?formatted=true&username=twlab&style=full&lang=pt&q="; // Use the HTTPS API version
const WEATHER_API_BASE_URL =
  "https://secure.geonames.org/weatherJSON?formatted=true&username=twlab&style=full"; // Use the HTTPS API version
const WEATHER_REVERSE_API_BASE_URL =
  "https://secure.geonames.org/findNearByWeatherJSON?formatted=true&username=twlab&style=full"; // Use the HTTPS API version

// Pair each cloudsCode with the string used to construct the icon image URL
const codeIconPairs = {
  SKC: "clear",
  FEW: "few-clouds",
  SCT: "showers-scattered",
  BNC: "severe-alert",
  OVC: "overcast",
  OTHER: "other",
  ERROR: "error",
};

let selectedWeatherApi;
const apiSelector = document.getElementById("api-select");
const apiSelectorDefaultValue = apiSelector.value;
selectedWeatherApi = apiSelectorDefaultValue;

apiSelector.addEventListener("change", (event) => {
  selectedWeatherApi = event.target.value;
});

const iconSelector = document.getElementById("icon-select");
const getSelectedIcon = iconSelector.value;

const imageTag = document.getElementById("meteo-icon");
imageTag.setAttribute(
  "src",
  `${ICON_BASE_URL}${codeIconPairs[getSelectedIcon]}${EXTENSION}`
);

const placeForm = document.getElementById("get-place");

iconSelector.addEventListener("change", (event) => {
  document.getElementById("loader").textContent = "A carregar imagem...";
  const selectedIcon = event.currentTarget.value;
  imageTag.setAttribute(
    "src",
    `${ICON_BASE_URL}${codeIconPairs[selectedIcon]}${EXTENSION}`
  );
});

imageTag.addEventListener("load", () => {
  document.getElementById("loader").textContent = "";
});

placeForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const inputValue = document.getElementById("place-name");
  const place = inputValue.value;
  getWeatherBbox(place);
});

async function getGeoPoints(placeName) {
  const placeApiUrl = `${PLACE_API_BASE_URL}${placeName}`;
  const request = await fetch(placeApiUrl);
  const jsonData = await request.json();
  let geoPointsObj;
  if (selectedWeatherApi === "bbox") {
    const boundingBox = jsonData.geonames[0].bbox;
    geoPointsObj = {
      north: +boundingBox.north,
      south: +boundingBox.south,
      west: +boundingBox.west,
      east: +boundingBox.east,
    };
  } else {
    const latitude = +jsonData.geonames[0].lat;
    const longitude = +jsonData.geonames[0].lng;
    geoPointsObj = { lat: latitude, lng: longitude };
  }

  return geoPointsObj;
}

async function getWeather(geoPointsObj) {
  let weatherApiUrl;
  if (selectedWeatherApi === "bbox") {
    weatherApiUrl = `${WEATHER_API_BASE_URL}&north=${geoPointsObj.north}&south=${geoPointsObj.south}&east=${geoPointsObj.east}&west=${geoPointsObj.west}`;
  } else {
    weatherApiUrl = `${WEATHER_REVERSE_API_BASE_URL}&lat=${+geoPointsObj.lat}&lng=${+geoPointsObj.lng}`;
  }
  const request = await fetch(weatherApiUrl);
  const jsonData = await request.json();
  let code;
  if (weatherApiUrl.includes(WEATHER_API_BASE_URL)) {
    code = jsonData.weatherObservations.length
      ? jsonData.weatherObservations[0].cloudsCode
      : null;
  } else if (jsonData.weatherObservation) {
    code = jsonData.weatherObservation.cloudsCode;
  }
  if (!code) {
    code = "ERROR";
    alert("No Weather Data!");
  }
  if (!codeIconPairs.hasOwnProperty(code)) {
    code = "OTHER";
  }
  imageTag.setAttribute(
    "src",
    `${ICON_BASE_URL}${codeIconPairs[code]}${EXTENSION}`
  );
  imageTag.setAttribute("alt", code);
  iconSelector.value = code;
  iconSelector.dispatchEvent(new Event("change"));
}

// Call both async functions sequentially
async function getWeatherBbox(placeName) {
  const placeBoundingBox = await getGeoPoints(placeName);
  await getWeather(placeBoundingBox);
}
