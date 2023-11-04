// Version 3.0

let running = false;

function getRandomInt(min, max) {
   let minB, maxB;
   minB = Math.ceil(Number(min));
   maxB = Math.floor(Number(max));
   return Math.floor(Math.random() * (maxB - minB + 1)) + minB;
}

let INPUT = "";
let graph = [];

let maxIntersections = 250;
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
      intersections = getRandomInt(2, 100);
   }

   if (streets == "auto") {

      let value1 = Math.floor(Math.random() * 4) * 3;
      let value2 = Math.floor(Math.random() * 2) + 9;
      let value3 = Math.floor(Math.random() * 3) + 7;

      let value4 = Math.floor(Math.sqrt(intersections) * 2);

      // Use Sin, Cos, Tan to get a random number between 1 and value4
      let value5 = Math.floor(Math.sin(Math.random() * 2 * Math.PI) * value4) + 1;
      let value6 = Math.floor(Math.cos(Math.random() * 2 * Math.PI) * value4) + 1;
      let value7 = Math.floor(Math.tan(Math.random() * 2 * Math.PI) * value4) + 1;

      streets = Math.floor(value1 + value2 + value3 + value4 + value5 + value6 + value7);

      // Make streets always positive

      if (streets < 0) {
         streets = streets * -1;
      }

      if (streets < intersections) {
         streets = streets + intersections;
      }

   } else {
      streets = intersections * streets;
   }


   if (totalCars <= 1 || totalCars > 1000 || totalCars == "") {
      totalCars = getRandomInt(1, 500);
   }
   if (bonusPoints <= 1 || bonusPoints > 1000 || bonusPoints == "") {
      bonusPoints = getRandomInt(1, 1000);
   }

   if (maxStreetsPerIntersection <= 3 || maxStreetsPerIntersection > 8 || maxStreetsPerIntersection == "") {
      maxStreetsPerIntersection = getRandomInt(3, 27);
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


   let engine = document.getElementById("engine").value;

   if (engine == "1") {
      setTimeout(() => {
         generateInputFile(duration, intersections, streets, totalCars, bonusPoints, maxStreetsPerIntersection, maxStreetsInPath);
      }, 500);
   } else {
      setTimeout(() => {
         generateInputFile2(duration, intersections, streets, totalCars, bonusPoints, maxStreetsPerIntersection, maxStreetsInPath);
      }, 500);
   }

}

// NEW ENGINE

function generateInputFile(D, I, S, V, F, maxStreetsPerIntersection, maxStreetsInPath) {
   running = true;

   let timeNow = performance.now();

   let inputFile = "";
   inputFile += `${D} ${I} ${S} ${V} ${F}\n`;

   // // generate streets
   // let g = 0;
   // let set = new Set(); // use a set instead of an array
   // let z = Math.floor(D / 7);
   // for (let i = 0; i < S; i++) {
   //    let c = i % I;
   //    if (c == 0) {
   //       g = g + 1;
   //    }
   //    let street = `${i % I} ${(i % I + g) % I} ${generateStreetName()}${i} ${getRandomInt(1, z)}`; // create a street string
   //    let reversed = reverseStreet(street); // reverse the street string
   //    if (!set.has(street) && !set.has(reversed)) { // check if the street or its reverse is not already in the set
   //       set.add(street); // add the street to the set
   //    }
   // }

   // // a function that reverses a street string
   // function reverseStreet(street) {
   //    let parts = street.split(" "); // split the string by spaces
   //    let reversed = parts[1] + " " + parts[0] + " " + parts[2] + " " + parts[3]; // swap the first two parts and keep the rest
   //    return reversed; // return the reversed string
   // }

   // let arr = Array.from(set); // convert the set to an array

   // // Shuffle the array
   // arr.sort(() => Math.random() - 0.5);


   // // Add the array to the input file
   // arr.forEach((element) => {
   //    inputFile += `${element}\n`;
   //    if (I < maxIntersections && S < maxStreets) {
   //       graph.push(element);
   //    }
   // });


   // Define an array to store the used intersections
   let usedIntersections = new Array(I).fill(false);

   // Generate streets
   let set = new Set(); // use a set instead of an array
   let z = Math.floor(D / 7);
   for (let i = 0; i < S; i++) {
      let startIntersection, endIntersection;
      let attempts = 0;
      do {
         startIntersection = getRandomInt(0, I - 1); // Randomly select start and end intersections
         endIntersection = getRandomInt(0, I - 1);
         attempts++;
         if (attempts > 1000) {
            // To prevent infinite loop, break if attempts exceed a threshold
            console.error("Exceeded maximum attempts to find suitable intersections.");
            break;
         }
      } while (startIntersection === endIntersection || usedIntersections[startIntersection] || usedIntersections[endIntersection]);

      usedIntersections[startIntersection] = true;
      usedIntersections[endIntersection] = true;

      let street = `${startIntersection} ${endIntersection} ${generateStreetName()}${i} ${getRandomInt(1, z)}`; // create a street string
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



   // WORKS OK

   // // generate intersections as a grid
   // let grid = [];
   // let rows = Math.floor(Math.sqrt(I)); // number of rows in the grid
   // let cols = Math.ceil(I / rows); // number of columns in the grid
   // for (let i = 0; i < rows; i++) {
   //    grid[i] = []; // create a new row
   //    for (let j = 0; j < cols; j++) {
   //       grid[i][j] = i * cols + j; // assign an index to each intersection
   //    }
   // }

   // // generate streets
   // let set = new Set(); // use a set instead of an array
   // let z = Math.floor(D / 7);
   // let street; // declare the street variable here
   // let reversed;
   // for (let i = 0; i < S; i++) {
   //    let start, end; // start and end intersections of the street
   //    do {
   //       // randomly select a row and a column
   //       let r = getRandomInt(0, rows - 1);
   //       let c = getRandomInt(0, cols - 1);
   //       // randomly select a direction (horizontal or vertical)
   //       let d = getRandomInt(0, 1);
   //       if (d == 0) { // horizontal direction
   //          // check if there is a column to the right
   //          if (c < cols - 1) {
   //             start = grid[r][c]; // start intersection is the current one
   //             end = grid[r][c + 1]; // end intersection is the one to the right
   //          } else { // no column to the right
   //             start = grid[r][c]; // start intersection is the current one
   //             end = grid[r][c - 1]; // end intersection is the one to the left
   //          }
   //       } else { // vertical direction
   //          // check if there is a row below
   //          if (r < rows - 1) {
   //             start = grid[r][c]; // start intersection is the current one
   //             end = grid[r + 1][c]; // end intersection is the one below
   //          } else { // no row below
   //             start = grid[r][c]; // start intersection is the current one
   //             end = grid[r - 1][c]; // end intersection is the one above
   //          }
   //       }
   //       street = `${start} ${end} ${generateStreetName()}${i} ${getRandomInt(1, z)}`; // create a street string
   //       reversed = reverseStreet(street); // reverse the street string
   //    } while (set.has(street) || set.has(reversed)); // repeat until the street or its reverse is not already in the set

   //    set.add(street); // add the street to the set

   // }


   // // a function that reverses a street string
   // function reverseStreet(street) {
   //    let parts = street.split(" "); // split the string by spaces
   //    let reversed = parts[1] + " " + parts[0] + " " + parts[2] + " " + parts[3]; // swap the first two parts and keep the rest
   //    return reversed; // return the reversed string
   // }

   // let arr = Array.from(set); // convert the set to an array

   // // Shuffle the array
   // arr.sort(() => Math.random() - 0.5);


   // // Add the array to the input file
   // arr.forEach((element) => {
   //    inputFile += `${element}\n`;
   //    if (I < maxIntersections && S < maxStreets) {
   //       graph.push(element);
   //    }
   // });



   INPUT = inputFile;

   let carPaths = generateCarPaths(INPUT, maxStreetsInPath);

   let carPathsS2 = "";

   for (let i = 0; i < carPaths.length; i++) {
      let path = carPaths[i];
      let pathStr = `${path.length} ${path.join(" ")}\n`;
      INPUT += pathStr;

      carPathsS2 += pathStr;
   }

   // Reset the graphs

   document.getElementById("cy").innerHTML = "";
   document.getElementById("cy1").innerHTML = "";
   document.getElementById("cy2").innerHTML = "";

   // Reset the textarea and the download link

   document.getElementById("textArea").value = "";


   // Append to the input file

   if (I < maxIntersections && S < maxStreets) {
      let data = graph.join("\n");
      let data2 = carPathsS2;

      try {
         createGraph(data, "cy");
         document.getElementById("cy").classList.remove("hidden");
      } catch (error) {
         console.log("Error creating graph");
         document.getElementById("cy").classList.add("hidden");

      }

      try {
         document.getElementById("cy2").classList.remove("hidden");
         generateGraph2(data2);
      } catch (error) {
         console.log("Error creating graph of cars");
         document.getElementById("cy2").classList.add("hidden");

      }

      try {
         generateGraph(data);
         document.getElementById("cy1").classList.remove("hidden");
      } catch (error) {
         console.log("Error creating graph");
         document.getElementById("cy1").classList.add("hidden");
      }


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

   let timeDone = performance.now();

   let timeDiff = timeDone - timeNow;

   let timeDiff2 = timeDiff / 1000;

   let timeDiff3 = timeDiff2.toFixed(2);

   toast(`Generation time: ${timeDiff3} seconds`);
   running = false;
}



function generateInputFile2(D, I, S, V, F, maxStreetsPerIntersection, maxStreetsInPath) {
   running = true;

   let timeNow = performance.now();

   let inputFile = "";
   inputFile += `${D} ${I} ${S} ${V} ${F}\n`;

   // WORKS FINE!! OLD!!!
   // generate streets
   let g = 0;
   let set = new Set();
   let z = Math.floor(D / 7);
   for (let i = 0; i < S; i++) {
      let c = i % I;
      if (c == 0) {
         g = g + 1;
      }
      let street = `${i % I} ${(i % I + g) % I} ${generateStreetName()}${i} ${getRandomInt(1, z)}`; // create a street string
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


   // // WORKS OK

   // // generate intersections as a grid
   // let grid = [];
   // let rows = Math.floor(Math.sqrt(I)); // number of rows in the grid
   // let cols = Math.ceil(I / rows); // number of columns in the grid
   // for (let i = 0; i < rows; i++) {
   //    grid[i] = []; // create a new row
   //    for (let j = 0; j < cols; j++) {
   //       grid[i][j] = i * cols + j; // assign an index to each intersection
   //    }
   // }

   // // generate streets
   // let set = new Set(); // use a set instead of an array
   // let z = Math.floor(D / 7);
   // let street; // declare the street variable here
   // let reversed;
   // for (let i = 0; i < S; i++) {
   //    let start, end; // start and end intersections of the street
   //    do {
   //       // randomly select a row and a column
   //       let r = getRandomInt(0, rows - 1);
   //       let c = getRandomInt(0, cols - 1);
   //       // randomly select a direction (horizontal or vertical)
   //       let d = getRandomInt(0, 1);
   //       if (d == 0) { // horizontal direction
   //          // check if there is a column to the right
   //          if (c < cols - 1) {
   //             start = grid[r][c]; // start intersection is the current one
   //             end = grid[r][c + 1]; // end intersection is the one to the right
   //          } else { // no column to the right
   //             start = grid[r][c]; // start intersection is the current one
   //             end = grid[r][c - 1]; // end intersection is the one to the left
   //          }
   //       } else { // vertical direction
   //          // check if there is a row below
   //          if (r < rows - 1) {
   //             start = grid[r][c]; // start intersection is the current one
   //             end = grid[r + 1][c]; // end intersection is the one below
   //          } else { // no row below
   //             start = grid[r][c]; // start intersection is the current one
   //             end = grid[r - 1][c]; // end intersection is the one above
   //          }
   //       }
   //       street = `${start} ${end} ${generateStreetName()}${i} ${getRandomInt(1, z)}`; // create a street string
   //       reversed = reverseStreet(street); // reverse the street string
   //    } while (set.has(street) || set.has(reversed)); // repeat until the street or its reverse is not already in the set

   //    set.add(street); // add the street to the set

   // }


   // // a function that reverses a street string
   // function reverseStreet(street) {
   //    let parts = street.split(" "); // split the string by spaces
   //    let reversed = parts[1] + " " + parts[0] + " " + parts[2] + " " + parts[3]; // swap the first two parts and keep the rest
   //    return reversed; // return the reversed string
   // }

   // let arr = Array.from(set); // convert the set to an array

   // // Shuffle the array
   // arr.sort(() => Math.random() - 0.5);


   // // Add the array to the input file
   // arr.forEach((element) => {
   //    inputFile += `${element}\n`;
   //    if (I < maxIntersections && S < maxStreets) {
   //       graph.push(element);
   //    }
   // });



   INPUT = inputFile;

   let carPaths = generateCarPaths(INPUT, maxStreetsInPath);

   let carPathsS2 = "";

   for (let i = 0; i < carPaths.length; i++) {
      let path = carPaths[i];
      let pathStr = `${path.length} ${path.join(" ")}\n`;
      INPUT += pathStr;

      carPathsS2 += pathStr;
   }

   // Reset the graphs

   document.getElementById("cy").innerHTML = "";
   document.getElementById("cy1").innerHTML = "";
   document.getElementById("cy2").innerHTML = "";

   // Reset the textarea and the download link

   document.getElementById("textArea").value = "";


   // Append to the input file

   if (I < maxIntersections && S < maxStreets) {
      let data = graph.join("\n");
      let data2 = carPathsS2;

      try {
         createGraph(data, "cy");
         document.getElementById("cy").classList.remove("hidden");
      } catch (error) {
         console.log("Error creating graph");
         document.getElementById("cy").classList.add("hidden");

      }

      try {
         document.getElementById("cy2").classList.remove("hidden");
         generateGraph2(data2);
      } catch (error) {
         console.log("Error creating graph of cars");
         document.getElementById("cy2").classList.add("hidden");

      }

      try {
         generateGraph(data);
         document.getElementById("cy1").classList.remove("hidden");
      } catch (error) {
         console.log("Error creating graph");
         document.getElementById("cy1").classList.add("hidden");
      }


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

   let timeDone = performance.now();

   let timeDiff = timeDone - timeNow;

   let timeDiff2 = timeDiff / 1000;

   let timeDiff3 = timeDiff2.toFixed(2);

   toast(`Generation time: ${timeDiff3} seconds`);
   running = false;
}

// Uses duration as a seed

// function generateCarPaths(inputData) {
//    // Split the input data by newline characters
//    let lines = inputData.split("\n");
//    // Parse the first line
//    let [duration, intersections, streets, cars, bonus] = lines[0].split(" ").map(Number);
//    // Create an object to store street information
//    let streetMap = {};
//    // Loop through street lines
//    for (let i = 1; i <= streets; i++) {
//       // Split each line by space characters
//       let tokens = lines[i].split(" ");
//       // Add a new entry to streetMap
//       streetMap[tokens[2]] = {
//          start: parseInt(tokens[0]),
//          end: parseInt(tokens[1]),
//          length: parseInt(tokens[3])
//       };
//    }
//    // Create an array to store car paths
//    let carPaths = [];
//    // Loop through car numbers
//    for (let i = 0; i < cars; i++) {
//       // Create an array to store the current car path
//       let path = [];
//       // Choose a random intersection as the current one
//       let current = Math.floor(Math.random() * intersections);
//       // Create a set to store visited intersections
//       let visited = new Set();
//       // Create a variable to store time spent
//       let time = 0;
//       // While time is less than duration and visited intersections are less than total intersections
//       while (time < duration && visited.size < intersections) {
//          // Add current intersection to visited
//          visited.add(current);
//          // Create an array to store possible street options
//          let options = [];
//          // Loop through streetMap entries
//          for (let [name, info] of Object.entries(streetMap)) {
//             // If the street starts from the current intersection, add it to options
//             if (info.start === current) {
//                options.push(name);
//             }
//          }
//          // If no options are available, break out of the loop
//          if (options.length === 0) {
//             break;
//          }
//          // Choose a random street from options
//          let choice = options[Math.floor(Math.random() * options.length)];
//          // Add the chosen street to the path
//          path.push(choice);
//          // Update the current intersection to be the end of the chosen street
//          current = streetMap[choice].end;
//          // Update the time spent to be the sum of previous time and the length of the chosen street
//          time += streetMap[choice].length;
//       }
//       // Add the path to carPaths
//       carPaths.push(path);
//    }
//    // Return carPaths
//    return carPaths;
// }


// function generateCarPaths(inputData, maxStreetsInPath) {
//    let lines = inputData.split("\n");
//    let [duration, intersections, streets, cars, bonus] = lines[0].split(" ").map(Number);
//    let streetMap = {};
//    for (let i = 1; i <= streets; i++) {
//       let tokens = lines[i].split(" ");
//       streetMap[tokens[2]] = {
//          start: parseInt(tokens[0]),
//          end: parseInt(tokens[1]),
//          length: parseInt(tokens[3])
//       };
//    }
//    let carPaths = [];
//    let maxStreets = maxStreetsInPath;
//    for (let i = 0; i < cars; i++) {
//       // Create an array to store the current car path
//       let path = [];
//       // Choose a random intersection as the current one
//       let current = Math.floor(Math.random() * intersections);
//       // Create a set to store visited intersections
//       let visited = new Set();
//       // Create a variable to store time spent
//       let time = 0;

//       // Choose a random number of streets for this car
//       let numStreets = Math.floor(Math.random() * maxStreets) + 1;
//       if (numStreets < 2) numStreets = 2;

//       // While number of streets is not reached
//       while (path.length < numStreets) {
//          // Add current intersection to visited
//          visited.add(current);
//          // Create an array to store possible street options
//          let options = [];
//          // Loop through streetMap entries
//          for (let [name, info] of Object.entries(streetMap)) {
//             // If the street starts from the current intersection, add it to options
//             if (info.start === current) {
//                options.push(name);
//             }
//          }
//          // If no options are available, break out of the loop
//          if (options.length === 0) {
//             break;
//          }
//          // Choose a random street from options
//          let choice = options[Math.floor(Math.random() * options.length)];
//          // Add the chosen street to the path
//          path.push(choice);
//          // Update the current intersection to be the end of the chosen street
//          current = streetMap[choice].end;
//          // Update the time spent to be the sum of previous time and the length of the chosen street
//          time += streetMap[choice].length;
//          // If time exceeds duration, break out of the loop
//          if (time > duration) {
//             break;
//          }
//       }
//       // Add the path to carPaths
//       carPaths.push(path);
//    }
//    // Return carPaths
//    return carPaths;
// }


function generateCarPaths(inputData, maxStreetsInPath) {
   let lines = inputData.split("\n");
   let [duration, intersections, streets, cars, bonus] = lines[0].split(" ").map(Number);
   let streetMap = {};
   for (let i = 1; i <= streets; i++) {
      let tokens = lines[i].split(" ");
      streetMap[tokens[2]] = {
         start: parseInt(tokens[0]),
         end: parseInt(tokens[1]),
         length: parseInt(tokens[3])
      };
   }
   let carPaths = [];
   let maxStreets = maxStreetsInPath;

   let beforeUsedPaths = [];
   // Check that maxStreets is not less than 2
   if (maxStreets < 2) maxStreets = 2;
   for (let i = 0; i < cars; i++) {
      // Create an array to store the current car path
      let path = [];
      // Choose a random intersection as the current one
      let current = Math.floor(Math.random() * intersections);
      // Create a set to store visited intersections
      let visited = new Set();
      // Create a variable to store time spent
      let time = 0;

      // Choose a random number of streets for this car
      let numStreets = Math.floor(Math.random() * maxStreets) + 1;
      // Assign 2 to numStreets if it is less than 2
      if (numStreets < 2) numStreets = 2;

      // While number of streets is not reached
      while (path.length < numStreets) {
         // Add current intersection to visited
         visited.add(current);
         // Create an array to store possible street options
         let options = [];
         // Loop through streetMap entries
         for (let [name, info] of Object.entries(streetMap)) {
            // If the street starts from the current intersection, add it to options
            if (info.start === current) {
               options.push(name);
            }
         }
         // If no options are available, break out of the loop
         if (options.length === 0) {
            break;
         }
         // Choose a random street from options
         let choice = options[Math.floor(Math.random() * options.length)];
         // Add the chosen street to the path
         path.push(choice);
         // Update the current intersection to be the end of the chosen street
         current = streetMap[choice].end;
         // Update the time spent to be the sum of previous time and the length of the chosen street
         time += streetMap[choice].length;
         // If time exceeds duration, break out of the loop
         if (time > duration) {
            break;
         }
      }


      // If the path is empty use a path that was generated in the previous iteration

      if (path.length == 0) {
         // Use a random path from beforeUsedPaths
         let randomPath = beforeUsedPaths[Math.floor(Math.random() * beforeUsedPaths.length)];
         // Copy the path to the current path
         path = [...randomPath];
      }


      // Add the path to carPaths
      carPaths.push(path);
      beforeUsedPaths.push(path);
   }
   // Return carPaths
   return carPaths;
}




// Helper functions


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

   // Reload the page after the download

   location.reload();
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


function generateStreetNetwork(inputData) {
   // Split the input data by newline characters
   let lines = inputData.split("\n");
   // Parse the first line
   let [duration, intersections, streets, cars, bonus] = lines[0].split(" ").map(Number);
   // Create an array to store street names
   let streetNames = [];
   // Create an object to store street information
   let streetMap = {};
   // Create an array to store car paths
   let carPaths = [];
   // Create an object to store traffic light schedule
   let trafficSchedule = {};
   // Loop through street numbers
   for (let i = 0; i < streets; i++) {
      // Generate a random street name using the same logic as in generateStreetNames function
      let name = generateStreetName();
      // Check if the name already exists in streetNames
      while (streetNames.includes(name)) {
         // Generate another name until it is unique
         name = generateStreetName();
      }
      // Push the name to streetNames
      streetNames.push(name);
      // Generate a random start intersection and a random end intersection
      let start = Math.floor(Math.random() * intersections);
      let end = Math.floor(Math.random() * intersections);
      // Make sure they are not equal
      while (start === end) {
         end = Math.floor(Math.random() * intersections);
      }
      // Generate a random length
      let length = Math.floor(Math.random() * 10) + 1;
      // Add a new entry to streetMap
      streetMap[name] = {
         start: start,
         end: end,
         length: length
      };
      // Add an entry to trafficSchedule for both start and end intersections, if they don't exist already
      if (!trafficSchedule[start]) {
         trafficSchedule[start] = [];
      }
      if (!trafficSchedule[end]) {
         trafficSchedule[end] = [];
      }
      // Push an object with street name and length to both arrays
      trafficSchedule[start].push({
         street: name,
         time: length
      });
      trafficSchedule[end].push({
         street: name,
         time: length
      });
   }
   // Loop through car numbers
   for (let j = 0; j < cars; j++) {
      // Create an array to store the current car path
      let path = [];
      // Choose a random street as the first one
      let current = streetNames[Math.floor(Math.random() * streetNames.length)];
      // Push it to path
      path.push(current);
      // Create a set to store visited streets
      let visited = new Set();
      // Add current to visited
      visited.add(current);
      // Create a variable to store time spent
      let time = 0;
      // While time is less than duration
      while (time < duration) {
         // Update time to be the sum of previous time and the length of the current street
         time += streetMap[current].length;
         // Create an array to store possible street options
         let options = [];
         // Loop through streetMap entries
         for (let [name, info] of Object.entries(streetMap)) {
            // If the street starts from the end intersection of the current street, add it to options
            if (info.start === streetMap[current].end) {
               options.push(name);
            }
         }
         // If no options are available, break out of the loop
         if (options.length === 0) {
            break;
         }
         // Choose a random element from options that is not in visited
         let choice = options.filter(name => !visited.has(name))[Math.floor(Math.random() * options.filter(name => !visited.has(name)).length)];
         // If all elements in options are in visited, choose any random element from options
         if (!choice) {
            choice = options[Math.floor(Math.random() * options.length)];
         }
         // Push the chosen element to path
         path.push(choice);
         // Update current to be the chosen element
         current = choice;
         // Add current to visited
         visited.add(current);
      }
      // Push path to carPaths
      carPaths.push(path);
   }
   // Return an object containing streetNames, streetMap, and carPaths
   return {
      streetNames: streetNames,
      streetMap: streetMap,
      carPaths: carPaths
   };
}

// Helper function to generate a random street name
function generateStreetName() {

   let name11 = document.getElementById("names").value;

   if (name11 == 1) {
      return "street";
   }

   // Create an array to store possible prefixes and suffixes for street names
   let prefixes = ["rue", "avenue", "boulevard", "place", "square", "lane", "road", "street", "rruga", "bulevardi", "sheshi", "rrethi", "bulevard", "buleva"];
   let suffixes = ["de", "d'", "du", "des", "le", "la", "les"];
   // Create an array to store possible words for street names
   let words = ["paris", "berlin", "london", "rome", "athens", "moscow", "tokyo", "newyork", "lisbon", "madrid", "cairo", "beijing", "sydney", "rio", "prishtina"];
   // Choose a random prefix and a random word from the arrays
   let prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
   let word = words[Math.floor(Math.random() * words.length)];
   // Create a variable to store the street name
   let name = prefix + " ";
   // With a 50% chance, add a random suffix before the word
   if (Math.random() < 0.5) {
      let suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
      name += suffix + " ";
   }
   // Add the word to the name
   name += word;
   // Return the name

   // Replace spaces with underscores
   name = name.replace(/\s/g, "_");

   return name;
}


function preset(value) {
   switch (value) {
      case "downtownrush":
         document.getElementById("duration").value = 120;
         document.getElementById("intersections").value = 100;
         document.getElementById("streets").value = 5;
         document.getElementById("totalCars").value = 500;
         document.getElementById("bonusPoints").value = 800;
         document.getElementById("maxStreetsInPath").value = 4;
         break;
      case "suburbanserenity":
         document.getElementById("duration").value = 70;
         document.getElementById("intersections").value = 80;
         document.getElementById("streets").value = 3;
         document.getElementById("totalCars").value = 300;
         document.getElementById("bonusPoints").value = 300;
         document.getElementById("maxStreetsInPath").value = 3;
         break;
      case "industrialhustle":
         document.getElementById("duration").value = 200;
         document.getElementById("intersections").value = 120;
         document.getElementById("streets").value = 6;
         document.getElementById("totalCars").value = 400;
         document.getElementById("bonusPoints").value = 700;
         document.getElementById("maxStreetsInPath").value = 5;
         break;
      case "coastalcruise":
         document.getElementById("duration").value = 250;
         document.getElementById("intersections").value = 150;
         document.getElementById("streets").value = "auto";
         document.getElementById("totalCars").value = 100;
         document.getElementById("bonusPoints").value = 700;
         document.getElementById("maxStreetsInPath").value = 6;
         break;

      case "mountainretreat":
         document.getElementById("duration").value = 147;
         document.getElementById("intersections").value = 90;
         document.getElementById("streets").value = 4;
         document.getElementById("totalCars").value = 400;
         document.getElementById("bonusPoints").value = 1000;
         document.getElementById("maxStreetsInPath").value = 4;
         break;
      case "historicjourney":
         document.getElementById("duration").value = 318;
         document.getElementById("intersections").value = 110;
         document.getElementById("streets").value = 3;
         document.getElementById("totalCars").value = 450;
         document.getElementById("bonusPoints").value = 400;
         document.getElementById("maxStreetsInPath").value = 3;
         break;
      case "metropolitanmadness":
         document.getElementById("duration").value = 350;
         document.getElementById("intersections").value = 180;
         document.getElementById("streets").value = 6;
         document.getElementById("totalCars").value = 800;
         document.getElementById("bonusPoints").value = 1000;
         document.getElementById("maxStreetsInPath").value = 5;
         break;
      case "ruralrespite":
         document.getElementById("duration").value = 110;
         document.getElementById("intersections").value = 70;
         document.getElementById("streets").value = 3;
         document.getElementById("totalCars").value = 200;
         document.getElementById("bonusPoints").value = 250;
         document.getElementById("maxStreetsInPath").value = 3;
         break;

      case "technologyhub":
         document.getElementById("duration").value = 289;
         document.getElementById("intersections").value = 200;
         document.getElementById("streets").value = "auto";
         document.getElementById("totalCars").value = 1000;
         document.getElementById("bonusPoints").value = 1000;
         document.getElementById("maxStreetsInPath").value = 6;
         break;
      case "universitytown":
         document.getElementById("duration").value = 247;
         document.getElementById("intersections").value = 130;
         document.getElementById("streets").value = 4;
         document.getElementById("totalCars").value = 600;
         document.getElementById("bonusPoints").value = 650;
         document.getElementById("maxStreetsInPath").value = 4;
         break;
      case "example":
         document.getElementById("duration").value = 6;
         document.getElementById("intersections").value = 4;
         document.getElementById("streets").value = 3;
         document.getElementById("totalCars").value = 2;
         document.getElementById("bonusPoints").value = 1000;
         document.getElementById("maxStreetsInPath").value = 15;
         break;
      case "etoile":
         document.getElementById("duration").value = 676;
         document.getElementById("intersections").value = 500;
         document.getElementById("streets").value = 3;
         document.getElementById("totalCars").value = 1000;
         document.getElementById("bonusPoints").value = 500;
         document.getElementById("maxStreetsInPath").value = 15;
         break;
      case "checkmate":
         document.getElementById("duration").value = 164;
         document.getElementById("intersections").value = 1000;
         document.getElementById("streets").value = 3;
         document.getElementById("totalCars").value = 1000;
         document.getElementById("bonusPoints").value = 100;
         document.getElementById("maxStreetsInPath").value = 9;
         break;
      default:
         document.getElementById("duration").value = 400;
         document.getElementById("intersections").value = 100;
         document.getElementById("streets").value = 3;
         document.getElementById("totalCars").value = 100;
         document.getElementById("bonusPoints").value = 1000;
         document.getElementById("maxStreetsInPath").value = 3;
         break;
   }

   window.scrollTo({
      top: 0,
      behavior: 'smooth'
   });
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


const bugReporter = document.getElementById('bug-reporter');
bugReporter.addEventListener('click', () => {
   window.open('https://github.com/ErzenXz/instance-generator-traffic/issues/new', '_blank');
});

const body = document.querySelector("body"),
   modeToggle = body.querySelector("#theme-switcher");


let getMode = localStorage.getItem("mode");

if (getMode && getMode === "dark") {
   body.classList.toggle("dark");
}


modeToggle.addEventListener("click", () => {
   body.classList.toggle("dark");
   if (body.classList.contains("dark")) {
      localStorage.setItem("mode", "dark");
   } else {
      localStorage.setItem("mode", "light");
   }
});
