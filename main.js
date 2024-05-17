const formEl = document.querySelector('.form')
const inputEl = document.querySelector('.form input')
const loadingEL = document.querySelector('.overlay')
const ipAddressEl = document.querySelector('.ip-address')
const locationEl = document.querySelector('.location')
const timezoneEl = document.querySelector('.timezone')
const ipsEl = document.querySelector('.ips')

navigator.geolocation.getCurrentPosition(getMyPosition);

let Mylatitude;
let Mylongitude;
let map;

function getMyPosition(e) {
    const { latitude, longitude } = e.coords;
    Mylatitude = latitude;
    Mylongitude = longitude;
    initMap();
}

function initMap() {
    map = L.map('map').setView([Mylatitude, Mylongitude], 15);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    const myIcon = L.icon({
        iconUrl: 'images/icon.svg',
        iconSize: [35, 55],
    });

    L.marker([Mylatitude, Mylongitude], { icon: myIcon }).addTo(map);
}

function renderMap(latitude, longitude) {
    map.setView([latitude, longitude], 15);

    const myIcon = L.icon({
        iconUrl: 'images/icon.svg',
        iconSize: [35, 55],
    });

    L.marker([latitude, longitude], { icon: myIcon }).addTo(map);
}

formEl.addEventListener('submit', (e) => {
    e.preventDefault();
    const inputValue = inputEl.value;
    loadingEL.classList.remove('hidden');

    const request = new XMLHttpRequest();
    request.open('GET', `https://geo.ipify.org/api/v2/country,city?apiKey=at_5V6rNekLAwJUP1KH1cv73lIGKfyOA&ipAddress=${inputValue}`);
    request.send();

    request.addEventListener('load', () => {
        loadingEL.classList.add('hidden');
        if (request.status === 200) {
            const data = JSON.parse(request.response);
            ipAddressEl.textContent = data.ip;
            locationEl.textContent = `${data.location.city}, ${data.location.country}, ${data.location.postalCode}`;
            timezoneEl.textContent = `UTC ${data.location.timezone}`;
            ipsEl.textContent = data.isp;

            const { lat, lng } = data.location;
            renderMap(lat, lng);
        } else {
            ipAddressEl.textContent = '';
            locationEl.textContent = '';
            timezoneEl.textContent = '';
            ipsEl.textContent = '';
            alert(`You entered an invalid IP Address: ❌ ${inputValue}`);
        }
        inputEl.value = '';
    });
});