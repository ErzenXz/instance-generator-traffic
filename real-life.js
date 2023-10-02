

// A JS function that gets the intersections and streets in a city and formats them like Google Hashcode Traffic Signaling input file
// The function takes a city name as a parameter and uses the OpenStreetMap API to get the data
// The function returns a string that contains the formatted data

const proxy = "https://cors.erzengames.workers.dev/"; // Proxy to avoid CORS error, change to https://cors.erzen.tk


function getCityData(city, duration, bonus, cars, string) {
    // Initialize an empty string to store the output
    let output = "";
    let output2 = "";
    let output3 = "";


    let DATA = [[]];

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


    // Use async/await to handle the promise returned by fetch
    async function fetchData() {
        try {

            toast("Fetching data...", 4500, 0);
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


            // Initialize a counter to store the number of streets
            let streetCount = 0;

            toast("Generating streets...", 4500, 0);

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

                let cv = `${firstNodeId} ${firstNodeLat} ${firstNodeLon} `;
                DATA.push([cv]);

                // Set the name of the street to the street name with spaces replaced by dashes and lowercase
                let name = streetName.replace(/ /g, "-");
                name = name.toLowerCase();

                if (name === "null" || name === "undefined") {
                    name = "street" + distance;
                }

                // Append the street data to the output string in the format: id1 id2 street1 (length of road)
                output2 += `${firstNodeId} ${lastNodeId} ${name} ${distance}\n`;


                // Increment the street count by one
                streetCount++;
            }



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
                        //output += `${nodeId} `;


                        // Append the number of incoming streets to the output string
                        //output += `i>${incomingStreets.length} `;

                        let inc = "";

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
                                    pref = "";
                                    disabledStreets.push(incomingStreet);
                                }

                                inc += `${pref}${name},`;
                            }

                        }

                        // Append the number of outgoing streets to the output string


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
                                    pref = "";
                                    disabledStreets.push(outgoingStreet);
                                }

                                inc += ` ${pref}${name}`;
                            }
                        }

                        // Get the node data from the nodes object
                        let nodeData = nodes[nodeId];

                        // Check if the node has a traffic signal or a traffic sign tag
                        // Only if it has a tags property

                        if (nodeData.tags && (nodeData.tags["highway"] === "traffic_signals" || nodeData.tags["traffic_sign"])) {
                            // If yes, append "trafficLight" to the output string to indicate that there are traffic lights at the intersection
                            inc += " trafficLight";
                        }

                        // Add the inc to the DATA Matrix to the correct position

                        const uniqueData = inc.split(/\s+/).filter((value, index, arr) => arr.indexOf(value) === index).join(" ").trim(" ");


                        DATA.push(uniqueData);

                    }

                    // Increment the intersection count by one
                    intersectionCount++;


                }



            }

            let streetsArray = Object.values(streets);
            let intersectionsArray = Object.values(intersections);

            V = cars;

            let carsS = generateCarsPaths(streetsArray, intersectionsArray, duration);


            // Turn the DATA Matrix into a string

            const combinedArray = [];

            const numElements = streetCount;
            for (let i = 0; i < numElements; i++) {
                combinedArray.push(DATA[i] + DATA[i + numElements]);
            }

            let DATAString = combinedArray.join("\n");


            // Prepend the number of streets and intersections to the output string
            let data0 = `${duration} ${streetCount} ${intersectionCount} ${cars} ${bonus}\n` + DATAString;


            let out = data0 + output2 + carsS;

            toast("Generating file...", 4500, 0);

            // Log the formatted result

            const blob = new Blob([out], { type: "text/plain" });
            const url1 = URL.createObjectURL(blob);
            const downloadLink = document.createElement("a");
            downloadLink.href = url1;
            downloadLink.download = `${city + "-" + new Date().getTime()}.txt`;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);

            toast("File generated successfully", 4500, 0);


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
function generateCarsPaths(streets, intersections, dur) {

    // Check if streets and intersecions its not empty!
    if (streets.length === 0 || intersections.length === 0) {
        toast("An error has occurred while loading data from API, please try again later if the problem persists, please contact us");
        return false;
    }

    // An array to store the cars paths
    let carsPaths = [];

    toast("Generating cars...", 4500, 0);

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

        console.log(intersectionName);

        // An array to store the path of the car
        let path = [intersectionName];

        // A loop to traverse the street until reaching the end or exceeding the time limit
        while (time < dur) {
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

            let nextIntersection = intersections[intersection[direction][1]];
            let nextIntersectionName = nextIntersection[0][0];

            // Add the next street name to the path
            path.push(nextIntersectionName);

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

        let arrCopy = carsPaths[i];

        // Remove duplicates from the array of paths if there are more than 1 intersections
        if (arrCopy.length > 1) {
            arrCopy = arrCopy.filter((item, index) => arrCopy.indexOf(item) === index);
        }

        // Remove undefined values from the array of paths
        arrCopy = arrCopy.filter((item) => item);


        // Lowercase and replace spaces with dashes and remove unnecessary characters and fix spacing issues

        for (let i = 0; i < arrCopy.length; i++) {
            arrCopy[i] = arrCopy[i].replace(/ /g, "-");
            arrCopy[i] = arrCopy[i].toLowerCase();
            arrCopy[i] = arrCopy[i].replace(/[^a-zA-Z0-9-]/g, "");
            arrCopy[i] = arrCopy[i].replace(/-+/g, "-");
            arrCopy[i] = arrCopy[i].replace(/^-+/, "");
            arrCopy[i] = arrCopy[i].replace(/-+$/, "");
        }

        let length = arrCopy.length;
        let path = arrCopy.join(" ");

        if (length == 0) {
            output += ``;
        } else {
            output += `${length} ${path}\n`;
        }

    }

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

    toast("Generating file...", 4500, 0);
    let city = document.getElementById("city").value;
    let duration = document.getElementById("duration").value;
    let bonus = document.getElementById("bonus").value;
    let cars = document.getElementById("cars").value;

    if (duration == "") {
        duration = 60;
    } else if (duration > 1000) {
        duration = 1000;
    } else if (duration < 1) {
        duration = 1;
    }

    if (bonus == "") {
        bonus = 1000;
    } else if (bonus > 1000) {
        bonus = 1000;
    } else if (bonus < 1) {
        bonus = 1;
    }

    if (cars == "") {
        cars = 10;
    } else if (cars > 1000) {
        cars = 1000;
    } else if (cars < 1) {
        cars = 1;
    }


    if (city != "" && duration != "" && bonus != "" && cars != "") {
        getCityData(city, duration, bonus, cars, "~");
    } else {
        toast("Please fill all the fields");
    }


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
