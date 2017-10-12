var currentLong;
var currentLat;
var row = $('<div class="row">');
var col = $('<div class="col-12">');
var btnCol = $('<div class="col-12">');
var changeTempBtn = $('<button class="btn btn-light change-temp">Farenheit</button>');
var weatherBox = $('#weather-box');
var city = $('<div class="city col-12">');
var tempBox = $('<div class="temp-box col-12">');
var currentTemp = $('<div class="current-temp col-12">');
var tempMax = $('<div class="temp-max col text-right">');
var tempMin = $('<div class="temp-min col text-left">');
var weatherType = $('<div class="weather-type">');
var weatherIcon = $('<img class="weather-icon">');

var tMax;
var tMin;
var tCur;

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, showError);
}

function showPosition(position) {
    console.log(position);
    currentLong = position.coords.longitude;
    currentLat = position.coords.latitude;

    if (typeof currentLong === 'number' && typeof currentLat === 'number') {
        ajaxCall();
    }
}

function showError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            console.log('denied');
            weatherBox.append('<h2>User denied the request for Geolocation. Refresh the page and try again.<h2>');
            break;
        case error.POSITION_UNAVAILABLE:
            weatherBox.append('<h2>Location information is unavailable. Refresh the page and try again.<h2>');
            break;
        case error.TIMEOUT:
            weatherBox.append('<h2>The request to get user location timed out. Refresh the page and try again.<h2>');        
            break;
        case error.UNKNOWN_ERROR:
            weatherBox.append('<h2>An unknown error occurred. Refresh the page and try again.<h2>');  
            break;
    }
}

function ajaxCall() {
    $.ajax({
        url: 'https://fcc-weather-api.glitch.me/api/current?lat=' + currentLat + '&lon=' + currentLong,
    }).done(function (response) {
        console.log(response);
        tMax = Math.floor(response.main.temp_max);
        tMin = Math.floor(response.main.temp_min);
        tCur = Math.floor(response.main.temp);

        city.text(response.name);
        currentTemp.text('Current: ' + tCur + ' ℃');
        tempMax.text('Max: ' + tMax + ' ℃');
        tempMin.text('Min: ' + tMin + ' ℃');
        weatherIcon.attr('src', response.weather[0].icon);
        weatherType.text(response.weather[0].main);
        col.append(weatherType, weatherIcon);
        btnCol.append(changeTempBtn);
        row.append(currentTemp, tempMax, tempMin, btnCol);
        tempBox.append(row);
        weatherBox.append(city, col, tempBox);
    });
}


$('body').on('click', 'button.change-temp', function(){
    var currentF = Math.floor((tCur * (9/5)) + 32);
    var maxF = Math.floor((tMax * (9/5)) + 32);
    var minF = Math.floor((tMin * (9/5)) + 32);

    if($('.change-temp').text() === 'Farenheit') {
        $('.current-temp').text('Current: ' + currentF + ' ℉');
        $('.temp-max').text('Max: ' + maxF + ' ℉');
        $('.temp-min').text('Min: ' + minF + ' ℉');
        $('.change-temp').text('Celcius');
    } else {
        $('.current-temp').text('Current: ' + tCur + ' ℃');
        $('.temp-max').text('Max: ' + tMax + ' ℃');
        $('.temp-min').text('Min: ' + tMin + ' ℃');
        $('.change-temp').text('Farenheit'); 
    }
});