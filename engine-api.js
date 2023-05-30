
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

        if (intersectionsV <= 350 && temp <= 999) {
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


