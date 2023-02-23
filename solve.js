let checkBOXSTATUS = false;

function checkbox() {
   var checked = false;
   if (document.querySelector("#solve:checked")) {
      checked = true;
   }
   checkBOXSTATUS = checked;
}

// Parse input string
function parseInput(input) {
   const lines = input.trim().split("\n");
   const [D, I, S, V, F] = lines.shift().split(" ").map(Number);
   const streets = [];
   const paths = [];
   for (let i = 0; i < S; i++) {
      const [B, E, name, L] = lines.shift().split(" ");
      streets.push([B, E, name, Number(L)]);
   }
   for (let i = 0; i < V; i++) {
      const path = lines.shift().split(" ").slice(1);
      paths.push(path);
   }
   return { D, I, S, V, F, streets, paths };
}

// Calculate cycle times for each street
function calculateCycleTimes(streets, paths) {
   const freq = {};
   for (let i = 0; i < paths.length; i++) {
      for (let j = 0; j < paths[i].length; j++) {
         const streetName = paths[i][j];
         freq[streetName] = (freq[streetName] || 0) + 1;
      }
   }

   const cycleTimes = {};
   Object.entries(freq).forEach(([name, count]) => {
      const time = Math.ceil(count / 2);
      cycleTimes[name] = time > 0 ? time : 1;
   });

   return cycleTimes;
}

// Generate output string
function generateOutput(cycleTimes, I, streets) {
   let output = `${I}\n`;
   for (let i = 0; i < I; i++) {
      const intersectionStreets = streets.filter((street) => street[1] == i);
      output += `${i}\n${intersectionStreets.length}\n`;
      intersectionStreets.forEach((street) => {
         const cycleTime = cycleTimes[street[2]];
         output += `${street[2]} ${cycleTime || 1}\n`;
      });
   }
   return output;
}

// Main function
function solve(input) {
   const { D, I, S, V, F, streets, paths } = parseInput(input);
   const cycleTimes = calculateCycleTimes(streets, paths);
   const output = generateOutput(cycleTimes, I, streets);

   // Create chart of cycle times
   const ctx = document.getElementById("chart").getContext("2d");
   const chart = new Chart(ctx, {
      type: "line",
      data: {
         labels: Object.keys(cycleTimes),
         datasets: [
            {
               label: "Cycle Times",
               data: Object.values(cycleTimes),
               backgroundColor: "rgba(54, 162, 235, 0.2)",
               borderColor: "rgba(54, 162, 235, 1)",
               borderWidth: 1,
               hoverBackgroundColor: "rgba(54, 162, 235, 0.4)",
               hoverBorderColor: "rgba(54, 162, 235, 1)",
               // Set stacked property to true for horizontal bar chart
               stack: "Stack 0",
            },
         ],
      },
      options: {
         title: {
            display: true,
            text: "Cycle Times",
         },
         legend: {
            display: true,
         },
      },
   });

   // Chart of street usage
   const streetUsageCtx = document.getElementById("street-usage-chart").getContext("2d");
   const streetUsageData = streets.reduce((data, street) => {
      const streetName = street[2];
      data[streetName] = (data[streetName] || 0) + 1;
      return data;
   }, {});
   const streetUsageChart = new Chart(streetUsageCtx, {
      type: "bar",
      data: {
         labels: Object.keys(streetUsageData),
         datasets: [
            {
               label: "Street Usage",
               data: Object.values(streetUsageData),
               backgroundColor: "rgba(255, 99, 132, 0.2)",
               borderColor: "rgba(255, 99, 132, 1)",
               borderWidth: 1,
               hoverBackgroundColor: "rgba(255, 99, 132, 0.4)",
               hoverBorderColor: "rgba(255, 99, 132, 1)",
               // Set stacked property to true for horizontal bar chart
               stack: "Stack 0",
            },
         ],
      },
      options: {
         title: {
            display: true,
            text: "Street Usage",
         },
         legend: {
            display: true,
         },
      },
   });

   // Parse the input data
   const [numIntersections, numStreets, numSeconds, numCars, bonusPoints, ...streetsAndPaths] =
      input.split("\n").map((line) => line.trim());

   // Extract the street information
   const streets1 = streetsAndPaths.slice(0, numStreets);
   const paths1 = streetsAndPaths.slice(numStreets);

   // Count the number of times each intersection is used in a path
   const intersectionUsage = new Map();
   for (const path of paths1) {
      const [, ...intersections] = path.split(" ");
      for (const intersection of intersections) {
         if (intersectionUsage.has(intersection)) {
            intersectionUsage.set(intersection, intersectionUsage.get(intersection) + 1);
         } else {
            intersectionUsage.set(intersection, 1);
         }
      }
   }

   // Extract the intersection names and usage counts
   const intersectionNames = streets1.map((street) => street.split(" ")[1]);
   const intersectionUsages = intersectionNames.map((name) => intersectionUsage.get(name) || 0);

   // Create a radar chart
   const radarChart = new Chart(document.getElementById("radarChart"), {
      type: "radar",
      data: {
         labels: intersectionNames,
         datasets: [
            {
               label: "Intersection usage",
               data: intersectionUsages,
               backgroundColor: "rgba(255, 99, 132, 0.2)",
               borderColor: "rgb(255, 99, 132)",
               pointBackgroundColor: "rgb(255, 99, 132)",
               pointBorderColor: "#fff",
               pointHoverBackgroundColor: "#fff",
               pointHoverBorderColor: "rgb(255, 99, 132)",
            },
         ],
      },
      options: {
         scale: {
            ticks: {
               beginAtZero: true,
            },
         },
      },
   });

   // Count the number of streets that each intersection is connected to

   const intersectionConnections = new Map();
   for (const street of streets1) {
      const [, intersection] = street.split(" ");
      if (intersectionConnections.has(intersection)) {
         intersectionConnections.set(intersection, intersectionConnections.get(intersection) + 1);
      } else {
         intersectionConnections.set(intersection, 1);
      }
   }

   // Extract the intersection names and connection counts
   const intersectionConnectionCounts = intersectionNames.map(
      (name) => intersectionConnections.get(name) || 0
   );

   // Create a horizontal bar chart
   const barChart = new Chart(document.getElementById("barChart"), {
      type: "bar",
      data: {
         labels: intersectionNames,
         datasets: [
            {
               label: "Number of street connections",
               data: intersectionConnectionCounts,
               backgroundColor: "rgba(54, 162, 235, 0.2)",
               borderColor: "rgb(54, 162, 235)",
               borderWidth: 1,
            },
         ],
      },
      options: {
         scales: {
            xAxes: [
               {
                  ticks: {
                     beginAtZero: true,
                  },
               },
            ],
         },
      },
   });

   const blob = new Blob([output], { type: "text/plain" });
   const url = URL.createObjectURL(blob);
   const downloadLink = document.createElement("a");
   downloadLink.href = url;
   downloadLink.download = `Solution.txt`;
   document.body.appendChild(downloadLink);
   downloadLink.click();
   document.body.removeChild(downloadLink);
   document.getElementById("data").classList.remove("hidden");
   document.getElementById("running").classList.add("hidden");
   running = false;
}
