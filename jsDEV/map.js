

let data = [

    {   // Te furra qerimi
        lat: "42.654109", lon: "21.167656", name: "Udhëkryqi tek Furra Qerimi", times: [
            { time: "00:00", cars: 10 },
            { time: "01:00", cars: 35 },
            { time: "02:00", cars: 71 },
            { time: "03:00", cars: 88 },
            { time: "04:00", cars: 250 },
        ]
    },

    // Te fakulti teknik
    {
        lat: "42.650304", lon: "21.164780", name: "Udhëkryqi ket Fakulteti Teknik", times: [
            { time: "00:00", cars: 12 },
            { time: "01:00", cars: 58 },
            { time: "02:00", cars: 98 },
            { time: "03:00", cars: 55 },
            { time: "04:00", cars: 45 },
        ]
    },

    // Te mensa e studenteve
    {
        lat: "42.654913", lon: "21.163657", name: "Udhëkryqi tek Mensa e Studenteve", times: [
            { time: "00:00", cars: 32 },
            { time: "01:00", cars: 13 },
            { time: "02:00", cars: 72 },
            { time: "03:00", cars: 42 },
            { time: "04:00", cars: 12 },
        ]
    },

]

let map;

// A function that takes an array of data and a time value as parameters
function showMap(data, time) {
    // Where you want to render the map.
    var element = document.getElementById("map");

    // Set the element widht and height to fill the screen. - 100px at the top for the title.
    element.style = "height: calc(100vh - 100px); width: calc(100vw - 50px);";

    // Create Leaflet map on map element.
    map = L.map(element);

    // Create a tile layer from OpenStreetMap
    var osmLayer = L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
        attribution: '© <a href="^4^">OpenStreetMap</a> contributors'
    });

    // Add the tile layer to the map
    osmLayer.addTo(map);


    // Add OSM tile layer to the Leaflet map.
    L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
        attribution:
            '© <a href="^9^">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Set map's center to the first location in the data array with zoom 14.
    map.setView([data[0].lat, data[0].lon], 14);

    // Loop through the data array
    for (var i = 0; i < data.length; i++) {
        // Get the current location
        var location = data[i];
        let name = location.name;

        // Create a marker on the map for the current location
        // Create a marker on the map for the current location
        var marker = L.marker([location.lat, location.lon]).addTo(map);

        // Initialize a variable to store the number of cars
        var cars = 0;

        // Loop through the times array of the current location
        for (var j = 0; j < location.times.length; j++) {
            // Get the current time object
            var timeObj = location.times[j];

            // Check if the time value matches the parameter
            if (timeObj.time === time) {
                // Update the number of cars
                cars = timeObj.cars;
                // Break out of the loop
                break;
            }
        }

        // Create a popup with the number of cars as the content
        var popup = L.popup().setContent(name + "<br>" + cars + " cars have passed here from " + time + " until " + addTime(time) + " o'clock. <br> Location: " + location.lat + ", " + location.lon + ".");

        // Bind the popup to the marker
        marker.bindPopup(popup);
    }

    document.getElementById("pre").classList.add("hidden");
}

function addTime(inputTime) {
    // Split the input time into hours and minutes
    const [hours, minutes] = inputTime.split(':').map(Number);

    // Convert the time into minutes
    let totalMinutes = hours * 60 + minutes;

    // Add 15 minutes
    totalMinutes += 15;

    // Convert back to hours and minutes
    const newHours = Math.floor(totalMinutes / 60);
    const newMinutes = totalMinutes % 60;

    // Format the output
    const formattedHours = newHours < 10 ? `0${newHours}` : newHours;
    const formattedMinutes = newMinutes < 10 ? `0${newMinutes}` : newMinutes;

    return `${formattedHours}:${formattedMinutes}`;
}


// Call the showMap function after an option is selected in select element

document.getElementById("time").addEventListener("change", function () {


    // Destory the map if it exists
    if (map) {
        map.remove();
    }


    showMap(data, this.value);
});


// showMap(data, "04:00");