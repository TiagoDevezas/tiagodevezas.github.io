'use strict';

const ICON_BASE_URL = 'images/weather-';
const EXTENSION = '.svg.png';

const PLACE_API_BASE_URL = 'https://secure.geonames.org/searchJSON?formatted=true&username=twlab&style=full&lang=pt&q=';
const WEATHER_API_BASE_URL = 'https://secure.geonames.org/weatherJSON?formatted=true&username=twlab&style=full';
const WEATHER_REVERSE_API_BASE_URL = 'https://secure.geonames.org/findNearByWeatherJSON?formatted=true&username=twlab&style=full';

let selectedWeatherApi; // Store the selected weather API (bounding box or reverse geocoding)

// Map each code to a string that will be used to construct the icon image URL
const codesExtensions = {
  'SKC': 'clear',
  'FEW': 'few-clouds',
  'SCT': 'showers-scattered',
  'BNC': 'severe-alert',
  'OVC': 'overcast',
  'OTHER': 'unreadable'
}

const apiSelector = document.getElementById('api-select');
const apiSelectorDefaultValue = apiSelector.value;
selectedWeatherApi = apiSelectorDefaultValue;


apiSelector.addEventListener('change', (event) => {
  selectedWeatherApi = event.target.value;
});

const iconSelector = document.getElementById('icon-select');
const getSelectedIcon = iconSelector.value;

const imageTag = document.getElementById('meteo-icon');
imageTag.setAttribute('src', `${ICON_BASE_URL}${codesExtensions[getSelectedIcon]}${EXTENSION}`);

const placeForm = document.getElementById('get-place');

iconSelector.addEventListener('change', (event) => {
  document.getElementById('loader').textContent = 'A carregar imagem...';
  const selectedIcon = event.currentTarget.value;
  imageTag.setAttribute('src', `${ICON_BASE_URL}${codesExtensions[selectedIcon]}${EXTENSION}`);
});

imageTag.addEventListener('load', () => {
  document.getElementById('loader').textContent = '';
});

placeForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const inputValue = document.getElementById('place-name');
  const place = inputValue.value;
  getMeteoForPlaceBbox(place);
});

async function getBoundingBoxForPlace(placeName) {
  const placeApiUrl = `${PLACE_API_BASE_URL}${placeName}`;
  const request = await fetch(placeApiUrl); // Returns a promise
  const jsonData = await request.json(); // Returns a promise
  let geoCoordinatesObj;
  if(selectedWeatherApi === 'bbox') {
    const boundingBox = jsonData.geonames[0].bbox;
    geoCoordinatesObj = { 'north': +boundingBox.north, 'south': +boundingBox.south, 'west': +boundingBox.west, 'east': +boundingBox.east }; 
  } else {
    const latitude = +jsonData.geonames[0].lat;
    const longitude = +jsonData.geonames[0].lng;
    geoCoordinatesObj = { 'lat': latitude, 'lng': longitude }; 
  }
  
  return geoCoordinatesObj;
};

async function getMeteoForPlace(geoCoordinatesObj) {
  let meteoApiUrl;
  if(selectedWeatherApi === 'bbox') {
    meteoApiUrl = `${WEATHER_API_BASE_URL}&north=${geoCoordinatesObj.north}&south=${geoCoordinatesObj.south}&east=${geoCoordinatesObj.east}&west=${geoCoordinatesObj.west}`;
  } else {
    meteoApiUrl = `${WEATHER_REVERSE_API_BASE_URL}&lat=${+geoCoordinatesObj.lat}&lng=${+geoCoordinatesObj.lng}`;
  }
  const request = await fetch(meteoApiUrl); // Returns a promise
  const jsonData = await request.json(); // Returns a promise
  let cloudsCd;
  if(meteoApiUrl.includes(WEATHER_API_BASE_URL)) {
    cloudsCd = jsonData.weatherObservations.length ? jsonData.weatherObservations[0].cloudsCode : null;
  } else if(jsonData.weatherObservation) {
    cloudsCd = jsonData.weatherObservation.cloudsCode;
  }
  if(!cloudsCd) { return alert('No Weather Data!') };
  if(!codesExtensions.hasOwnProperty(cloudsCd)) { cloudsCd = 'OTHER'; };
  imageTag.setAttribute('src', `${ICON_BASE_URL}${codesExtensions[cloudsCd]}${EXTENSION}`);
  imageTag.setAttribute('alt', cloudsCd);
  iconSelector.value = cloudsCd;
  iconSelector.dispatchEvent(new Event('change'));
};

// Call both async functions
async function getMeteoForPlaceBbox(placeName) {
  const placeBoundingBox = await getBoundingBoxForPlace(placeName); // Returns a promise
  await getMeteoForPlace(placeBoundingBox); // Returns a promise
};
