// Version 2.0

let running = false;

function getRandomInt(min, max) {
   let minB, maxB;
   minB = Math.ceil(Number(min));
   maxB = Math.floor(Number(max));
   return Math.floor(Math.random() * (maxB - minB + 1)) + minB;
}

let INPUT = "";
let graph = [];

let maxIntersections = 450;
let maxStreets = 500;


function getData() {
   // Check if the engine is alerdy running

   if (running) {
      alert("The engine is alerdy running, please wait...");
      return false;
   }

   // Get all the data from the input fields

   let duration = document.getElementById("duration").value;
   let intersections = document.getElementById("intersections").value;
   let streets = document.getElementById("streets").value;
   let totalCars = document.getElementById("totalCars").value;
   let bonusPoints = document.getElementById("bonusPoints").value;
   let maxStreetsPerIntersection = 3;
   let maxStreetsInPath = document.getElementById("maxStreetsInPath").value;

   // Validate the data

   if (duration <= 1 || duration > 10000 || duration == "") {
      duration = getRandomInt(1, 10000);
   }
   if (intersections <= 2 || intersections > 100000 || intersections == "") {
      intersections = getRandomInt(2, 100000);
   }

   streets = intersections * streets;

   console.log(streets);

   if (totalCars <= 1 || totalCars > 1000 || totalCars == "") {
      totalCars = getRandomInt(1, 1000);
   }
   if (bonusPoints <= 1 || bonusPoints > 1000 || bonusPoints == "") {
      bonusPoints = getRandomInt(1, 1000);
   }

   if (maxStreetsPerIntersection <= 3 || maxStreetsPerIntersection > 8 || maxStreetsPerIntersection == "") {
      maxStreetsPerIntersection = getRandomInt(3, 8);
   }

   let streetPathFormula = streets / 2;

   if (maxStreetsInPath <= 2 || maxStreetsInPath > streetPathFormula || maxStreetsInPath == "") {
      maxStreetsInPath = getRandomInt(2, streets / 2);
   }

   let maxIntersections = Math.floor(streets / maxStreetsPerIntersection);


   document.getElementById("data").classList.add("hidden");
   document.getElementById("running").classList.remove("hidden");

   // Start the generation process
   document.getElementById("loading").classList.remove("hidden");

   console.time("Generation time");

   setTimeout(() => {
      generateInputFile(duration, intersections, streets, totalCars, bonusPoints, maxStreetsPerIntersection, maxStreetsInPath);
   }, 500);

}





// function generateInputFile(D, I, S, V, F, maxStreetsPerIntersection, maxStreetsInPath) {
//    running = true;

//    let inputFile = "";
//    inputFile += `${D} ${I} ${S} ${V} ${F}\n`;

//    // generate streets
//    let g = 0;
//    let set = new Set(); // use a set instead of an array
//    for (let i = 0; i < S; i++) {
//       let c = i % I;
//       if (c == 0) {
//          g = g + 1;
//       }
//       let street = `${i % I} ${(i % I + g) % I} street${i} ${getRandomInt(1, 4)}`; // create a street string
//       let reversed = reverseStreet(street); // reverse the street string
//       if (!set.has(street) && !set.has(reversed)) { // check if the street or its reverse is not already in the set
//          set.add(street); // add the street to the set
//       }
//    }

//    // a function that reverses a street string
//    function reverseStreet(street) {
//       let parts = street.split(" "); // split the string by spaces
//       let reversed = parts[1] + " " + parts[0] + " " + parts[2] + " " + parts[3]; // swap the first two parts and keep the rest
//       return reversed; // return the reversed string
//    }

//    let arr = Array.from(set); // convert the set to an array

//    // Shuffle the array
//    arr.sort(() => Math.random() - 0.5);


//    // Add the array to the input file
//    arr.forEach((element) => {
//       inputFile += `${element}\n`;
//       if (I < maxIntersections && S < maxStreets) {
//          graph.push(element);
//       }
//    });


//    let carsArr = [];

//    // generate cars
//    for (let i = 0; i < V; i++) {
//       const P = Math.floor(Math.random() * 50) + 2; // random number between 2 and 71
//       const path = Array.from({ length: P }, (_, i) => `street${Math.floor(Math.random() * S)}`);

//       let set = new Set(path);
//       let clo = [...set]; // Change to path to allow duplicates

//       inputFile += `${clo.length} ${clo.join(" ")}\n`;


//       if (I < maxIntersections && S < maxStreets) {
//          carsArr.push(`${clo.length} ${clo.join(" ")}`);
//       }
//    }

//    INPUT = inputFile;

//    if (I < maxIntersections && S < maxStreets) {
//       let data = graph.join("\n");
//       let data2 = carsArr.join("\n");
//       generateGraph(data);
//       generateGraph2(data2);
//       document.getElementById("cy").classList.remove("hidden");
//       document.getElementById("cy2").classList.remove("hidden");

//       document.getElementById("download").classList.remove("hidden");
//    } else {
//       document.getElementById("textArea").classList.remove("hidden");
//       document.getElementById("download").classList.remove("hidden");
//       document.getElementById("textArea").value = INPUT;
//    }
//    // Create download link for the file


//    console.timeEnd("Generation time");
//    document.getElementById("data").classList.remove("hidden");
//    document.getElementById("running").classList.add("hidden");
//    document.getElementById("loading").classList.add("hidden");

//    document.getElementById("data").classList.remove("hidden");
//    document.getElementById("running").classList.add("hidden");
//    document.getElementById("loading").classList.add("hidden");

//    running = false;
// }






function generateInputFile(D, I, S, V, F, maxStreetsPerIntersection, maxStreetsInPath) {
   running = true;

   let inputFile = "";
   inputFile += `${D} ${I} ${S} ${V} ${F}\n`;

   // generate streets
   let g = 0;
   let set = new Set(); // use a set instead of an array
   let z = Math.floor(D / 2);
   for (let i = 0; i < S; i++) {
      let c = i % I;
      if (c == 0) {
         g = g + 1;
      }
      let street = `${i % I} ${(i % I + g) % I} street${i} ${getRandomInt(1, z)}`; // create a street string
      let reversed = reverseStreet(street); // reverse the street string
      if (!set.has(street) && !set.has(reversed)) { // check if the street or its reverse is not already in the set
         set.add(street); // add the street to the set
      }
   }

   // a function that reverses a street string
   function reverseStreet(street) {
      let parts = street.split(" "); // split the string by spaces
      let reversed = parts[1] + " " + parts[0] + " " + parts[2] + " " + parts[3]; // swap the first two parts and keep the rest
      return reversed; // return the reversed string
   }

   let arr = Array.from(set); // convert the set to an array

   // Shuffle the array
   arr.sort(() => Math.random() - 0.5);


   // Add the array to the input file
   arr.forEach((element) => {
      inputFile += `${element}\n`;
      if (I < maxIntersections && S < maxStreets) {
         graph.push(element);
      }
   });


   // generate cars
   let carsArr = [];

   for (let i = 0; i < V; i++) {
      const P = Math.floor(Math.random() * (maxStreetsInPath - 1)) + 2; // Random number between 2 and maxStreetsInPath
      const path = Array.from({ length: P }, (_, i) => {
         const randomStreetIndex = Math.floor(Math.random() * S);
         return `street${randomStreetIndex}`;
      });

      if (path.length <= maxStreetsInPath) {
         let set = new Set(path);
         let clo = [...set]; // Change to path to allow duplicates

         inputFile += `${clo.length} ${clo.join(" ")}\n`;

         carsArr.push(`${clo.length} ${clo.join(" ")}`);
      }
   }

   INPUT = inputFile;

   if (I < maxIntersections && S < maxStreets) {
      let data = graph.join("\n");
      let data2 = carsArr.join("\n");
      createGraph(data, "cy");
      generateGraph2(data2);
      generateGraph(data);
      document.getElementById("cy").classList.remove("hidden");
      document.getElementById("cy1").classList.remove("hidden");
      document.getElementById("cy2").classList.remove("hidden");

      document.getElementById("download").classList.remove("hidden");
   } else {
      document.getElementById("textArea").classList.remove("hidden");
      document.getElementById("download").classList.remove("hidden");
      document.getElementById("textArea").value = INPUT;
   }
   // Create download link for the file


   console.timeEnd("Generation time");
   document.getElementById("data").classList.remove("hidden");
   document.getElementById("running").classList.add("hidden");
   document.getElementById("loading").classList.add("hidden");

   document.getElementById("data").classList.remove("hidden");
   document.getElementById("running").classList.add("hidden");
   document.getElementById("loading").classList.add("hidden");

   running = false;
}


function downloadFile() {
   if (INPUT == "") {
      alert("Please generate the input file first");
      return;
   }

   let type = document.getElementById("export").value;

   if (type == "json") {
      let jsonStr = convertDataToJSON(INPUT);

      const blob = new Blob([jsonStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const downloadLink = document.createElement("a");
      downloadLink.href = url;
      downloadLink.download = `D:${new Date().getTime()}.json`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
   } else if (type == "yaml") {

      let xmlData = dataToYAML(INPUT);

      const blob = new Blob([xmlData], { type: "application/x-yaml" });
      const url = URL.createObjectURL(blob);
      const downloadLink = document.createElement("a");
      downloadLink.href = url;
      downloadLink.download = `D:${new Date().getTime()}.yml`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
   } else {
      const blob = new Blob([INPUT], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const downloadLink = document.createElement("a");
      downloadLink.href = url;
      downloadLink.download = `D:${new Date().getTime()}.txt`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
   }
}

// A function that takes a string of data as input and returns a JSON object
function convertDataToJSON(data) {
   // Split the data by line breaks
   let lines = data.split("\n");
   // Initialize an empty object to store the JSON output
   let output = {};
   // Get the simulation parameters from the first line
   let [duration, intersections, streets, cars, bonus] = lines[0].split(" ").map(Number);
   // Add the simulation and bonus keys to the output object
   output.simulation = { duration, intersections, streets, cars, bonus };
   // Call a helper function to get the streets information
   output.streets = getStreets(lines, streets);
   // Call another helper function to get the cars information
   output.cars = getCars(lines, streets);
   // Return the output object as JSON
   return JSON.stringify(output);
}

// A helper function that takes an array of lines and a number of streets as input and returns an array of street objects
function getStreets(lines, streets) {
   // Initialize an empty array to store the street objects
   let streetsArray = [];
   // Loop through the next S lines to get the streets details
   for (let i = 1; i <= streets; i++) {
      // Split each line by space
      let [start, end, name, time] = lines[i].split(" ");
      // Convert the start, end and time values to numbers
      start = Number(start);
      end = Number(end);
      time = Number(time);
      // Create an object for each street and push it to the streets array
      let streetObject = { start, end, name, time };
      streetsArray.push(streetObject);
   }
   // Return the streets array
   return streetsArray;
}

// Another helper function that takes an array of lines and a number of streets as input and returns an array of car objects
function getCars(lines, streets) {
   // Initialize an empty array to store the car objects
   let carsArray = [];
   // Loop through the remaining lines to get the cars details
   for (let i = streets + 1; i < lines.length; i++) {
      // Split each line by space
      let [path_length, ...path] = lines[i].split(" ");
      // Convert the path_length value to a number
      path_length = Number(path_length);
      // Create an object for each car and push it to the cars array
      let carObject = { path_length, path };
      if (path_length > 1) {
         carsArray.push(carObject);
      }
   }
   // Return the cars array
   return carsArray;
}