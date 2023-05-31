
async function getData() {
    let city = document.getElementById("city").value;
    let duration = document.getElementById("duration").value;
    let bonus = document.getElementById("bonus").value;
    let cars = document.getElementById("cars").value;

    let graph = [];

    const apiUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${city}&polygon_geojson=1`;

    try {
        Swal.fire("Please wait...", "Fetching data from OpenStreetMap API", "info");
        // Fetch data from OpenStreetMap API
        const response = await fetch(apiUrl);
        const data = await response.json();

        // Extract the bounding box coordinates of the city
        const boundingBox = data[0].boundingbox;
        const bbox = `${boundingBox[2]},${boundingBox[0]},${boundingBox[3]},${boundingBox[1]}`;

        // Query for all streets within the city's bounding box
        const streetsUrl = `https://overpass-api.de/api/interpreter?data=[out:json];way(${bbox})[%22highway%22];out;`;
        const streetsResponse = await fetch(streetsUrl);
        const streetsData = await streetsResponse.json();
        console.log(streetsData);

        if (streetsData.elements.length == 0) {
            Swal.fire("Error", "City was not found in the database", "error");
            return false;
        }

        let dataResult = [];

        // Extract the street data and format it as required
        let result = [];
        let intersectionId = 0;
        let key = 0;

        let intersectionsV = 0;

        // streetsData.elements.forEach(street => {
        //     const streetId = street.id;
        //     const streetName = street.tags.name;
        //     const intersections = street.nodes;

        //     for (let i = 0; i < intersections.length - 1; i++) {
        //         const startIntersection = intersections[i];
        //         const endIntersection = intersections[i + 1];
        //         result.push(`${startIntersection} ${endIntersection} street${key} ${getRandomInt(1, 7)}`);
        //         key++;
        //         intersectionsV = intersections.length + 1;
        //     }

        // });

        let intersectionMap = new Map();

        streetsData.elements.forEach(street => {
            const streetId = street.id;
            const streetName = street.tags.name;
            const intersections = street.nodes;

            // if (intersections.length == 0 || street == undefined) {
            //     Swal.fire("Error", "City was not found in the database", "error");
            //     return false;
            // }

            for (let i = 0; i < intersections.length - 1; i++) {
                const startIntersection = intersections[i];
                const endIntersection = intersections[i + 1];

                if (!intersectionMap.has(startIntersection)) {
                    intersectionMap.set(startIntersection, new Set());
                }
                intersectionMap.get(startIntersection).add(endIntersection);

                if (!intersectionMap.has(endIntersection)) {
                    intersectionMap.set(endIntersection, new Set());
                }
                intersectionMap.get(endIntersection).add(startIntersection);
                intersectionsV = intersections.length + 1;
            }
        });

        for (const [startIntersection, connectedIntersections] of intersectionMap.entries()) {
            const startIntersectionId = startIntersection;
            for (const endIntersection of connectedIntersections) {
                const endIntersectionId = endIntersection;
                let ran = getRandomInt(1, 7);
                result.push(`${startIntersectionId} ${endIntersectionId} street${key} ${ran}`);
                graph.push(`${startIntersectionId} ${endIntersectionId} street${key} ${ran}`);
                key++;
            }
        }


        let temp = key + 1;

        dataResult.push(`${duration} ${intersectionsV} ${temp} ${cars} ${bonus}`);
        let b = result.join("\n");
        dataResult.push(b);


        let carsArr = [];

        // generate cars
        for (let i = 0; i < cars; i++) {
            const P = Math.floor(Math.random() * 10) + 2; // random number between 2 and 11
            const path = Array.from({ length: P }, (_, i) => `street${Math.floor(Math.random() * key)}`);

            let set = new Set(path);
            let clo = [...set]; // Change to path to allow duplicates

            carsArr.push(`${clo.length} ${clo.join(" ")}`);
        }

        let carsStr = carsArr.join("\n");

        dataResult.push(carsStr);

        let rr = dataResult.join("\n");


        // Create graphs

        if (intersectionsV <= 750 && temp <= 1999) {
            Swal.fire("Success", "The city was found in the database and the data was successfully generated", "success");
            setTimeout(() => {
                Swal.fire("Please wait...", "Generating graphs", "info");
                setTimeout(() => {
                    let graph20 = graph.join("\n");
                    createGraph(graph20, "network");
                    createGraph2(carsStr);
                }, 5000);

            }, 1000);
        }



        // Log the formatted result

        const blob = new Blob([rr], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const downloadLink = document.createElement("a");
        downloadLink.href = url;
        downloadLink.download = `D:${new Date().getTime()}.txt`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);

        Swal.fire("Success", "The data was successfully generated", "success");

        return result;
    } catch (error) {
        Swal.fire("Error", "The city was not found in the database or an error has occurred", "error");
        console.error('Error:', error);
        return null;
    }
}



function getRandomInt(min, max) {
    let minB, maxB;
    minB = Math.ceil(Number(min));
    maxB = Math.floor(Number(max));
    return Math.floor(Math.random() * (maxB - minB + 1)) + minB;
}

// GOOD!!!

// function getTrafficDataOld(city) {
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

//             const mapEndpoint = `https://api.openstreetmap.org/api/0.6/map?bbox=${bbox[2]},${bbox[0]},${bbox[3]},${bbox[1]}`;

//             fetch(mapEndpoint)
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
//                     }
//                     let x = 0;

//                     const ways = xmlDoc.getElementsByTagName('way');
//                     for (const way of ways) {
//                         const nds = way.getElementsByTagName('nd');
//                         const nodes = Array.from(nds).map(nd => nd.getAttribute('ref'));

//                         for (let i = 0; i < nodes.length - 1; i++) {
//                             const nameTag = way.querySelector('tag[k="name"]');

//                             const name = nameTag ? nameTag.getAttribute('v') : `street-${x}`; //street-${x}`;
//                             x++;
//                             streets.push({
//                                 start: nodes[i],
//                                 end: nodes[i + 1],
//                                 name: name
//                             });
//                         }
//                     }

//                     let result = '';

//                     for (const street of streets) {
//                         const start = street.start;
//                         const end = street.end;
//                         const name = street.name;

//                         result += `${start} ${end} ${name} ${getRandomInt(1, 7)}\n`;
//                     }

//                     console.log(result);
//                 })
//                 .catch(error => {
//                     console.error('Error:', error.message);
//                 });
//         })
//         .catch(error => {
//             console.error('Error:', error.message);
//         });
// }


// function getTrafficDataOld(city) {
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
//             }

//             Promise.all(requests)
//                 .then(responses => Promise.all(responses.map(response => response.text())))
//                 .then(datas => {
//                     let intersections = {};
//                     let streets = [];

//                     for (const data of datas) {
//                         const parser = new DOMParser();
//                         const xmlDoc = parser.parseFromString(data, 'application/xml');

//                         const nodes = xmlDoc.getElementsByTagName('node');
//                         for (const node of nodes) {
//                             intersections[node.getAttribute('id')] = {
//                                 lat: node.getAttribute('lat'),
//                                 lon: node.getAttribute('lon')
//                             };
//                         }

//                         let x = streets.length;
//                         const ways = xmlDoc.getElementsByTagName('way');
//                         for (const way of ways) {
//                             const nds = way.getElementsByTagName('nd');
//                             const wayNodes = Array.from(nds).map(nd => nd.getAttribute('ref'));

//                             for (let i = 0; i < wayNodes.length - 1; i++) {
//                                 const nameTag = way.querySelector('tag[k="name"]');
//                                 const name = nameTag ? nameTag.getAttribute('v') : `street-${x++}`;

//                                 streets.push({
//                                     start: wayNodes[i],
//                                     end: wayNodes[i + 1],
//                                     name: name
//                                 });
//                             }
//                         }
//                     }

//                     let result = '';

//                     for (const street of streets) {
//                         const start = street.start;
//                         const end = street.end;
//                         const name = street.name;

//                         result += `${start} ${end} ${name} ${getRandomInt(1, 7)}\n`;
//                     }

//                     console.log(result);
//                 })
//                 .catch(error => {
//                     console.error('Error:', error.message);
//                 });
//         })
//         .catch(error => {
//             console.error('Error:', error.message);
//         });
// }


function getTrafficDataOld() {
    let t = new Date().getTime();

    Swal.fire("Please wait...", "Fetching data from OpenStreetMap API.", "info");

    let city = document.getElementById("city").value || "Lipjan";
    let duration = document.getElementById("duration").value || 15;
    let bonus = document.getElementById("bonus").value || 500;
    let cars = document.getElementById("cars").value || 250;

    if (cars > 1000) {
        cars = 5000;
    }

    if (duration > 1000) {
        duration = 50;
    }

    if (bonus > 1000) {
        bonus = 500;
    }

    let k = 0;
    let b = 0;

    const cityEndpoint = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1`;

    fetch(cityEndpoint)
        .then(response => response.json())
        .then(data => {
            if (data.length === 0) {
                throw new Error('City not found.');
            }

            const cityData = data[0];
            const cityId = cityData.place_id;
            const bbox = cityData.boundingbox;

            const latMin = parseFloat(bbox[0]);
            const latMax = parseFloat(bbox[1]);
            const lonMin = parseFloat(bbox[2]);
            const lonMax = parseFloat(bbox[3]);

            const latRange = latMax - latMin;
            const lonRange = lonMax - lonMin;

            const latStep = latRange / 50;
            const lonStep = lonRange / 50;

            let requests = [];
            for (let i = 0; i < 50; i++) {
                Swal.fire("Please wait...", "Fetching data from OpenStreetMap API. " + k + " / 50", "info");
                const partLatMin = latMin + latStep * i;
                const partLatMax = partLatMin + latStep;
                const partLonMin = lonMin + lonStep * i;
                const partLonMax = partLonMin + lonStep;
                const mapEndpoint = `https://api.openstreetmap.org/api/0.6/map?bbox=${partLonMin},${partLatMin},${partLonMax},${partLatMax}`;
                requests.push(fetch(mapEndpoint));
            }

            Promise.all(requests)
                .then(responses => Promise.all(responses.map(response => response.text())))
                .then(datas => {
                    let intersections = {};
                    let streets = [];



                    for (const data of datas) {
                        const parser = new DOMParser();
                        const xmlDoc = parser.parseFromString(data, 'application/xml');

                        const nodes = xmlDoc.getElementsByTagName('node');
                        for (const node of nodes) {
                            intersections[node.getAttribute('id')] = {
                                lat: node.getAttribute('lat'),
                                lon: node.getAttribute('lon')
                            };
                            b++;
                        }

                        const ways = xmlDoc.getElementsByTagName('way');
                        for (const way of ways) {
                            const nds = way.getElementsByTagName('nd');
                            const wayNodes = Array.from(nds).map(nd => nd.getAttribute('ref'));

                            let x = streets.length;
                            for (let i = 0; i < wayNodes.length - 1; i++) {
                                const nameTag = way.querySelector('tag[k="name"]');
                                // const name = nameTag ? nameTag.getAttribute('v') : `street-${x++}`;
                                const name = `street${x++}`;

                                streets.push({
                                    start: wayNodes[i],
                                    end: wayNodes[i + 1],
                                    name: name
                                });
                            }
                        }
                    }


                    Swal.fire("Please wait...", "Completing data.", "info");

                    let DATA = [];

                    let result = [];

                    for (const street of streets) {
                        const start = street.start;
                        const end = street.end;
                        const name = street.name;

                        result.push(`${start} ${end} ${name} ${getRandomInt(1, 7)}`);
                    }

                    DATA.push(`${duration} ${Object.keys(intersections).length} ${streets.length} ${cars} ${bonus}`);

                    let resultstr = result.join("\n");

                    DATA.push(resultstr);


                    let carsArr = [];

                    // generate cars
                    for (let i = 0; i < cars; i++) {
                        const P = Math.floor(Math.random() * 10) + 2; // random number between 2 and 11
                        const path = Array.from({ length: P }, (_, i) => `street${Math.floor(Math.random() * streets.length)}`);

                        let set = new Set(path);
                        let clo = [...set]; // Change to path to allow duplicates

                        carsArr.push(`${clo.length} ${clo.join(" ")}`);
                    }

                    let carsStr = carsArr.join("\n");

                    DATA.push(carsStr);

                    let DATAstr = DATA.join("\n");



                    // Log the formatted result

                    const blob = new Blob([DATAstr], { type: "text/plain" });
                    const url = URL.createObjectURL(blob);
                    const downloadLink = document.createElement("a");
                    downloadLink.href = url;
                    downloadLink.download = `D:${new Date().getTime()}.txt`;
                    document.body.appendChild(downloadLink);
                    downloadLink.click();
                    document.body.removeChild(downloadLink);

                    Swal.fire("Success", "The data was successfully generated", "success");
                    let t2 = new Date().getTime();

                    console.log(`Time: ${t2 - t}ms`);

                    Swal.fire("Success", "The data was successfully generated in " + `${t2 - t}ms`, "success");

                    if (streets.length < 1000 && x < 1999) {
                        Swal.fire("Please wait...", "Creating Graphs", "info");
                        createGraph(resultstr, "network");
                        createGraph2(carsStr);
                    }


                    console.log(result);
                })
                .catch(error => {
                    console.error('Error:', error.message);
                });
        })
        .catch(error => {
            console.error('Error:', error.message);
        });
}



function getTrafficData() {

    let t = new Date().getTime();


    let city = document.getElementById("city").value;
    let duration = document.getElementById("duration").value;
    let bonus = document.getElementById("bonus").value;
    let cars = document.getElementById("cars").value;

    let DATA = [];
    let graphsSTR = "";
    let carsSTR = "";
    const cityEndpoint = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1`;

    Swal.fire("Please wait...", "Fetching data from OpenStreetMap API", "info");

    fetch(cityEndpoint)
        .then(response => response.json())
        .then(data => {
            if (data.length === 0) {
                Swal.fire("Error", "The city was not found in the database or an error has occurred", "error");
                throw new Error('City not found.');
            }

            const cityData = data[0];
            const cityId = cityData.place_id;
            const bbox = cityData.boundingbox;

            const query = `[out:xml][timeout:600];
          (
            way["highway"](bbox:${bbox[2]},${bbox[0]},${bbox[3]},${bbox[1]});
            >;
          );
          out body;`;

            const overpassEndpoint = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

            let intersectionsN = 0;

            Swal.fire("Please wait...", "Fetching data from Overpass-API", "info");
            fetch(overpassEndpoint)
                .then(response => response.text())
                .then(data => {
                    const parser = new DOMParser();
                    const xmlDoc = parser.parseFromString(data, 'application/xml');

                    let intersections = {};
                    let streets = [];

                    const nodes = xmlDoc.getElementsByTagName('node');
                    for (const node of nodes) {
                        intersections[node.getAttribute('id')] = {
                            lat: node.getAttribute('lat'),
                            lon: node.getAttribute('lon')
                        };
                        intersectionsN++;
                    }

                    let x = 0;

                    const ways = xmlDoc.getElementsByTagName('way');
                    for (const way of ways) {
                        const nds = way.getElementsByTagName('nd');
                        const nodes = Array.from(nds).map(nd => nd.getAttribute('ref'));

                        for (let i = 0; i < nodes.length - 1; i++) {
                            const nameTag = way.querySelector('tag[k="name"]');
                            const name = `street${x}`; //nameTag ? nameTag.getAttribute('v') : `street-${x}`;
                            x++;

                            streets.push({
                                start: nodes[i],
                                end: nodes[i + 1],
                                name: name
                            });
                        }
                    }

                    let result = [];

                    for (const street of streets) {
                        const start = street.start;
                        const end = street.end;
                        const name = street.name;

                        result.push(`${start} ${end} ${name} ${getRandomInt(1, 7)}`);
                    }

                    let resultstr = result.join("\n");

                    DATA.push(`${duration} ${intersectionsN} ${x} ${cars} ${bonus}`);
                    DATA.push(resultstr);


                    let carsArr = [];

                    // generate cars
                    for (let i = 0; i < cars; i++) {
                        const P = Math.floor(Math.random() * 10) + 2; // random number between 2 and 11
                        const path = Array.from({ length: P }, (_, i) => `street${Math.floor(Math.random() * x)}`);

                        let set = new Set(path);
                        let clo = [...set]; // Change to path to allow duplicates

                        carsArr.push(`${clo.length} ${clo.join(" ")}`);
                    }

                    let carsStr = carsArr.join("\n");

                    DATA.push(carsStr);

                    let DATAstr = DATA.join("\n");



                    // Log the formatted result

                    const blob = new Blob([DATAstr], { type: "text/plain" });
                    const url = URL.createObjectURL(blob);
                    const downloadLink = document.createElement("a");
                    downloadLink.href = url;
                    downloadLink.download = `D:${new Date().getTime()}.txt`;
                    document.body.appendChild(downloadLink);
                    downloadLink.click();
                    document.body.removeChild(downloadLink);

                    Swal.fire("Success", "The data was successfully generated", "success");
                    let t2 = new Date().getTime();

                    console.log(`Time: ${t2 - t}ms`);

                    Swal.fire("Success", "The data was successfully generated in " + `${t2 - t}ms`, "success");

                    if (intersectionsN < 1000 && x < 1999) {
                        Swal.fire("Please wait...", "Creating Graphs", "info");
                        createGraph(resultstr, "network");
                        createGraph2(carsStr);
                    }
                })
                .catch(error => {
                    console.error('Error:', error.message);
                });
        })
        .catch(error => {
            console.error('Error:', error.message);
        });
}