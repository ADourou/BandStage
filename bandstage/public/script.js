"use strict";

const registrationForm = document.getElementById('registrationForm');
const passwordInput = document.getElementById('password');
const band_passwordInput = document.getElementById('band_password');
const b_ConfirmPassInput = document.getElementById('b_ConfirmPass');
const confirmPassInput = document.getElementById('ConfirmPass');
const registrationFormBand = document.getElementById('registrationFormBand');

const errorMessage = document.getElementById('passwordError');
const errorMessageBand = document.getElementById('passwordErrorBand');

const strengthError = document.getElementById('strengthError');
const strengthErrorBand = document.getElementById('strengthErrorBand');

const togglePasswordIconUser = document.getElementById('togglePassword');
const toggleConfirmPasswordIconUser = document.getElementById('toggleConfirmPassword');
const togglePasswordBand = document.getElementById('togglePasswordBand');
const toggleconfirmPasswordBand = document.getElementById('toggleconfirmPasswordBand');

const jsonOutputUser = document.getElementById('jsonOutputUser');
const jsonOutputBand = document.getElementById('jsonOutputBand');

const verifyAddressBtn = document.getElementById('verifyAddressBtn');
const addressMessageDiv = document.getElementById('addressMessage');
const showMapBtn = document.getElementById('showMapBtn');
const mapContainer = document.getElementById('mapContainer');

const userCountry = document.getElementById('country');
const userCity = document.getElementById('city');
const userAddress = document.getElementById('address');

var globalLat = null;
var globalLon = null;
var map = null;

function setPosition(lat, lon) {
    var fromProjection = new OpenLayers.Projection("EPSG:4326");
    var toProjection = new OpenLayers.Projection("EPSG:900913");
    var position = new OpenLayers.LonLat(lon, lat).transform(fromProjection, toProjection);
    return position;
}

function handler(position, message) {
    var popup = new OpenLayers.Popup.FramedCloud("Popup",
        position, null,
        message, null,
        true // <-- true if we want a close (X) button
    );
    map.addPopup(popup);
}

registrationForm.addEventListener('input', function (event) {

    const passlength = passwordInput.value.length;
    let count = 0;

    if (passlength === 0) return;

    for (const char of passwordInput.value) {

        if (char >= 0 && char <= '9') {
            count++;
        }

    }

    const percentage = count / passlength * 100

    if (percentage >= 40) {
        strengthError.textContent = 'Weak password (too many numbers)';
        strengthError.style.color= 'red';
        strengthError.style.display = 'block';
        return;
    }

    let counts = {};

    for (const char of passwordInput.value) {
        if (counts[char]) {
            counts[char] = counts[char] + 1;
        }
        else {
            counts[char] = 1;
        }
    }

    const countValues = Object.values(counts);
    let maxCount;

    if (countValues.length > 0) {
        maxCount = Math.max(...countValues);
    }
    else {
        maxCount = 0;
    }

    const sameCharPercentage = (maxCount / passlength) * 100;
    if (sameCharPercentage >= 50) {
        strengthError.textContent = 'Weak password (Too many same characters)';
        strengthError.style.display = 'block';
        return;
    }

    let hasLower = false;
    let hasUpper = false;
    let hasNumber = false;
    let hasSymbol = false;

    const symbols = '#$%&@!^*?_+-';

    for (const char of passwordInput.value) {
        if (char >= 'a' && char <= 'z') {
            hasLower = true;
        } else if (char >= 'A' && char <= 'Z') {
            hasUpper = true;
        } else if (char >= '0' && char <= '9') {
            hasNumber = true;
        } else if (symbols.includes(char)) {
            hasSymbol = true;
        }
    }

    if (hasLower && hasUpper && hasNumber && hasSymbol) {
        strengthError.textContent = 'Strong password';
        strengthError.style.color = 'green';
        strengthError.style.display = 'block';
        return;
    }

    strengthError.textContent = 'Medium password';
    strengthError.style.color = 'orange';
    strengthError.style.display = 'block'

});

registrationFormBand.addEventListener('input', function (event) {

    const passlength = band_passwordInput.value.length;
    let count = 0;

    if (passlength === 0) return;

    for (const char of band_passwordInput.value) {

        if (char >= 0 && char <= '9') {
            count++;
        }

    }

    const percentage = count / passlength * 100

    if (percentage >= 40) {
        strengthErrorBand.textContent = 'Weak password (too many numbers)';
        strengthErrorBand.style.display = 'block';
        return;
    }

    let counts = {};

    for (const char of band_passwordInput.value) {
        if (counts[char]) {
            counts[char] = counts[char] + 1;
        }
        else {
            counts[char] = 1;
        }
    }

    const countValues = Object.values(counts);
    let maxCount;

    if (countValues.length > 0) {
        maxCount = Math.max(...countValues);
    }
    else {
        maxCount = 0;
    }

    const sameCharPercentage = (maxCount / passlength) * 100;
    if (sameCharPercentage >= 50) {
        strengthErrorBand.textContent = 'Weak password (Too many same characters)';
        strengthErrorBand.style.display = 'block';
        return;
    }

    let hasLower = false;
    let hasUpper = false;
    let hasNumber = false;
    let hasSymbol = false;

    const symbols = '#$%&@!^*?_+-';

    for (const char of band_passwordInput.value) {
        if (char >= 'a' && char <= 'z') {
            hasLower = true;
        } else if (char >= 'A' && char <= 'Z') {
            hasUpper = true;
        } else if (char >= '0' && char <= '9') {
            hasNumber = true;
        } else if (symbols.includes(char)) {
            hasSymbol = true;
        }
    }

    if (hasLower && hasUpper && hasNumber && hasSymbol) {
        strengthErrorBand.textContent = 'Strong password';
        strengthErrorBand.style.color = 'green';
        strengthErrorBand.style.display = 'block';
        return;
    }

    strengthErrorBand.textContent = 'Medium password';
    strengthErrorBand.style.color = 'orange';
    strengthErrorBand.style.display = 'block'

});

togglePasswordIconUser.addEventListener('click', function () {
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';

        togglePasswordIconUser.src = 'assets/hidden.png';
    } else {
        passwordInput.type = 'password';
        togglePasswordIconUser.src = 'assets/view.png';
    }
});

toggleConfirmPasswordIconUser.addEventListener('click', function () {
    if (confirmPassInput.type === 'password') {
        confirmPassInput.type = 'text';

        toggleConfirmPasswordIconUser.src = 'assets/hidden.png';
    } else {
        confirmPassInput.type = 'password';
        toggleConfirmPasswordIconUser.src = 'assets/view.png';
    }
});

togglePasswordBand.addEventListener('click', function () {
    if (band_passwordInput.type === 'password') {
        band_passwordInput.type = 'text';

        togglePasswordBand.src = 'assets/hidden.png';
    } else {
        band_passwordInput.type = 'password';
        togglePasswordBand.src = 'assets/view.png';
    }
});

toggleconfirmPasswordBand.addEventListener('click', function () {
    if (b_ConfirmPassInput.type === 'password') {
        b_ConfirmPassInput.type = 'text';

        toggleconfirmPasswordBand.src = 'assets/hidden.png';
    } else {
        b_ConfirmPassInput.type = 'password';
        toggleconfirmPasswordBand.src = 'assets/view.png';
    }
});

registrationForm.addEventListener('submit', function (event) {
    event.preventDefault();

    errorMessage.style.display = 'none';
    strengthError.style.display = 'none';
    jsonOutputUser.style.display = 'none';
    jsonOutputBand.style.display = 'none';

    const passwordValue = passwordInput.value;
    const confirmPassValue = confirmPassInput.value;
    const passwordLower = passwordInput.value.toLowerCase();
    const totalLength = passwordInput.value.length;

    if (passwordValue !== confirmPassValue) {
        errorMessage.textContent = 'Codes do not match!';
        errorMessage.style.display = 'block';
        return;
    }

    if (passwordLower.includes('band') ||
        passwordLower.includes('music') ||
        passwordLower.includes('mpanta') ||
        passwordLower.includes('mousiki')) {

        errorMessage.textContent = 'Password contains non allowed words (e.g., "band", "music").';
        errorMessage.style.display = 'block';
        return;
    }

    let numberCount = 0;
    for (const char of passwordInput.value) {
        if (char >= '0' && char <= '9') { numberCount++; }
    }

    let numberPercentage = 0; 

    if (totalLength > 0) {
        numberPercentage = (numberCount / totalLength) * 100;
    }

    if (numberPercentage >= 40) {
        strengthError.textContent = 'Weak password (Too many numbers). Cannot submit.';
        strengthError.style.display = 'block';
        return;
    }

    let counts = {};

    for (const char of passwordValue) {
        if (counts[char]) {
            counts[char] = counts[char] + 1;
        } else {
            counts[char] = 1;
        }
    }

    const countValues = Object.values(counts);

    let maxCount;

    if (countValues.length > 0) {
        maxCount = Math.max(...countValues);
    } else {
        maxCount = 0;
    }

    let sameCharPercentage;

    if (totalLength > 0) {
        sameCharPercentage = (maxCount / totalLength) * 100;
    } else {
        sameCharPercentage = 0;
    }

    if (sameCharPercentage >= 50) {
        strengthError.textContent = 'Weak password (Too many same characters). Cannot submit.';
        strengthError.style.display = 'block';
        return;
    }

    strengthError.style.display = 'none';

    const formData = new FormData(registrationForm);
    const formObject = Object.fromEntries(formData.entries());

    if (globalLat && globalLon) {
        formObject.lat = globalLat;
        formObject.lon = globalLon;
    } else {
        formObject.lat = 35.3387; 
        formObject.lon = 25.1442;
    }

    fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formObject) 
    })
    .then(function(response) {
        
        if (response.ok) {
            return response.json(); 
        } else {
            return response.json().then(function(errData) {
                throw new Error(errData.message); 
            });
        }
    })
    .then(function(data) {
        alert("Success: " + data.message);
    })
    .catch(function(error) {
        alert("Error: " + error.message);
    });
});

registrationFormBand.addEventListener('submit', function (event) {
    event.preventDefault();

    errorMessageBand.style.display = 'none';
    strengthErrorBand.style.display = 'none';
    jsonOutputUser.style.display = 'none';
    jsonOutputBand.style.display = 'none';

    const passwordValue = band_passwordInput.value;
    const confirmPassValue = b_ConfirmPassInput.value;
    const passwordLower = band_passwordInput.value.toLowerCase();
    const totalLength = band_passwordInput.value.length;

    if (passwordValue !== confirmPassValue) {
        errorMessageBand.textContent = 'Codes do not match!';
        errorMessageBand.style.display = 'block';
        return;
    }

    if (passwordLower.includes('band') ||
        passwordLower.includes('music') ||
        passwordLower.includes('mpanta') ||
        passwordLower.includes('mousiki')) {

        errorMessageBand.textContent = 'Password contains non allowed words (e.g., "band", "music").';
        errorMessageBand.style.display = 'block';
        return;
    }

    let numberCount = 0;
    for (const char of passwordValue) {
        if (char >= '0' && char <= '9') { numberCount++; }
    }

    let numberPercentage = 0;
    if (totalLength > 0) {
        numberPercentage = (numberCount / totalLength) * 100;
    }

    if (numberPercentage >= 40) {
        strengthErrorBand.textContent = 'Weak password (Too many numbers). Cannot submit.';
        strengthErrorBand.style.display = 'block';
        return;
    }

    let counts = {};
    for (const char of passwordValue) {
        if (counts[char]) {
            counts[char] = counts[char] + 1;
        } else {
            counts[char] = 1;
        }
    }

    const countValues = Object.values(counts);
    let maxCount;
    if (countValues.length > 0) {
        maxCount = Math.max(...countValues);
    } else {
        maxCount = 0;
    }

    let sameCharPercentage;
    if (totalLength > 0) {
        sameCharPercentage = (maxCount / totalLength) * 100;
    } else {
        sameCharPercentage = 0;
    }

    if (sameCharPercentage >= 50) {
        strengthErrorBand.textContent = 'Weak password (Too many same characters). Cannot submit.';
        strengthErrorBand.style.display = 'block';
        return;
    }
    
    strengthErrorBand.style.display = 'none';

    const formData = new FormData(registrationFormBand);
    const formObject = Object.fromEntries(formData.entries());

    if (globalLat && globalLon) {
        formObject.lat = globalLat;
        formObject.lon = globalLon;
    }

    fetch('/registerBand', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formObject)
    })
    .then(function(response) {
        if (response.ok) return response.json();
        return response.json().then(function(errData) { throw new Error(errData.message); });
    })
    .then(function(data) {
        alert("Band Registered Successfully: " + data.message);
    })
    .catch(function(error) {
        alert("Registration Failed: " + error.message);
    });
});

function loadDoc() {
    
    const countryText = userCountry.options[userCountry.selectedIndex].text;
    const cityText = userCity.value;
    const addressText = userAddress.value;

    if (!countryText || !cityText || !addressText) {
        addressMessageDiv.innerHTML = "You have to fill Country, City and Address.";
        addressMessageDiv.style.color = "red";
        return;
    }

    const fullAddress = addressText + ", " + cityText + ", " + countryText;

    const data = null;
    const xhr = new XMLHttpRequest();
    xhr.withCredentials = false; 

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === this.DONE) {
            
            try {
                const obj = JSON.parse(this.responseText); 
                
                if (obj.length === 0) {
                    addressMessageDiv.innerHTML = "Location not found. Check your information";
                    addressMessageDiv.style.color = "red";
                    globalLat = null;
                    globalLon = null;
                    showMapBtn.style.display = 'none';
                } else {
                    const firstResult = obj[0];

                    if (!firstResult.display_name.includes("Greece")) {
                        addressMessageDiv.innerHTML = "Service available ONLY in Greece";
                        addressMessageDiv.style.color = "orange";
                        globalLat = null;
                        globalLon = null;
                        showMapBtn.style.display = 'none';
                    } else {
                        globalLat = firstResult.lat;
                        globalLon = firstResult.lon;
                        
                        addressMessageDiv.innerHTML = `Success: ${firstResult.display_name}`;
                        addressMessageDiv.style.color = "green";
                        
                        showMapBtn.style.display = 'block';
                        mapContainer.style.display = 'none';
                    }
                }
            } catch (e) {
                addressMessageDiv.innerHTML = "Couldn't establish connection";
                addressMessageDiv.style.color = "red";
            }
        }
    });

    const url = "https://forward-reverse-geocoding.p.rapidapi.com/v1/search?q=" + 
                encodeURIComponent(fullAddress) + 
                "&accept-language=en&polygon_threshold=0.0";

    xhr.open("GET", url);
    xhr.setRequestHeader("x-rapidapi-host", "forward-reverse-geocoding.p.rapidapi.com");
    xhr.setRequestHeader("x-rapidapi-key", "98c2f5543cmsh26d54a3c45124f1p124127jsn14fefd728911"); 

    addressMessageDiv.innerHTML = "Checking the Address...";
    addressMessageDiv.style.color = "aliceblue";
    xhr.send(data);
}

function showMap() {
    if (globalLat && globalLon) {
        
        if (map) {
            map.destroy();
        }

        mapContainer.innerHTML = ''; 
        mapContainer.style.display = 'block';

        
        map = new OpenLayers.Map("mapContainer");
        var mapnik = new OpenLayers.Layer.OSM();
        map.addLayer(mapnik);


        var position = setPosition(globalLat, globalLon);

        var markers = new OpenLayers.Layer.Markers("Markers");
        map.addLayer(markers);
        
        var mar = new OpenLayers.Marker(position);
        markers.addMarker(mar);
        
        mar.events.register('mousedown', mar, function(evt) { 
             handler(position, 'Your Address!'); 
        });

        const zoom = 16; 
        map.setCenter(position, zoom);
        
    } else {
        addressMessageDiv.innerHTML = "Error: no coordinates";
        addressMessageDiv.style.color = "red";
    }
}

function invalidateAddress() {
    addressMessageDiv.innerHTML = "Changed Address. Refresh.";
    addressMessageDiv.style.color = "orange";
    showMapBtn.style.display = 'none';
    mapContainer.style.display = 'none';
    mapContainer.innerHTML = '';
    globalLat = null;
    globalLon = null;
    
    if (map) {
        map.destroy();
        map = null;
    }
}

verifyAddressBtn.addEventListener('click', loadDoc);
showMapBtn.addEventListener('click', showMap);

userCountry.addEventListener('change', invalidateAddress);
userCity.addEventListener('input', invalidateAddress);
userAddress.addEventListener('input', invalidateAddress);