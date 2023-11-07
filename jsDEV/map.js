
let map;

// // A function that takes an array of data and a time value as parameters
// function showMap(data, time) {
//     // Where you want to render the map.
//     var element = document.getElementById("map");

//     // Set the element widht and height to fill the screen. - 100px at the top for the title.
//     element.style = "height: calc(100vh - 100px); width: calc(100vw - 50px);";

//     // Create Leaflet map on map element.
//     map = L.map(element);

//     // Create a tile layer from OpenStreetMap
//     var osmLayer = L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
//         attribution: '© <a href="^4^">OpenStreetMap</a> contributors'
//     });

//     // Add the tile layer to the map
//     osmLayer.addTo(map);


//     // Add OSM tile layer to the Leaflet map.
//     L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
//         attribution:
//             '© <a href="^9^">OpenStreetMap</a> contributors',
//     }).addTo(map);

//     // Set map's center to the first location in the data array with zoom 14.
//     map.setView([data[0].lat, data[0].lon], 14);

//     var blueMarker = L.divIcon({
//         html: '<span style="background-color: #279EFF; width: 20px; height: 20px; display: block; border-radius: 50%;"></span>'
//     });

//     var yellowMarker = L.divIcon({
//         html: '<span style="background-color: #FCE38A; width: 20px; height: 20px; display: block; border-radius: 50%;"></span>'
//     });

//     var redMarker = L.divIcon({
//         html: '<span style="background-color: #F38181; width: 20px; height: 20px; display: block; border-radius: 50%;"></span>'
//     });

//     var greenMarker = L.divIcon({
//         html: '<span style="background-color: #95E1D3; width: 20px; height: 20px; display: block; border-radius: 50%;"></span>'
//     });


//     // Loop through the data array
//     for (var i = 0; i < data.length; i++) {
//         // Get the current location
//         var location = data[i];
//         let name = location.name;

//         // Create a marker on the map for the current location

//         let marker;

//         if (location.color === "blue") {
//             marker = L.marker([location.lat, location.lon], { icon: blueMarker }).addTo(map);
//         }
//         else if (location.color === "yellow") {
//             marker = L.marker([location.lat, location.lon], { icon: yellowMarker }).addTo(map);
//         }
//         else if (location.color === "red") {
//             marker = L.marker([location.lat, location.lon], { icon: redMarker }).addTo(map);
//         }
//         else if (location.color === "green") {
//             marker = L.marker([location.lat, location.lon], { icon: greenMarker }).addTo(map);
//         } else {
//             marker = L.marker([location.lat, location.lon]).addTo(map);
//         }


//         // var marker = L.marker([location.lat, location.lon], { icon: blueMarker }).addTo(map);

//         // Initialize a variable to store the number of cars
//         var cars = 0;

//         // Loop through the times array of the current location
//         for (var j = 0; j < location.times.length; j++) {
//             // Get the current time object
//             var timeObj = location.times[j];

//             // Check if the time value matches the parameter
//             if (timeObj.time === time) {
//                 // Update the number of cars
//                 cars = timeObj.cars;
//                 // Break out of the loop
//                 break;
//             }
//         }

//         // Create a popup with the number of cars as the content
//         var popup = L.popup().setContent(name + "<br>" + cars + " cars have passed here from " + time + " until " + addTime(time) + " o'clock. <br> Location: " + location.lat + ", " + location.lon + ".");

//         // Bind the popup to the marker
//         marker.bindPopup(popup);
//     }

//     document.getElementById("pre").classList.add("hidden");
// }

let mapS = "http://{s}.tile.osm.org/{z}/{x}/{y}.png";

// A function that takes an array of data and a start and end time as parameters
function showMap(data, start, end, mapStyle) {
    // Where you want to render the map.
    var element = document.getElementById("map");

    // Set the element widht and height to fill the screen. - 100px at the top for the title.
    element.style = "height: calc(100vh); width: calc(100vw);";

    // Create Leaflet map on map element.
    map = L.map(element, {
        zoomControl: false
    });

    // Create a tile layer from OpenStreetMap
    var osmLayer = L.tileLayer(mapStyle, {
        attribution: '© <a target="_blank" href="https://erzen.tk">Erzen Krasniqi</a>'
    });

    // Add the tile layer to the map
    osmLayer.addTo(map);


    // Add OSM tile layer to the Leaflet map.
    L.tileLayer(mapStyle, {
        attribution:
            '© <a target="_blank" href="https://erzen.tk">Erzen Krasniqi</a>',
    }).addTo(map);

    L.control.zoom({
        position: 'bottomleft'
    }).addTo(map);

    // Set map's center to the first location in the data array with zoom 14.
    map.setView([data[0].lat, data[0].lon], 14,);

    var blueMarker = L.divIcon({
        html: '<span style="background-color: #279EFF; width: 20px; height: 20px; display: block; border-radius: 50%;"></span>'
    });

    var yellowMarker = L.divIcon({
        html: '<span style="background-color: #FCE38A; width: 20px; height: 20px; display: block; border-radius: 50%;"></span>'
    });

    var redMarker = L.divIcon({
        html: '<span style="background-color: #F38181; width: 20px; height: 20px; display: block; border-radius: 50%;"></span>'
    });

    var greenMarker = L.divIcon({
        html: '<span style="background-color: #95E1D3; width: 20px; height: 20px; display: block; border-radius: 50%;"></span>'
    });

    let ttCars = 0;

    // Loop through the data array
    for (var i = 0; i < data.length; i++) {
        // Get the current location
        var location = data[i];
        let name = location.name;

        // Create a marker on the map for the current location

        let marker;

        if (location.color === "blue") {
            marker = L.marker([location.lat, location.lon], { icon: blueMarker }).addTo(map);
        }
        else if (location.color === "yellow") {
            marker = L.marker([location.lat, location.lon], { icon: yellowMarker }).addTo(map);
        }
        else if (location.color === "red") {
            marker = L.marker([location.lat, location.lon], { icon: redMarker }).addTo(map);
        }
        else if (location.color === "green") {
            marker = L.marker([location.lat, location.lon], { icon: greenMarker }).addTo(map);
        } else {
            marker = L.marker([location.lat, location.lon]).addTo(map);
        }


        // var marker = L.marker([location.lat, location.lon], { icon: blueMarker }).addTo(map);

        // Initialize a variable to store the total number of cars
        var totalCars = 0;

        // Loop through the times array of the current location
        for (var j = 0; j < location.times.length; j++) {
            // Get the current time object
            var timeObj = location.times[j];

            // Check if the time value is within the start and end parameters
            if (timeObj.time >= start && timeObj.time <= end) {
                // Add the number of cars to the total
                totalCars += timeObj.cars;
                ttCars += timeObj.cars;
            }
        }

        let c;

        if (location.color === "blue") {
            c = "#279EFF";
        } else if (location.color === "yellow") {
            c = "#FCE38A";
        }
        else if (location.color === "red") {
            c = "#F38181";
        }
        else if (location.color === "green") {
            c = "#95E1D3";
        }

        // Create a popup with the total number of cars as the content
        var popup = L.popup().setContent(`<h3>${name} <span style="color: ${c}">•</span></h3>` + `<br><strong>` + totalCars + "</strong> cars have passed here from <i>" + start + "</i> until <i>" + end + "</i> o'clock. <br> Location: " + `<a target="_blank" href="https://maps.google.com/?q=${location.lat},${location.lon}">${location.lat},${location.lon}</a>` + ".");

        // Bind the popup to the marker
        marker.bindPopup(popup);
    }

    document.getElementById("totalCars").innerHTML = `<strong>${ttCars}</strong> cars have circulated in Prishtina from <i>${start}</i> until <i>${end}</i> o'clock.`;

    document.getElementById("pre").classList.add("hidden");

    if (mapS == "http://{s}.tile.osm.org/{z}/{x}/{y}.png" && body.classList.contains("dark")) {
        var styles = `
        .leaflet-layer,
        .leaflet-control-zoom-in,
        .leaflet-control-zoom-out,
        .leaflet-control-attribution {
          filter: invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%);
        }
        `;

        var styleSheet = document.createElement("style")
        styleSheet.innerText = styles

        document.head.appendChild(styleSheet)
    } else {
        var styles = `
        .leaflet-layer,
        .leaflet-control-zoom-in,
        .leaflet-control-zoom-out,
        .leaflet-control-attribution {
          filter: invert(0%) hue-rotate(0deg) brightness(100%) contrast(100%);
        }
        `;

        var styleSheet = document.createElement("style")
        styleSheet.innerText = styles

        document.head.appendChild(styleSheet);
    }
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

let start;
let end;

document.getElementById("time").addEventListener("change", function () {
    // Get the current time value in format 'hh:mm'
    start = this.value;

    // Convert the selected time to minutes
    const [startHour, startMinute] = start.split(':').map(Number);
    const startMinutes = startHour * 60 + startMinute;

    // Now disable the end time select options that are before the start time
    var endTimeSelect = document.getElementById("time2");

    // Loop through the options
    for (var i = 0; i < endTimeSelect.options.length; i++) {
        // Get the current option
        var option = endTimeSelect.options[i];

        // Get the option value in format 'hh:mm'
        var end = option.value;

        // Convert the option time to minutes
        const [endHour, endMinute] = end.split(':').map(Number);
        const endMinutes = endHour * 60 + endMinute;

        // Check if the option time is before the start time
        if (endMinutes <= startMinutes) {
            // Disable the option
            option.disabled = true;
        } else {
            // Enable the option
            option.disabled = false;
        }
    }
});

document.getElementById("time2").addEventListener("change", function () {
    // Get the end time value
    end = this.value;
    // Destroy the map if it exists
    if (map) {
        map.remove();
    }
    // Call your showMap function with the selected start and end times
    showMap(data, start, end, mapS);
});


function refresh() {
    // Destroy the map if it exists
    if (map) {
        map.remove();
    }

    if (start && end) {
        showMap(data, start, end, mapS);
        // Rotate the refresh button
        document.getElementById("refresh").classList.add("rotate");
        // Remove the rotation after 1 second
        setTimeout(function () {
            document.getElementById("refresh").classList.remove("rotate");
        }, 500);
    } else {
        showMap(data, "06:00", "17:45", mapS);
        document.getElementById("refresh").classList.add("rotate");
        // Remove the rotation after 1 second
        setTimeout(function () {
            document.getElementById("refresh").classList.remove("rotate");
        }, 500);
    }
}

const body = document.querySelector("body"),
    modeToggle = body.querySelector("#theme-switcher");


let getMode = localStorage.getItem("mode");

if (getMode && getMode === "dark") {
    body.classList.toggle("dark");
    // Add the following css code to the head of the document


    if (mapS == "http://{s}.tile.osm.org/{z}/{x}/{y}.png") {
        var styles = `
        .leaflet-layer,
        .leaflet-control-zoom-in,
        .leaflet-control-zoom-out,
        .leaflet-control-attribution {
          filter: invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%);
        }
        `;

        var styleSheet = document.createElement("style")
        styleSheet.innerText = styles

        document.head.appendChild(styleSheet)
    }
}


modeToggle.addEventListener("click", () => {
    body.classList.toggle("dark");
    if (body.classList.contains("dark")) {
        localStorage.setItem("mode", "dark");

        // Add the following css code to the head of the document

        if (mapS == "http://{s}.tile.osm.org/{z}/{x}/{y}.png") {
            var styles = `
            .leaflet-layer,
            .leaflet-control-zoom-in,
            .leaflet-control-zoom-out,
            .leaflet-control-attribution {
              filter: invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%);
            }
            `;

            var styleSheet = document.createElement("style")
            styleSheet.innerText = styles

            document.head.appendChild(styleSheet)
        }

    } else {
        localStorage.setItem("mode", "light");

        // Remove the css code from the head of the document

        var styles = `
            .leaflet-layer,
            .leaflet-control-zoom-in,
            .leaflet-control-zoom-out,
            .leaflet-control-attribution {
              filter: invert(0%) hue-rotate(0deg) brightness(100%) contrast(100%);
            }
            `;

        var styleSheet = document.createElement("style")
        styleSheet.innerText = styles

        document.head.appendChild(styleSheet)
    }
});



function changeMapStyle(url) {
    // Destroy the map if it exists
    if (map) {
        map.remove();
    }

    mapS = url;

    if (start && end) {
        showMap(data, start, end, url);
        mapS = url;
        document.getElementById("refresh").classList.add("rotate");
        setTimeout(function () {
            document.getElementById("refresh").classList.remove("rotate");
        }, 500);
    }
    else {
        showMap(data, "06:00", "17:45", url);
        mapS = url;
        document.getElementById("refresh").classList.add("rotate");
        setTimeout(function () {
            document.getElementById("refresh").classList.remove("rotate");
        }, 500);
    }
}

showMap(data, "06:00", "17:45", mapS);
