// Version 1.0

let running = false;

function getRandomInt(min, max) {
   let minB, maxB;
   minB = Math.ceil(Number(min));
   maxB = Math.floor(Number(max));
   return Math.floor(Math.random() * (maxB - minB + 1)) + minB;
}

const roads = [
   "main-st",
   "broadwy",
   "park-av",
   "5th-av",
   "lombard",
   "rodeo-dr",
   "abbey-r",
   "champs",
   "la-ramb",
   "oxford",
];

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

   // Validate the data

   if (duration <= 1 || duration > 10000 || duration == "") {
      duration = getRandomInt(1, 10000);
   }
   if (intersections <= 2 || intersections > 100000 || intersections == "") {
      intersections = getRandomInt(2, 100000);
   }
   if (streets <= 2 || streets > 100000 || streets == "") {
      streets = getRandomInt(2, 100000);
   }
   if (totalCars <= 1 || totalCars > 1000 || totalCars == "") {
      totalCars = getRandomInt(1, 1000);
   }
   if (bonusPoints <= 1 || bonusPoints > 1000 || bonusPoints == "") {
      bonusPoints = getRandomInt(1, 1000);
   }

   document.getElementById("data").classList.add("hidden");
   document.getElementById("running").classList.remove("hidden");

   // Start the generation process

   generateInputFile(duration, intersections, streets, totalCars, bonusPoints);
}

function generateInputFile(duration, numIntersections, numStreets, numCars, bonusPoints) {
   running = true;
   // Generate streets
   const streets = [];
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

   // Generate cars
   const cars = [];
   for (let i = 0; i < numCars; i++) {
      const numStreets = Math.floor(Math.random() * 995) + 2;
      const streets = [];
      for (let j = 0; j < numStreets; j++) {
         let char = Math.floor(Math.random() * roads.length);
         const streetIndex = Math.floor(Math.random() * numStreets);
         const streetName = `street-${streetIndex}`;
         streets.push(streetName);
      }
      cars.push(`${numStreets} ${streets.join(" ")}`);
   }

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
   const blob = new Blob([data], { type: "text/plain" });
   const url = URL.createObjectURL(blob);
   const downloadLink = document.createElement("a");
   downloadLink.href = url;
   downloadLink.download = `D:${formattedTime}.txt`;
   document.body.appendChild(downloadLink);
   downloadLink.click();
   document.body.removeChild(downloadLink);

   document.getElementById("data").classList.remove("hidden");
   document.getElementById("running").classList.add("hidden");
   running = false;
}
