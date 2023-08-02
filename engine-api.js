// async function getData() {
//     let city = document.getElementById("city").value;
//     let duration = document.getElementById("duration").value;
//     let bonus = document.getElementById("bonus").value;
//     let cars = document.getElementById("cars").value;

//     let graph = [];

//     const apiUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${city}&polygon_geojson=1`;

//     try {
//         toast("Please wait... Fetching data from OpenStreetMap API");
//         // Fetch data from OpenStreetMap API
//         const response = await fetch(apiUrl);
//         const data = await response.json();

//         // Extract the bounding box coordinates of the city
//         const boundingBox = data[0].boundingbox;
//         const bbox = `${boundingBox[2]},${boundingBox[0]},${boundingBox[3]},${boundingBox[1]}`;

//         // Query for all streets within the city's bounding box
//         const streetsUrl = `https://overpass-api.de/api/interpreter?data=[out:json];way(${bbox})[%22highway%22];out;`;
//         const streetsResponse = await fetch(streetsUrl);
//         const streetsData = await streetsResponse.json();
//         console.log(streetsData);

//         if (streetsData.elements.length == 0) {
//             toast("Error City was not found in the database");
//             return false;
//         }

//         let dataResult = [];

//         // Extract the street data and format it as required
//         let result = [];
//         let intersectionId = 0;
//         let key = 0;

//         let intersectionsV = 0;

//         // streetsData.elements.forEach(street => {
//         //     const streetId = street.id;
//         //     const streetName = street.tags.name;
//         //     const intersections = street.nodes;

//         //     for (let i = 0; i < intersections.length - 1; i++) {
//         //         const startIntersection = intersections[i];
//         //         const endIntersection = intersections[i + 1];
//         //         result.push(`${startIntersection} ${endIntersection} street${key} ${getRandomInt(1, 7)}`);
//         //         key++;
//         //         intersectionsV = intersections.length + 1;
//         //     }

//         // });

//         let intersectionMap = new Map();

//         streetsData.elements.forEach(street => {
//             const streetId = street.id;
//             const streetName = street.tags.name;
//             const intersections = street.nodes;

//             // if (intersections.length == 0 || street == undefined) {
//             //     toast("Error", "City was not found in the database", "error");
//             //     return false;
//             // }

//             for (let i = 0; i < intersections.length - 1; i++) {
//                 const startIntersection = intersections[i];
//                 const endIntersection = intersections[i + 1];

//                 if (!intersectionMap.has(startIntersection)) {
//                     intersectionMap.set(startIntersection, new Set());
//                 }
//                 intersectionMap.get(startIntersection).add(endIntersection);

//                 if (!intersectionMap.has(endIntersection)) {
//                     intersectionMap.set(endIntersection, new Set());
//                 }
//                 intersectionMap.get(endIntersection).add(startIntersection);
//                 intersectionsV = intersections.length + 1;
//             }
//         });

//         for (const [startIntersection, connectedIntersections] of intersectionMap.entries()) {
//             const startIntersectionId = startIntersection;
//             for (const endIntersection of connectedIntersections) {
//                 const endIntersectionId = endIntersection;
//                 let ran = getRandomInt(1, 7);
//                 result.push(`${startIntersectionId} ${endIntersectionId} street${key} ${ran}`);
//                 graph.push(`${startIntersectionId} ${endIntersectionId} street${key} ${ran}`);
//                 key++;
//             }
//         }


//         let temp = key + 1;

//         dataResult.push(`${duration} ${intersectionsV} ${temp} ${cars} ${bonus}`);
//         let b = result.join("\n");
//         dataResult.push(b);


//         let carsArr = [];

//         // generate cars
//         for (let i = 0; i < cars; i++) {
//             const P = Math.floor(Math.random() * 10) + 2; // random number between 2 and 11
//             const path = Array.from({ length: P }, (_, i) => `street${Math.floor(Math.random() * key)}`);

//             let set = new Set(path);
//             let clo = [...set]; // Change to path to allow duplicates

//             carsArr.push(`${clo.length} ${clo.join(" ")}`);
//         }

//         let carsStr = carsArr.join("\n");

//         dataResult.push(carsStr);

//         let rr = dataResult.join("\n");


//         // Create graphs

//         if (intersectionsV <= 750 && temp <= 1999) {
//             toast("Success The city was found in the database and the data was successfully generated");
//             setTimeout(() => {
//                 toast("Please wait... Generating graphs");
//                 setTimeout(() => {
//                     let graph20 = graph.join("\n");
//                     createGraph(graph20, "network");
//                     createGraph2(carsStr);
//                 }, 5000);

//             }, 1000);
//         }



//         // Log the formatted result

//         const blob = new Blob([rr], { type: "text/plain" });
//         const url = URL.createObjectURL(blob);
//         const downloadLink = document.createElement("a");
//         downloadLink.href = url;
//         downloadLink.download = `D:${new Date().getTime()}.txt`;
//         document.body.appendChild(downloadLink);
//         downloadLink.click();
//         document.body.removeChild(downloadLink);

//         toast("Success The data was successfully generated");

//         return result;
//     } catch (error) {
//         toast("Error The city was not found in the database or an error has occurred");
//         console.error('Error:', error);
//         return null;
//     }
// }



// function getRandomInt(min, max) {
//     let minB, maxB;
//     minB = Math.ceil(Number(min));
//     maxB = Math.floor(Number(max));
//     return Math.floor(Math.random() * (maxB - minB + 1)) + minB;
// }

// // GOOD!!!

// // function getTrafficDataOld(city) {
// //     const cityEndpoint = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1`;

// //     fetch(cityEndpoint)
// //         .then(response => response.json())
// //         .then(data => {
// //             if (data.length === 0) {
// //                 throw new Error('City not found.');
// //             }

// //             const cityData = data[0];
// //             const cityId = cityData.place_id;
// //             const bbox = cityData.boundingbox;

// //             const mapEndpoint = `https://api.openstreetmap.org/api/0.6/map?bbox=${bbox[2]},${bbox[0]},${bbox[3]},${bbox[1]}`;

// //             fetch(mapEndpoint)
// //                 .then(response => response.text())
// //                 .then(data => {
// //                     const parser = new DOMParser();
// //                     const xmlDoc = parser.parseFromString(data, 'application/xml');

// //                     let intersections = {};
// //                     let streets = [];

// //                     const nodes = xmlDoc.getElementsByTagName('node');
// //                     for (const node of nodes) {
// //                         intersections[node.getAttribute('id')] = {
// //                             lat: node.getAttribute('lat'),
// //                             lon: node.getAttribute('lon')
// //                         };
// //                     }
// //                     let x = 0;

// //                     const ways = xmlDoc.getElementsByTagName('way');
// //                     for (const way of ways) {
// //                         const nds = way.getElementsByTagName('nd');
// //                         const nodes = Array.from(nds).map(nd => nd.getAttribute('ref'));

// //                         for (let i = 0; i < nodes.length - 1; i++) {
// //                             const nameTag = way.querySelector('tag[k="name"]');

// //                             const name = nameTag ? nameTag.getAttribute('v') : `street-${x}`; //street-${x}`;
// //                             x++;
// //                             streets.push({
// //                                 start: nodes[i],
// //                                 end: nodes[i + 1],
// //                                 name: name
// //                             });
// //                         }
// //                     }

// //                     let result = '';

// //                     for (const street of streets) {
// //                         const start = street.start;
// //                         const end = street.end;
// //                         const name = street.name;

// //                         result += `${start} ${end} ${name} ${getRandomInt(1, 7)}\n`;
// //                     }

// //                     console.log(result);
// //                 })
// //                 .catch(error => {
// //                     console.error('Error:', error.message);
// //                 });
// //         })
// //         .catch(error => {
// //             console.error('Error:', error.message);
// //         });
// // }


// // function getTrafficDataOld(city) {
// //     const cityEndpoint = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1`;

// //     fetch(cityEndpoint)
// //         .then(response => response.json())
// //         .then(data => {
// //             if (data.length === 0) {
// //                 throw new Error('City not found.');
// //             }

// //             const cityData = data[0];
// //             const cityId = cityData.place_id;
// //             const bbox = cityData.boundingbox;

// //             const latMin = parseFloat(bbox[0]);
// //             const latMax = parseFloat(bbox[1]);
// //             const lonMin = parseFloat(bbox[2]);
// //             const lonMax = parseFloat(bbox[3]);

// //             const latRange = latMax - latMin;
// //             const lonRange = lonMax - lonMin;

// //             const latStep = latRange / 50;
// //             const lonStep = lonRange / 50;

// //             let requests = [];
// //             for (let i = 0; i < 50; i++) {
// //                 const partLatMin = latMin + latStep * i;
// //                 const partLatMax = partLatMin + latStep;
// //                 const partLonMin = lonMin + lonStep * i;
// //                 const partLonMax = partLonMin + lonStep;

// //                 const mapEndpoint = `https://api.openstreetmap.org/api/0.6/map?bbox=${partLonMin},${partLatMin},${partLonMax},${partLatMax}`;
// //                 requests.push(fetch(mapEndpoint));
// //             }

// //             Promise.all(requests)
// //                 .then(responses => Promise.all(responses.map(response => response.text())))
// //                 .then(datas => {
// //                     let intersections = {};
// //                     let streets = [];

// //                     for (const data of datas) {
// //                         const parser = new DOMParser();
// //                         const xmlDoc = parser.parseFromString(data, 'application/xml');

// //                         const nodes = xmlDoc.getElementsByTagName('node');
// //                         for (const node of nodes) {
// //                             intersections[node.getAttribute('id')] = {
// //                                 lat: node.getAttribute('lat'),
// //                                 lon: node.getAttribute('lon')
// //                             };
// //                         }

// //                         let x = streets.length;
// //                         const ways = xmlDoc.getElementsByTagName('way');
// //                         for (const way of ways) {
// //                             const nds = way.getElementsByTagName('nd');
// //                             const wayNodes = Array.from(nds).map(nd => nd.getAttribute('ref'));

// //                             for (let i = 0; i < wayNodes.length - 1; i++) {
// //                                 const nameTag = way.querySelector('tag[k="name"]');
// //                                 const name = nameTag ? nameTag.getAttribute('v') : `street-${x++}`;

// //                                 streets.push({
// //                                     start: wayNodes[i],
// //                                     end: wayNodes[i + 1],
// //                                     name: name
// //                                 });
// //                             }
// //                         }
// //                     }

// //                     let result = '';

// //                     for (const street of streets) {
// //                         const start = street.start;
// //                         const end = street.end;
// //                         const name = street.name;

// //                         result += `${start} ${end} ${name} ${getRandomInt(1, 7)}\n`;
// //                     }

// //                     console.log(result);
// //                 })
// //                 .catch(error => {
// //                     console.error('Error:', error.message);
// //                 });
// //         })
// //         .catch(error => {
// //             console.error('Error:', error.message);
// //         });
// // }


// function getTrafficDataOld() {
//     let t = new Date().getTime();

//     toast("Please wait... Fetching data from OpenStreetMap API.");

//     let city = document.getElementById("city").value || "Lipjan";
//     let duration = document.getElementById("duration").value || 15;
//     let bonus = document.getElementById("bonus").value || 500;
//     let cars = document.getElementById("cars").value || 250;

//     if (cars > 1000) {
//         cars = 5000;
//     }

//     if (duration > 1000) {
//         duration = 50;
//     }

//     if (bonus > 1000) {
//         bonus = 500;
//     }

//     let k = 0;
//     let b = 0;

//     const cityEndpoint = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1`;


//     fetch(cityEndpoint)
//         .then(response => response.json())
//         .then(data => {
//             if (data.length === 0) {
//                 throw new Error('City not found.');
//             }



//             const cityData = data[0];
//             const cityId = cityData.place_id;
//             const bbox = cityData.boundingbox;

//             console.log(cityData);

//             const latMin = parseFloat(bbox[0]);
//             const latMax = parseFloat(bbox[1]);
//             const lonMin = parseFloat(bbox[2]);
//             const lonMax = parseFloat(bbox[3]);

//             const latRange = latMax - latMin;
//             const lonRange = lonMax - lonMin;

//             const latStep = latRange / 50;
//             const lonStep = lonRange / 50;

//             let requests = [];
//             for (let i = 0; i < 50; i++) {
//                 const partLatMin = latMin + latStep * i;
//                 const partLatMax = partLatMin + latStep;
//                 const partLonMin = lonMin + lonStep * i;
//                 const partLonMax = partLonMin + lonStep;
//                 const mapEndpoint = `https://api.openstreetmap.org/api/0.6/map?bbox=${partLonMin},${partLatMin},${partLonMax},${partLatMax}`;
//                 requests.push(fetch(mapEndpoint));
//                 let v = i + 1;
//                 console.log("Fetching data from OpenStreetMap API. " + v + " / 50");
//                 toast("Please wait... Fetching data from OpenStreetMap API. " + v + " / 50", 2000, 50);
//             }

//             Promise.all(requests)
//                 .then(responses => Promise.all(responses.map(response => response.text())))
//                 .then(datas => {
//                     let intersections = {};
//                     let streets = [];

//                     // let g = 0;

//                     for (const data of datas) {
//                         // toast("Please wait...", "Completing data from OpenStreetMap API. " + g + " / 50", "info");
//                         // g++;
//                         const parser = new DOMParser();
//                         const xmlDoc = parser.parseFromString(data, 'application/xml');

//                         const nodes = xmlDoc.getElementsByTagName('node');
//                         for (const node of nodes) {
//                             intersections[node.getAttribute('id')] = {
//                                 lat: node.getAttribute('lat'),
//                                 lon: node.getAttribute('lon')
//                             };
//                             b++;
//                         }


//                         const ways = xmlDoc.getElementsByTagName('way');
//                         for (const way of ways) {
//                             const nds = way.getElementsByTagName('nd');
//                             const wayNodes = Array.from(nds).map(nd => nd.getAttribute('ref'));

//                             let x = streets.length ?? 0;
//                             for (let i = 0; i < wayNodes.length - 1; i++) {
//                                 const nameTag = way.querySelector('tag[k="name"]');
//                                 // const name = nameTag ? nameTag.getAttribute('v') : `street-${x++}`;
//                                 const name = `street${x++}`;
//                                 let lat = intersections[wayNodes[i]].lat;
//                                 let lon = intersections[wayNodes[i]].lon;

//                                 let distance = getDistanceFromLatLonInKm(lat, lon, intersections[wayNodes[i + 1]].lat, intersections[wayNodes[i + 1]].lon);

//                                 streets.push({
//                                     start: wayNodes[i],
//                                     end: wayNodes[i + 1],
//                                     name: name,
//                                     lat: lat,
//                                     lon: lon,
//                                     distance: distance
//                                 });
//                             }
//                         }
//                     }


//                     toast("Please wait... Completing data.");

//                     let DATA = [];

//                     let result = [];

//                     for (const street of streets) {
//                         const start = street.start;
//                         const end = street.end;
//                         const name = street.name;
//                         const lat = street.lat;
//                         const lon = street.lon;

//                         const distance = street.distance;

//                         let disabled = false;

//                         // Pick a random number 1 and 3
//                         const random = getRandomInt(1, 3);
//                         if (random === 1) {
//                             disabled = true;
//                         }

//                         if (disabled) {
//                             result.push(`${start} ${end} ${name} ${distance} ${lat} ${lon} closed`);
//                         } else {
//                             result.push(`${start} ${end} ${name} ${distance} ${lat} ${lon}`);
//                         }

//                     }

//                     DATA.push(`${duration} ${Object.keys(intersections).length} ${streets.length} ${cars} ${bonus}`);

//                     let resultstr = result.join("\n");

//                     DATA.push(resultstr);


//                     let carsArr = [];

//                     // generate cars
//                     for (let i = 0; i < cars; i++) {
//                         const P = Math.floor(Math.random() * 10) + 2; // random number between 2 and 11
//                         const path = Array.from({ length: P }, (_, i) => `street${Math.floor(Math.random() * streets.length)}`);

//                         let set = new Set(path);
//                         let clo = [...set]; // Change to path to allow duplicates

//                         carsArr.push(`${clo.length} ${clo.join(" ")}`);
//                     }

//                     let carsStr = carsArr.join("\n");

//                     DATA.push(carsStr);

//                     let DATAstr = DATA.join("\n");



//                     // Log the formatted result

//                     const blob = new Blob([DATAstr], { type: "text/plain" });
//                     const url = URL.createObjectURL(blob);
//                     const downloadLink = document.createElement("a");
//                     downloadLink.href = url;
//                     downloadLink.download = `D:${new Date().getTime()}.txt`;
//                     document.body.appendChild(downloadLink);
//                     downloadLink.click();
//                     document.body.removeChild(downloadLink);

//                     toast("Success The data was successfully generated ");
//                     let t2 = new Date().getTime();

//                     console.log(`Time: ${t2 - t}ms`);

//                     toast("Success The data was successfully generated in " + `${t2 - t}ms`);

//                     if (streets.length < 1000 && x < 1999) {
//                         toast("Please wait... Creating Graphs");
//                         createGraph(resultstr, "network");
//                         createGraph2(carsStr);
//                     }


//                     console.log(result);
//                 })
//                 .catch(error => {
//                     console.error('Error:', error.message);
//                     toast("Error" + error.message);
//                 });
//         })
//         .catch(error => {
//             console.error('Error:', error.message);
//             toast("Error" + error.message);
//         });

// }



// function getTrafficData() {

//     let t = new Date().getTime();


//     let city = document.getElementById("city").value;
//     let duration = document.getElementById("duration").value;
//     let bonus = document.getElementById("bonus").value;
//     let cars = document.getElementById("cars").value;

//     let DATA = [];
//     let graphsSTR = "";
//     let carsSTR = "";
//     const cityEndpoint = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1`;

//     toast("Please wait... Fetching data from OpenStreetMap API info");

//     fetch(cityEndpoint)
//         .then(response => response.json())
//         .then(data => {
//             if (data.length === 0) {
//                 toast("Error The city was not found in the database or an error has occurred");
//                 throw new Error('City not found.');
//             }

//             const cityData = data[0];
//             const cityId = cityData.place_id;
//             const bbox = cityData.boundingbox;

//             console.log(cityData.boundingbox);

//             const query = `[out:xml][timeout:600];
//           (
//             way["highway"](bbox:${bbox[2]},${bbox[0]},${bbox[3]},${bbox[1]});
//             >;
//           );
//           out body;`;

//             console.log(query);

//             const overpassEndpoint = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

//             let intersectionsN = 0;

//             toast("Please wait...  Fetching data from Overpass-API");
//             fetch(overpassEndpoint)
//                 .then(response => response.text())
//                 .then(data => {
//                     const parser = new DOMParser();
//                     const xmlDoc = parser.parseFromString(data, 'application/xml');

//                     let intersections = {};
//                     let streets = [];

//                     const nodes = xmlDoc.getElementsByTagName('node');
//                     for (const node of nodes) {
//                         intersections[node.getAttribute('id')] = {
//                             lat: node.getAttribute('lat'),
//                             lon: node.getAttribute('lon')
//                         };
//                         intersectionsN++;
//                     }

//                     let x = 0;

//                     const ways = xmlDoc.getElementsByTagName('way');
//                     for (const way of ways) {
//                         const nds = way.getElementsByTagName('nd');
//                         const nodes = Array.from(nds).map(nd => nd.getAttribute('ref'));

//                         for (let i = 0; i < nodes.length - 1; i++) {
//                             const nameTag = way.querySelector('tag[k="name"]');
//                             const name = `street${x}`; //nameTag ? nameTag.getAttribute('v') : `street-${x}`;
//                             x++;

//                             streets.push({
//                                 start: nodes[i],
//                                 end: nodes[i + 1],
//                                 name: name
//                             });
//                         }
//                     }

//                     let result = [];

//                     for (const street of streets) {
//                         const start = street.start;
//                         const end = street.end;
//                         const name = street.name;

//                         result.push(`${start} ${end} ${name} ${getRandomInt(1, 7)}`);
//                     }

//                     let resultstr = result.join("\n");

//                     DATA.push(`${duration} ${intersectionsN} ${x} ${cars} ${bonus}`);
//                     DATA.push(resultstr);


//                     let carsArr = [];

//                     // generate cars
//                     for (let i = 0; i < cars; i++) {
//                         const P = Math.floor(Math.random() * 10) + 2; // random number between 2 and 11
//                         const path = Array.from({ length: P }, (_, i) => `street${Math.floor(Math.random() * x)}`);

//                         let set = new Set(path);
//                         let clo = [...set]; // Change to path to allow duplicates

//                         carsArr.push(`${clo.length} ${clo.join(" ")}`);
//                     }

//                     let carsStr = carsArr.join("\n");

//                     DATA.push(carsStr);

//                     let DATAstr = DATA.join("\n");



//                     // Log the formatted result

//                     const blob = new Blob([DATAstr], { type: "text/plain" });
//                     const url = URL.createObjectURL(blob);
//                     const downloadLink = document.createElement("a");
//                     downloadLink.href = url;
//                     downloadLink.download = `D:${new Date().getTime()}.txt`;
//                     document.body.appendChild(downloadLink);
//                     downloadLink.click();
//                     document.body.removeChild(downloadLink);

//                     toast("Success The data was successfully generated");
//                     let t2 = new Date().getTime();

//                     console.log(`Time: ${t2 - t}ms`);

//                     toast("Success The data was successfully generated in " + `${t2 - t}ms`);

//                     if (intersectionsN < 1000 && x < 1999) {
//                         toast("Please wait... Creating Graphs");
//                         createGraph(resultstr, "network");
//                         createGraph2(carsStr);
//                     }
//                 })
//                 .catch(error => {
//                     console.error('Error:', error.message);
//                 });
//         })
//         .catch(error => {
//             console.error('Error:', error.message);
//         });
// }


// function toast(message, duration = 4500, delay = 0) {
//     const showToast = () => {
//         const toastContainer = document.createElement('div');
//         toastContainer.className = 'fixed top-4 right-4 flex items-center justify-center w-64 p-4 bg-gray-900 text-white rounded-md shadow-md';
//         toastContainer.style.padding = '12px';
//         toastContainer.style.maxHeight = '500px';
//         toastContainer.style.overflow = 'auto';
//         toastContainer.style.width = 'fit-content';
//         toastContainer.style.zIndex = '9999';

//         const toastText = document.createElement('span');
//         toastText.className = 'whitespace-nowrap overflow-hidden overflow-ellipsis';
//         toastText.textContent = message;
//         toastContainer.appendChild(toastText);

//         document.body.appendChild(toastContainer);

//         setTimeout(() => {
//             toastContainer.classList.add('opacity-0');
//             setTimeout(() => {
//                 toastContainer.remove();
//             }, 300);
//         }, duration);

//         toast.dismiss = function () {
//             toastContainer.classList.add('opacity-0');
//             setTimeout(() => {
//                 toastContainer.remove();
//             }, 300);
//         };
//     };

//     setTimeout(showToast, delay);
// }


// function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
//     const R = 6371; // Radius of the earth in km
//     const dLat = deg2rad(lat2 - lat1); // deg2rad below
//     const dLon = deg2rad(lon2 - lon1);
//     const a =
//         Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//         Math.cos(deg2rad(lat1)) *
//         Math.cos(deg2rad(lat2)) *
//         Math.sin(dLon / 2) *
//         Math.sin(dLon / 2);

//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//     let d = R * c; // Distance in km

//     // Return distance in meters

//     d = d * 1000;
//     d = d.toFixed(2);
//     return d;
// }

// function deg2rad(deg) {
//     return deg * (Math.PI / 180);
// }



let cityData;
let carsData;



// A JS function that gets the intersections and streets in a city and formats them like Google Hashcode Traffic Signaling input file
// The function takes a city name as a parameter and uses the OpenStreetMap API to get the data
// The function returns a string that contains the formatted data

const proxy = "https://cors.erzengames.workers.dev/"; // Proxy to avoid CORS error, change to https://cors.erzen.tk


function getCityData(city, duration, bonus, cars, string) {
    // Initialize an empty string to store the output
    let output = "";
    let output2 = "";
    let output3 = "";

    // Use fetch to get the data from the OpenStreetMap API
    // The query is based on the Overpass QL language (https://wiki.openstreetmap.org/wiki/Overpass_API/Language_Guide)
    // The query gets all the nodes and ways in the city that have a highway tag
    // The query also gets the traffic signals and traffic signs tags for the nodes

    let query = `[out:json][timeout:600];
      area[name~"${city}"]->.searchArea;
      (
        node["highway"](area.searchArea);
        way["highway"](area.searchArea);
        node["highway"="traffic_signals"](area.searchArea);
        node["traffic_sign"](area.searchArea);
      );
      out body;
      >;
      out skel qt;`;

    let url = `https://overpass-api.de/api/interpreter?data=${query}`;


    toast("Please wait... Fetching data from OpenStreetMap API.");

    // Use async/await to handle the promise returned by fetch
    async function fetchData() {
        try {
            // Get the response and parse it as JSON
            let response = await fetch(url);
            let data = await response.json();

            // Get the elements array from the data
            let elements = data.elements;

            // Initialize an empty object to store the nodes and ways
            let nodes = {};
            let ways = {};

            // Loop through the elements array and separate the nodes and ways
            for (let element of elements) {
                if (element.type === "node") {
                    // Store the node id, lat, lon, and tags in the nodes object
                    nodes[element.id] = {
                        lat: element.lat,
                        lon: element.lon,
                        tags: element.tags,
                    };
                } else if (element.type === "way") {
                    // Store the way id, nodes, and tags in the ways object
                    ways[element.id] = {
                        nodes: element.nodes,
                        tags: element.tags,
                    };
                }
            }

            toast("Please wait... Formatting data.");

            // Initialize an empty object to store the intersections
            let intersections = {};

            // Loop through the ways object and find the intersections
            for (let wayId in ways) {
                // Get the nodes array and the name tag of the way
                let wayNodes = ways[wayId].nodes;
                let wayName = ways[wayId].tags.name;

                // Loop through the nodes array and check if any node is shared by more than one way
                for (let i = 0; i < wayNodes.length; i++) {
                    let nodeId = wayNodes[i];

                    // If the node is not in the intersections object, initialize it with an empty array
                    if (!intersections[nodeId]) {
                        intersections[nodeId] = [];
                    }

                    // Push the way name and index to the intersections array of the node
                    intersections[nodeId].push([wayName, i]);
                }
            }

            toast("Please wait... Formatting data. 2");


            // Initialize an empty object to store the streets
            let streets = {};


            // Loop through the intersections object and format the streets
            for (let nodeId in intersections) {
                // Get the intersection array and the node data from the nodes object
                let intersection = intersections[nodeId];
                let nodeData = nodes[nodeId];


                // If the intersection array has more than one element, it means it is a valid intersection
                if (intersection.length > 1) {
                    // Loop through the intersection array and get the street names and indexes
                    for (let [streetName, index] of intersection) {
                        // If the street name is not in the streets object, initialize it with an empty array
                        if (!streets[streetName]) {
                            streets[streetName] = [];
                        }

                        // Push the node id and index to the streets array of the street name
                        streets[streetName].push([nodeId, index]);
                    }
                }
            }


            toast("Please wait... Calculating distances using Haversine formula.");

            // Initialize a counter to store the number of streets
            let streetCount = 0;

            // Loop through the streets object and format the output
            for (let streetName in streets) {
                // Get the street array from the streets object
                let street = streets[streetName];

                // Sort the street array by index to get the correct order of nodes
                street.sort((a, b) => a[1] - b[1]);

                // Initialize an empty array to store the node ids of the street
                let streetNodes = [];

                // Loop through the street array and get the node ids
                for (let [nodeId, index] of street) {
                    streetNodes.push(nodeId);
                }

                // Get the first and last node ids of the street
                let firstNodeId = streetNodes[0];
                let lastNodeId = streetNodes[streetNodes.length - 1];

                // Get the lat and lon of the first and last nodes from the nodes object
                let firstNodeLat = nodes[firstNodeId].lat;
                let firstNodeLon = nodes[firstNodeId].lon;
                let lastNodeLat = nodes[lastNodeId].lat;
                let lastNodeLon = nodes[lastNodeId].lon;

                // Calculate the distance between the first and last nodes using the Haversine formula
                // The formula is taken from https://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula
                let R = 6371; // Radius of the earth in km
                let dLat = deg2rad(lastNodeLat - firstNodeLat); // deg2rad below
                let dLon = deg2rad(lastNodeLon - firstNodeLon);
                let a =
                    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                    Math.cos(deg2rad(firstNodeLat)) *
                    Math.cos(deg2rad(lastNodeLat)) *
                    Math.sin(dLon / 2) *
                    Math.sin(dLon / 2);
                let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                let d = R * c; // Distance in km

                // Convert the distance to meters and round it to the nearest integer
                let distance = (d * 1000).toFixed(2);

                // Generate a random number between 0 and 9 to decide if the street is disabled or not
                // If the number is 0, the street is disabled and prefixed with a "!"
                let randomNumber = Math.floor(Math.random() * 10);
                let disabled = randomNumber === 0 ? "!" : "";

                // Append the street data to the output string in the format: "(id of street) (lat) (lon)"
                // output += `${streetCount} ${firstNodeLat} ${firstNodeLon}\n`;

                // Set the name of the street to the street name with spaces replaced by dashes and lowercase
                let name = streetName.replace(/ /g, "-");
                name = name.toLowerCase();

                if (name === "null" || name === "undefined") {
                    name = "street" + distance;
                }

                // Append the street data to the output string in the format: id1 id2 street1 (length of road)
                output2 += `${firstNodeId} ${lastNodeId} ${name} ${distance}\n`;
                cityData += `${firstNodeId} ${lastNodeId} ${name} ${distance}\n`;


                // Increment the street count by one
                streetCount++;
            }

            toast("Please wait... Checking inc & out for all intersections. ");


            // Initialize a counter to store the number of intersections
            let intersectionCount = 0;

            // Loop through the intersections object and format the output
            for (let nodeId in intersections) {
                // Get the intersection array from the intersections object
                let intersection = intersections[nodeId];

                // If the intersection array has more than one element, it means it is a valid intersection
                if (intersection.length > 1) {


                    // Initialize an empty array to store the incoming and outgoing streets of the intersection
                    let incomingStreets = [];
                    let outgoingStreets = [];

                    // Loop through the intersection array and get the street names and indexes
                    for (let [streetName, index] of intersection) {
                        // Get the street array from the streets object
                        let street = streets[streetName];

                        // Sort the street array by index to get the correct order of nodes
                        street.sort((a, b) => a[1] - b[1]);

                        // Get the first and last node ids of the street
                        let firstNodeId = street[0][0];
                        let lastNodeId = street[street.length - 1][0];

                        // Check if the node id matches with either the first or last node id of the street
                        if (nodeId === firstNodeId) {
                            // If it matches with the first node id, it means it is an outgoing street from the intersection
                            outgoingStreets.push(streetName);
                        } else if (nodeId === lastNodeId) {
                            // If it matches with the last node id, it means it is an incoming street to the intersection
                            incomingStreets.push(streetName);
                        }
                    }

                    // Check if the incoming and outgoing streets arrays are empty

                    // If they are empty, it means that the intersection is a dead end
                    if (incomingStreets.length > 0 || outgoingStreets.length > 0) {
                        // Append the node id to the output string as the id of the intersection
                        // output += `${nodeId} `;


                        // Append the number of incoming streets to the output string
                        // output += `i>${incomingStreets.length} `;


                        // Loop through the incoming streets array and append them to the output string
                        for (let incomingStreet of incomingStreets) {
                            // Append the incoming street name to the output string

                            // Append the incoming street name to the output string
                            // Only if it is not undefined
                            let disabledStreets = [];

                            if (incomingStreet) {

                                let name = incomingStreet.replace(/ /g, "-");
                                name = name.toLowerCase();

                                let randomNumber = Math.floor(Math.random() * 4);

                                let pref = "";

                                // Only if the street is not already added to the output string
                                if (randomNumber === 1 && incomingStreet.length >= 2 && disabledStreets.length < 1) {
                                    pref = "!";
                                    disabledStreets.push(incomingStreet);
                                }

                                // output += `${pref}${name} `;
                            }

                        }

                        // Append the number of outgoing streets to the output string
                        // output += `o>${outgoingStreets.length} `;


                        // Loop through the outgoing streets array and append them to the output string
                        for (let outgoingStreet of outgoingStreets) {
                            // Append the outgoing street name to the output string
                            // Only if it is not undefined

                            let disabledStreets = [];

                            if (outgoingStreet) {
                                let name = outgoingStreet.replace(/ /g, "-");
                                name = name.toLowerCase();

                                let randomNumber = Math.floor(Math.random() * 4);
                                let pref = "";

                                // Only if the street is not already added to the output string
                                if (randomNumber === 1 && outgoingStreet.length >= 2 && disabledStreets.length < 1) {
                                    pref = "!";
                                    disabledStreets.push(outgoingStreet);
                                }

                                // output += `${pref}${name} `;
                            }
                        }

                        // Get the node data from the nodes object
                        let nodeData = nodes[nodeId];


                        // Check if the node has a traffic signal or a traffic sign tag
                        // Only if it has a tags property

                        if (nodeData.tags && (nodeData.tags["highway"] === "traffic_signals" || nodeData.tags["traffic_sign"])) {
                            // If yes, append "trafficLight" to the output string to indicate that there are traffic lights at the intersection
                            // output += "trafficLight\n";
                        }


                        // output += "\n";

                    }



                    // Increment the intersection count by one
                    intersectionCount++;


                }



            }

            toast("Please wait... Generating cars paths.");

            let streetsArray = Object.values(streets);
            let intersectionsArray = Object.values(intersections);

            V = cars;

            let carsS = generateCarsPaths(streetsArray, intersectionsArray)
            console.log(cars)

            // Prepend the number of streets and intersections to the output string
            output2 = `${duration} ${streetCount} ${intersectionCount} ${cars} ${bonus}\n` + output2;


            let out = output2 + output + carsS;

            toast("Success The data was successfully generated");


            // Log the formatted result

            const blob = new Blob([out], { type: "text/plain" });
            const url1 = URL.createObjectURL(blob);
            const downloadLink = document.createElement("a");
            downloadLink.href = url1;
            downloadLink.download = `${city + "-" + new Date().getTime()}.txt`;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);

            toast("Success The data was successfully generated");


            // Return the output string
            return out;
        } catch (error) {

            console.log(error);
            // If there is an error, return an empty string
            return "Error";
        }
    }

    // A helper function to convert degrees to radians
    function deg2rad(deg) {
        return deg * (Math.PI / 180);
    }

    // Call the fetchData function and return its result
    return fetchData();
}


let g;
let h;

// A constant V variable that tells us how many cars to generate
let V = 10;

// A function that takes a streets and intersections objects as parameters
function generateCarsPaths(streets, intersections) {
    // An array to store the cars paths
    let carsPaths = [];

    // A loop to generate V cars
    for (let i = 0; i < V; i++) {
        // A random number to choose a street as the starting point
        let streetIndex = Math.floor(Math.random() * streets.length);

        // The street object and its name
        let street = streets[streetIndex];
        let streetName = street[0][0];

        // The intersection object and its name
        let intersection = intersections[streetIndex];
        let intersectionName = intersection[0][0];

        // A variable to store the current time
        let time = 0;

        // An array to store the path of the car
        let path = [streetName];

        // A loop to traverse the street until reaching the end or exceeding the time limit
        while (time < 60) {
            // The length of the street in seconds
            let streetLength = street[street.length - 1][1] - street[0][1];

            // The time needed to cross the street
            let crossingTime = streetLength + 1;

            // Update the time
            time += crossingTime;

            // Check if the time limit is exceeded
            if (time > 60) {
                break;
            }

            // Choose a random direction at the intersection
            let direction = Math.floor(Math.random() * intersection.length);

            // The next street object and its name
            let nextStreet = streets[intersection[direction][1]];
            let nextStreetName = nextStreet[0][0];

            // Add the next street name to the path
            path.push(nextStreetName);

            // Update the street and intersection variables
            street = nextStreet;
            streetName = nextStreetName;
            intersection = intersections[intersection[direction][1]];
            intersectionName = intersection[0][0];
        }

        // Add the path to the cars paths array
        carsPaths.push(path);
    }

    let output = "";

    for (let i = 0; i < carsPaths.length; i++) {
        let b = i + 1;
        output += `${carsPaths[i].length} ${carsPaths[i].join(" ")}\n`;
    }

    carsData = output;

    // Return the cars paths array
    return output;
}

function addText(input, text, value) {
    // create a regular expression that matches the value and then some text and then a newline
    let regex = new RegExp(value + ".*\\n", "g");
    // use the replace method to append the text to the matched string
    let output = input.replace(regex, "$&" + text);
    // return the modified string
    return output;
}


function getData() {

    toast("Please wait while we validate your data.");

    let city = document.getElementById("city").value;
    let duration = document.getElementById("duration").value;
    let bonus = document.getElementById("bonus").value;
    let cars = document.getElementById("cars").value;

    if (city && duration && bonus && cars) {
        getCityData(city, duration, bonus, cars).then((data) => {
            document.getElementById("output").value = data;
        });
    } else {
        toast("Please fill all the fields");
    }


    getCityData(city, duration, bonus, cars, "~");
}



function toast(message, duration = 4500, delay = 0) {
    const showToast = () => {
        const toastContainer = document.createElement('div');
        toastContainer.className = 'fixed top-4 right-4 flex items-center justify-center w-64 p-4 bg-gray-900 text-white rounded-md shadow-md';
        toastContainer.style.padding = '12px';
        toastContainer.style.maxHeight = '500px';
        toastContainer.style.overflow = 'auto';
        toastContainer.style.width = 'fit-content';
        toastContainer.style.zIndex = '9999';

        const toastText = document.createElement('span');
        toastText.className = 'whitespace-nowrap overflow-hidden overflow-ellipsis';
        toastText.textContent = message;
        toastContainer.appendChild(toastText);

        document.body.appendChild(toastContainer);

        setTimeout(() => {
            toastContainer.classList.add('opacity-0');
            setTimeout(() => {
                toastContainer.remove();
            }, 300);
        }, duration);

        toast.dismiss = function () {
            toastContainer.classList.add('opacity-0');
            setTimeout(() => {
                toastContainer.remove();
            }, 300);
        };
    };

    setTimeout(showToast, delay);
}
