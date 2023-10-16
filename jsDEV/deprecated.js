
function generateInputFileDeprecated(duration, numIntersections, numStreets, numCars, bonusPoints) {
    running = true;
    let ns = numStreets;

    // Generate streets
    let streets = [];
    for (let i = 0; i < numStreets; i++) {
        const startIntersection = Math.floor(Math.random() * numIntersections);
        let endIntersection;
        do {
            endIntersection = Math.floor(Math.random() * numIntersections);
        } while (endIntersection === startIntersection);
        const name = `street-${i}`;
        const time = Math.floor(Math.random() * duration) + 1;
        streets.push(`${startIntersection} ${endIntersection} ${name} ${time}`);
    }

    console.log(streets);

    // Generate cars
    const cars = [];
    const streetMap = new Map();

    // Initialize street map
    for (let i = 0; i < numStreets; i++) {
        const streetName = `street-${i}`;
        streetMap.set(streetName, 0);
    }

    // Assign streets to cars
    for (let i = 0; i < numCars; i++) {
        let numStreets2 = 1;
        if (ns > 995) {
            numStreets2 = Math.floor(Math.random() * 995) + 2;
        } else {
            numStreets2 = Math.floor(Math.random() * ns) + 2;
        }
        let streets = [];

        for (let j = 0; j < numStreets2; j++) {
            let streetIndex = Math.floor(Math.random() * Number(numStreets2));
            let diff = numStreets2 - streetIndex;
            diff = Math.abs(diff);
            if (streetIndex >= numStreets2) {
                streetIndex = streetIndex - 2 - diff;
            } else {
                if (streetIndex >= 2) {
                    streetIndex = Number(streetIndex - 2);
                }
            }
            const streetName = `street-${streetIndex}`;

            // Increment count of street usage
            streetMap.set(streetName, streetMap.get(streetName) + 1);

            streets.push(streetName);
        }

        cars.push(`${Number(numStreets2)} ${streets.join(" ")}`);
    }

    // Assign unused streets to a random car
    for (let [streetName, count] of streetMap) {
        if (count === 0) {
            const randomIndex = Math.floor(Math.random() * numCars);

            let str = String(cars[randomIndex]);

            let input_arr = str.split(" "); // split the string into an array of strings

            // increase the first number in the array by 1
            input_arr[0] = (parseInt(Number(input_arr[0])) + 1).toString();

            // join the array of strings back into a single string
            let newSTR = input_arr.join(" ");

            newSTR += ` ${streetName}`;

            cars[randomIndex] = newSTR;
        }
    }

    // let s = [...cars];

    // s = processStreetsArray(s);

    // let b = [...s];

    // b = fixArrayOrder(b);

    // Combine all data and format as text
    const data = [
        `${duration} ${numIntersections} ${numStreets} ${numCars} ${bonusPoints}`,
        ...streets,
        ...cars,
    ].join("\n");

    // Get the time

    const DATE = new Date();
    let formattedTime =
        DATE.getFullYear() +
        "-" +
        (DATE.getMonth() + 1) +
        "-" +
        DATE.getDate() +
        "-" +
        DATE.getHours() +
        ":" +
        DATE.getMinutes();

    // Create download link for the file
    INPUT = data;
    const blob = new Blob([data], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const downloadLink = document.createElement("a");
    downloadLink.href = url;
    downloadLink.download = `D:${formattedTime}.txt`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    console.timeEnd("Generation time");

    if (checkBOXSTATUS) {
        solve(INPUT);
    } else {
        document.getElementById("data").classList.remove("hidden");
        document.getElementById("running").classList.add("hidden");
        running = false;
    }
}



function processStreetsArray(arr) {

    console.time();
    const processedArr = [];

    for (let i = 0; i < arr.length; i++) {
        const streets = arr[i].split(" "); // Split the string into an array of streets
        const numStreets = parseInt(streets[0]); // Get the number of streets from the first value in the array

        // Remove duplicates from the streets array while keeping the order of streets
        const uniqueStreets = streets.slice(1).filter((street, index, self) => {
            return self.indexOf(street) === index;
        });

        // If the number of unique streets matches the number in the first value, push the processed string to the result array
        if (numStreets === uniqueStreets.length) {
            processedArr.push(`${numStreets} ${uniqueStreets.join(" ")}`);
        } else {
            // If the number of unique streets does not match the number in the first value, construct a new string with the updated count
            processedArr.push(`${uniqueStreets.length} ${uniqueStreets.join(" ")}`);
        }
    }
    console.timeEnd();
    return processedArr;
}



function matchFoods(array) {
    const foods = array.flatMap(str => str.split(' ')); // create an array of all the foods in the array
    const usedFoods = new Set(); // keep track of the foods that have been used
    let lastFood = null; // initialize the last food to null

    return array.map(str => {
        const [num, ...foodArr] = str.split(' '); // split the string into a number and an array of foods
        const remainingFoods = foodArr.filter(food => !usedFoods.has(food)); // filter out the used foods from the array
        let nextFood = remainingFoods.find(food => food !== lastFood); // find a food that hasn't been used and doesn't match the last food

        if (!nextFood) { // if no match was found, pick a random unused food
            const unusedFoods = foods.filter(food => !usedFoods.has(food));
            nextFood = unusedFoods.find(food => food !== lastFood);
            if (!nextFood) nextFood = unusedFoods[0];
        }

        lastFood = nextFood; // update the last food
        usedFoods.add(nextFood); // mark the food as used
        return `${num} ${[...remainingFoods.filter(food => food !== nextFood), nextFood].join(' ')}`; // join the array of foods into a string with the next food at the end
    });
}


function fixArrayOrder(array) {

    let result = [];

    let last = null;

    loop: for (let i = 0; i < array.length; i++) {
        let arr = array[i].split(" ");
        let n = arr[0];
        let length = arr.length - 1;

        let t = arr.join(" ");

        console.log(length + "   " + arr.length);

        if (last == null) {
            last = arr[length];
            result.push(t);
            continue loop;
        } else {
            arr[1] = last;
            last = arr[length];
        }

        let text = arr.join(" ");
        result.push(text);

    }

    let b = removeDuplicates(result);
    return b;
}

function removeDuplicates(array) {
    let result = [];
    for (let i = 0; i < array.length; i++) {

        let arr = array[i].split(" ");
        let n = Number(arr[0]);

        const uniqueArr = Array.from(new Set(arr));

        const numRemoved = arr.length - uniqueArr.length;

        n = n - numRemoved;

        uniqueArr[0] = String(n);

        let text = uniqueArr.join(" ");
        result.push(text);
    }
    return result;
}

// A JS function to generate an input file for Google Hashcode Traffic Signaling Problem
// The function takes five parameters: D, I, S, V, F
// The function returns a string containing the input file content




function generateInputFileDeprecated2(D, I, S, V, F) {
    // Initialize an empty string to store the input file content
    let input = "";

    // Add the first line with the five numbers
    input += `${D} ${I} ${S} ${V} ${F}\n`;

    // Generate random street names and lengths
    let streetNames = []; // An array to store the street names
    let streetLengths = []; // An array to store the street lengths
    let alphabet = "abcdefghijklmnopqrstuvwxyz-"; // A string of possible characters for street names

    for (let i = 0; i < S; i++) {
        // Generate a random street name with between 3 and 30 characters
        let nameLength = Math.floor(Math.random() * 28) + 3; // A random number between 3 and 30
        let name = ""; // An empty string to store the street name
        for (let j = 0; j < nameLength; j++) {
            // Pick a random character from the alphabet and append it to the name
            let charIndex = Math.floor(Math.random() * alphabet.length); // A random index between 0 and alphabet.length - 1
            let char = alphabet[charIndex]; // The character at that index
            name += char; // Append the character to the name
        }
        // Add the street name to the array of street names
        streetNames.push(name);

        // Generate a random street length with between 1 and D seconds
        let length = Math.floor(Math.random() * D) + 1; // A random number between 1 and D
        // Add the street length to the array of street lengths
        streetLengths.push(length);
    }

    // Generate random intersections and streets
    for (let i = 0; i < S; i++) {
        // Pick two random intersections for the start and end of the street
        let B = Math.floor(Math.random() * I); // A random number between 0 and I - 1
        let E = Math.floor(Math.random() * I); // A random number between 0 and I - 1

        // Make sure B and E are not equal
        while (B === E) {
            E = Math.floor(Math.random() * I); // Pick another random number for E
        }

        // Get the street name and length from the arrays
        let name = streetNames[i];
        let length = streetLengths[i];

        // Add a line with the intersection IDs, street name and length to the input file content
        input += `${B} ${E} ${name} ${length}\n`;
    }

    // Generate random paths for each car
    for (let i = 0; i < V; i++) {
        // Pick a random number of streets that the car wants to travel, between 2 and P
        let P = Math.floor(Math.random() * (S - 1)) + 2; // A random number between 2 and S

        // Initialize an empty array to store the street names for the path
        let path = [];

        // Pick a random starting intersection for the car
        let currentIntersection = Math.floor(Math.random() * I); // A random number between 0 and I - 1

        // Loop through P times to pick P streets for the path
        for (let j = 0; j < P; j++) {
            // Find all the streets that start from the current intersection
            let possibleStreets = []; // An array to store the possible streets

            for (let k = 0; k < S; k++) {
                // Get the start and end intersection IDs of each street
                let startID = parseInt(input.split("\n")[k + 1].split(" ")[0]); // The first number in each line after the first line
                let endID = parseInt(input.split("\n")[k + 1].split(" ")[1]); // The second number in each line after the first line

                // If the start ID matches the current intersection, add the street name to the possible streets array
                if (startID === currentIntersection) {
                    possibleStreets.push(input.split("\n")[k + 1].split(" ")[2]); // The third string in each line after the first line
                }
            }

            // Pick a random street from the possible streets array
            let streetIndex = Math.floor(Math.random() * possibleStreets.length); // A random index between 0 and possibleStreets.length - 1
            let streetName = possibleStreets[streetIndex]; // The street name at that index

            // Add the street name to the path array
            path.push(streetName);

            // Update the current intersection to be the end intersection of that street
            for (let k = 0; k < S; k++) {
                // Get the start and end intersection IDs of each street
                let startID = parseInt(input.split("\n")[k + 1].split(" ")[0]);
                let endID = parseInt(input.split("\n")[k + 1].split(" ")[1]);

                // If the start ID matches the current intersection and the street name matches the chosen one, update the current intersection to be the end ID 
                if (startID === currentIntersection && input.split("\n")[k + 1].split(" ")[2] === streetName) {
                    currentIntersection = endID;
                    break;
                }
            }
        }

        // Add a line with the number of streets and the path to the input file content 
        input += `${P} ${path.join(" ")}\n`;

    }

    return input;
}