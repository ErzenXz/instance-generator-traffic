function createGraph(fileInput, div) {

    // Splitting the file input into lines
    fileInput = String.raw`${fileInput}`;
    var lines = fileInput.replace(/\r\n/g, '\n').split('\n');

    // Creating a map to store streets and their connections
    var streetMap = new Map();

    // Parsing the lines to populate the street map
    lines.forEach(function (line) {
        var parts = line.split(' ');
        var fromNode = parseInt(parts[0]);
        var toNode = parseInt(parts[1]);
        var street = parts[2] + " (" + parts[3] + ")";

        if (!streetMap.has(street)) {
            streetMap.set(street, []);
        }

        streetMap.get(street).push([fromNode, toNode]);
    });

    // Creating an array to store nodes and edges
    var nodes = [];
    var edges = [];
    var colors = [
        '#FF0000', // Red
        '#00FF00', // Green
        '#0000FF', // Blue
        '#FFFF00', // Yellow
        '#FF00FF', // Magenta
        '#00FFFF', // Cyan
        '#000000', // Black
        '#FFA500', // Orange
        '#800080', // Purple
        '#00CED1', // Dark Turquoise
        '#6495ED', // Cornflower Blue
        '#00BFFF', // Deep Sky Blue
        '#4169E1', // Royal Blue
        '#1E90FF', // Dodger Blue
        '#87CEEB', // Sky Blue
        '#4169E1', // Light Blue
        '#F0F8FF', // Alice Blue
        '#FFC0CB', // Pink
        '#FFD700', // Gold
        '#32CD32', // Lime Green
        '#8A2BE2', // Blue Violet
        '#FF4500', // Orange Red
        '#A52A2A', // Brown
        '#808080', // Gray
        '#FF1493', // Deep Pink
    ];


    // Iterating over the street map to create nodes and edges
    streetMap.forEach(function (connections, street) {
        let color = colors[Math.floor(Math.random() * colors.length)];
        edges.push(
            ...connections.map(function (connection) {
                return {
                    from: connection[0],
                    to: connection[1],
                    label: street,
                    arrows: 'to',
                    color: {
                        color: color,
                        hover: '#848484'
                    }
                };
            })
        );

        // Extract unique nodes from connections
        var uniqueNodes = [...new Set(connections.flat())];

        // Creating node objects
        uniqueNodes.forEach(function (nodeId) {
            // Check if the node with the same ID already exists
            var existingNode = nodes.find(function (node) {
                return node.id === nodeId;
            });

            if (!existingNode) {
                nodes.push({
                    id: nodeId,
                    label: 'Intersection ' + nodeId,
                    title: 'Intersection ' + nodeId,
                    color: {
                        background: '#2D5277',
                        border: '#D4E6F1',
                        hover: {
                            background: '#2177A2',
                            border: '#D4E6F1'
                        },
                        highlight: {
                            background: '#2177A2',
                            border: '#D4E6F1'
                        }
                    },
                    font: {
                        color: '#FFFFFF',
                        size: 16,
                        face: 'Roboto'
                    },
                    shape: 'circle',
                    size: 30
                });
            }
        });
    });

    // Creating a data object with nodes and edges
    var data = {
        nodes: nodes,
        edges: edges
    };

    const options = {
        layout: {
            improvedLayout: false, // Disable automatic layout optimization
        },
        physics: {
            enabled: true,
            solver: 'forceAtlas2Based',
            forceAtlas2Based: {
                gravitationalConstant: -300, // Increase the gravitational constant to spread nodes apart
                centralGravity: 0.005, // Decrease the central gravity to avoid collisions
                springLength: 200, // Adjust the spring length to space out the nodes
                springConstant: 0.02, // Adjust the spring constant to control the layout tension
            },
            minVelocity: 0.75, // Increase the minimum velocity to avoid slow convergence
        },
        edges: {
            smooth: {
                type: 'cubicBezier',
                forceDirection: 'horizontal',
            },
            color: {
                color: '#848484',
                highlight: '#848484'
            },
            font: {
                color: '#343434',
                size: 12,
                align: 'middle'
            },
            arrows: {
                to: { enabled: true, scaleFactor: 1 },
                from: { enabled: true, scaleFactor: 1 }
            },
        },
        nodes: {
            shape: 'dot',
            size: 7,
            font: {
                size: 14,
                color: '#ffffff'
            },
            color: {
                border: '#2B7CE9',
                background: '#97C2FC'
            },
            borderWidth: 3
        },
        groups: {
            intersections: {
                shape: 'dot',
                size: 10, // Decreased the intersection node size
                color: {
                    border: '#2B7CE9',
                    background: '#D2E5FF'
                }
            },
            streets: {
                shape: 'line',
                color: {
                    color: '#848484',
                    highlight: '#848484'
                },
                font: {
                    color: '#343434',
                    size: 12,
                    align: 'middle'
                },
                width: 2
            }
        },

        interaction: {
            hover: true,
            tooltipDelay: 200
        }
    };


    // Creating the network graph
    var container = document.getElementById(div);
    var network = new vis.Network(container, data, options);
}

function createGraph2(data, div) {

    const lines = data.split('\n');
    const nodes = new Set();
    const edges = [];

    // Extract nodes and edges from data
    lines.forEach((line, index) => {
        const parts = line.split(' ');
        const car = `Car ${index + 1}`;

        parts.shift(); // Remove the first element

        // Add nodes (streets) to the set
        parts.forEach((street) => nodes.add(street));

        // Create edges between consecutive streets
        for (let i = 1; i < parts.length; i++) {
            edges.push({ from: parts[i - 1], to: parts[i], label: car });
        }

        // Handle the number of streets the car will go
        if (parts.length > 1) {
            edges.push({ from: parts[parts.length - 1], to: parts[0], label: car });
        }
    });

    // Create an array of node objects
    const visNodes = Array.from(nodes).map((street) => {
        return { id: street, label: street };
    });

    // Define the graph data
    const graphData = {
        nodes: new vis.DataSet(visNodes),
        edges: new vis.DataSet(edges),
    };

    // Create a network instance
    const container = document.getElementById('network2');
    // Define the graph options

    const options = {
        layout: {
            improvedLayout: false, // Disable automatic layout optimization
        },
        physics: {
            enabled: true,
            solver: 'forceAtlas2Based',
            forceAtlas2Based: {
                gravitationalConstant: -300, // Increase the gravitational constant to spread nodes apart
                centralGravity: 0.005, // Decrease the central gravity to avoid collisions
                springLength: 200, // Adjust the spring length to space out the nodes
                springConstant: 0.02, // Adjust the spring constant to control the layout tension
            },
            minVelocity: 0.75, // Increase the minimum velocity to avoid slow convergence
        },
        edges: {
            smooth: {
                type: 'cubicBezier',
                forceDirection: 'horizontal',
            },
            color: {
                color: '#848484',
                highlight: '#848484'
            },
            font: {
                color: '#343434',
                size: 12,
                align: 'middle'
            },
            arrows: {
                to: { enabled: true, scaleFactor: 1 },
                from: { enabled: true, scaleFactor: 1 }
            },
        },
        groups: {
            intersections: {
                shape: 'dot',
                size: 10, // Decreased the intersection node size
                color: {
                    border: '#2B7CE9',
                    background: '#D2E5FF'
                }
            },
            streets: {
                shape: 'line',
                color: {
                    color: '#848484',
                    highlight: '#848484'
                },
                font: {
                    color: '#343434',
                    size: 12,
                    align: 'middle'
                },
                width: 2
            }
        },

        interaction: {
            hover: true,
            tooltipDelay: 200
        }
    };
    const network = new vis.Network(container, graphData, options);
    document.getElementById(div).classList.remove("hidden");
}


// function generateCombinedGraph(data1, data2) {
//     var cy = cytoscape({
//         container: document.getElementById('cy'),
//         layout: {
//             name: 'preset'
//         },
//         style: [
//             {
//                 selector: 'node',
//                 style: {
//                     'label': 'data(id)',
//                     'width': 40,
//                     'height': 40,
//                     'background-color': '#fff',
//                     'border-color': '#000',
//                     'border-width': 2,
//                     'border-opacity': 1,
//                     'text-valign': 'center',
//                     'text-halign': 'center',
//                     'font-size': '12px',
//                     'font-weight': 'bold'
//                 }
//             },
//             {
//                 selector: 'edge',
//                 style: {
//                     'width': 2,
//                     'curve-style': 'bezier',
//                     'line-color': '#ccc',
//                     'target-arrow-color': '#ccc',
//                     'target-arrow-shape': 'triangle',
//                     'label': 'data(label)', // Label for streets
//                     'text-background-color': '#fff',
//                     'text-background-opacity': 0.8,
//                     'text-background-padding': 2,
//                     'color': '#333',
//                     'font-size': 10,
//                     'text-wrap': 'wrap'
//                 }
//             }
//         ]
//     });

//     var lines = data1.split('\n');
//     var nodes = {};
//     var edgeCounter = 1;

//     for (var i = 0; i < lines.length; i++) {
//         var parts = lines[i].split(' ');
//         var source = parts[0];
//         var target = parts[1];
//         var street = parts[2];
//         var duration = parts[3];

//         console.log('Source:', source);
//         console.log('Target:', target);

//         if (source && target) {
//             if (!nodes[source]) {
//                 nodes[source] = true;
//                 cy.add({ data: { id: source }, position: { x: Math.random() * 5000, y: Math.random() * 5000 } });
//             }

//             if (!nodes[target]) {
//                 nodes[target] = true;
//                 cy.add({ data: { id: target }, position: { x: Math.random() * 5000, y: Math.random() * 5000 } });
//             }

//             var edgeId = `edge${edgeCounter}`;
//             var formattedStreet = street.replace(/[^a-zA-Z0-9]/g, '-') + `-(${duration})`;
//             cy.add({ data: { id: edgeId, source: source, target: target, label: street } });
//             edgeCounter++;
//         } else {
//             console.log('Skipping line due to missing source or target:', lines[i]);
//         }
//     }



//     var lines2 = data2.split('\n');
//     var nodes2 = {};
//     var colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#00ffff', '#ff00ff', '#ffa500', '#800080', '#008080']; // Color options for cars
//     var carCount = 0;

//     for (var i = 0; i < lines2.length; i++) {
//         var carData = lines2[i].split(' ');
//         var numStreets = parseInt(carData[0]);
//         var streets = carData.slice(1);

//         var carId = 'car' + i; // Generate a unique car ID
//         var carText = 'Car ' + (i + 1); // Car text for the label
//         // Set color for the car
//         var color = colors[carCount % colors.length];

//         for (var j = 0; j < numStreets - 1; j++) {
//             var source = 'street_' + streets[j] + '_' + carId; // Add car ID to ensure unique node ID
//             var target = 'street_' + streets[j + 1] + '_' + carId; // Add car ID to ensure unique node ID
//             var street = 'street' + j;

//             if (!nodes2[source]) {
//                 nodes2[source] = true;
//                 cy.add({ data: { id: source }, position: { x: Math.random() * 1000, y: Math.random() * 1000 } });
//             }

//             if (!nodes2[target]) {
//                 nodes2[target] = true;
//                 cy.add({ data: { id: target }, position: { x: Math.random() * 1000, y: Math.random() * 1000 } });
//             }

//             cy.add({ data: { id: source + '-' + target, source: source, target: target, label: street, carText: carText } }); // Assign carText to the label
//         }

//         cy.nodes().forEach(function (node) {
//             if (node.id().endsWith('_' + carId)) {
//                 node.style('background-color', color);
//             }
//         });

//         carCount++;
//     }

//     // Apply the "cose" layout to the graph
//     cy.layout({
//         name: 'cose',
//         idealEdgeLength: 100, // Adjust this value to control the spacing between nodes
//         randomize: false, // Set to true if you want a different layout each time
//         animate: false, // Set to true to animate the layout
//     }).run();

//     // Fit the graph to the viewport
//     cy.fit();

//     // Customize the style of the nodes
//     cy.style()
//         .selector('node')
//         .css({
//             'width': 20, // Adjust the size of the nodes to resemble intersections
//             'height': 20,
//             'background-color': 'gray', // Customize the color of the intersections
//             'label': 'data(id)', // Display the ID of the intersections as labels
//             'font-size': 12,
//             'text-valign': 'center',
//             'text-halign': 'center'
//         })
//         .selector('.car-route') // Select elements with the 'car-route' class
//         .css({
//             'line-color': 'blue', // Customize the color of the car routes
//             'target-arrow-color': 'blue', // Customize the color of the arrowheads
//             'target-arrow-shape': 'triangle'
//         })
//         .update();

//     // Add the 'car-route' class to the elements representing car routes
//     cy.elements('.car-route').addClass('car-route');

//     // Remove the 'car-route' class from other elements (streets and intersections)
//     cy.elements().not('.car-route').removeClass('car-route');
// }


function generateGraph(data) {
    var cy = cytoscape({
        container: document.getElementById('cy1'),
        style: [
            {
                selector: 'node',
                style: {
                    'background-color': '#666',
                    'label': 'data(id)',
                    'text-valign': 'center',
                    'text-halign': 'center',
                    'color': 'black',
                    'width': '30px',
                    'height': '30px'
                }
            },
            {
                selector: 'edge',
                style: {
                    'width': 2,
                    'line-color': 'rgb(42, 40, 40)',
                    'target-arrow-color': 'rgb(42, 40, 40)',
                    'target-arrow-shape': 'triangle',
                    'content': 'data(label)',
                    'font-size': '12px',
                    'text-wrap': 'wrap',
                    'text-valign': 'center',
                    'text-halign': 'center',
                    'text-background-color': '#fff',
                    'text-background-opacity': 0.7,
                    'text-background-padding': '2px',
                    'curve-style': 'bezier'
                }
            }
        ],
        layout: {
            name: 'cola', // Use the cola layout algorithm
            animate: true, // Enable animation during layout
            refresh: 1, // Refresh rate of the layout animation
            fit: true, // Fit the graph to the container
            padding: 30, // Padding around the graph
            edgeLength: 1500, // Ideal edge length
            edgeSymDiffLength: 10, // Edge length difference for symmetric differences
            nodeSpacing: 170, // Minimum spacing between nodes
            randomize: false, // Disable randomization of node positions
            maxSimulationTime: 7777 // Maximum duration of the layout simulation
        }
    });

    var lines = data.split('\n');
    var nodes = {};
    var edgeCounter = 1;

    for (var i = 0; i < lines.length; i++) {
        var parts = lines[i].split(' ');
        var source = parts[0];
        var target = parts[1];
        var street = parts[2];
        var duration = parts[3];


        if (source && target) {
            if (!nodes[source]) {
                nodes[source] = true;
                cy.add({ data: { id: source }, position: { x: Math.random() * 5000, y: Math.random() * 5000 } });
            }

            if (!nodes[target]) {
                nodes[target] = true;
                cy.add({ data: { id: target }, position: { x: Math.random() * 5000, y: Math.random() * 5000 } });
            }

            var edgeId = `edge${edgeCounter}`;
            var formattedStreet = street.replace(/[^a-zA-Z0-9]/g, '-') + `-(${duration})`;
            cy.add({ data: { id: edgeId, source: source, target: target, label: street } });
            edgeCounter++;
        } else {
            console.log('Skipping line due to missing source or target:', lines[i]);
        }
    }
    cy.layout({
        name: 'cola', // Use the cola layout algorithm
        animate: true, // Enable animation during layout
        refresh: 1, // Refresh rate of the layout animation
        fit: true, // Fit the graph to the container
        padding: 30, // Padding around the graph
        edgeLength: 1000, // Ideal edge length
        edgeSymDiffLength: 10, // Edge length difference for symmetric differences
        nodeSpacing: 170, // Minimum spacing between nodes
        randomize: false, // Disable randomization of node positions
        maxSimulationTime: 7777 // Maximum duration of the layout simulation
    }).run();
}



function generateGraph2(data) {
    var cy = cytoscape({
        container: document.getElementById('cy2'),
        style: [
            {
                selector: 'node',
                style: {
                    'background-color': '#666',
                    'label': 'data(id)',
                    'text-valign': 'center',
                    'text-halign': 'center',
                    'color': 'black',
                    'width': '30px',
                    'height': '30px'
                }
            },
            {
                selector: 'edge',
                style: {
                    'width': 2,
                    'line-color': 'rgb(42, 40, 40)',
                    'target-arrow-color': 'rgb(42, 40, 40)',
                    'target-arrow-shape': 'triangle',
                    'content': 'data(label)',
                    'font-size': '12px',
                    'text-wrap': 'wrap',
                    'text-valign': 'center',
                    'text-halign': 'center',
                    'text-background-color': '#fff',
                    'text-background-opacity': 0.7,
                    'text-background-padding': '2px',
                    'curve-style': 'bezier'
                }
            }
        ],
        layout: {
            name: 'cola', // Use the cola layout algorithm
            animate: true, // Enable animation during layout
            refresh: 1, // Refresh rate of the layout animation
            fit: true, // Fit the graph to the container
            padding: 30, // Padding around the graph
            edgeLength: 500, // Ideal edge length
            edgeSymDiffLength: 10, // Edge length difference for symmetric differences
            nodeSpacing: 170, // Minimum spacing between nodes
            randomize: false, // Disable randomization of node positions
            maxSimulationTime: 10000 // Maximum duration of the layout simulation
        }
    });

    var lines = data.split('\n');
    var nodes = {};
    var colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#00ffff', '#ff00ff', '#ffa500', '#800080', '#008080']; // Color options for cars
    var carCount = 0;

    for (var i = 0; i < lines.length; i++) {
        var carData = lines[i].split(' ');
        var numStreets = parseInt(carData[0]);
        var streets = carData.slice(1);

        var carId = 'car' + i; // Generate a unique car ID
        var carText = 'Car ' + (i + 1); // Car text for the label

        // Set color for the car
        var color = colors[carCount % colors.length];

        for (var j = 0; j < numStreets - 1; j++) {
            var source = 'street_' + streets[j] + '_' + carId; // Add car ID to ensure unique node ID
            var target = 'street_' + streets[j + 1] + '_' + carId; // Add car ID to ensure unique node ID
            var street = 'street' + j;

            if (!nodes[source]) {
                nodes[source] = true;
                cy.add({ data: { id: source }, position: { x: Math.random() * 1000, y: Math.random() * 1000 } });
            }

            if (!nodes[target]) {
                nodes[target] = true;
                cy.add({ data: { id: target }, position: { x: Math.random() * 1000, y: Math.random() * 1000 } });
            }

            cy.add({ data: { id: source + '-' + target, source: source, target: target, label: street, carText: carText } }); // Assign carText to the label
        }

        cy.nodes().forEach(function (node) {
            if (node.id().endsWith('_' + carId)) {
                node.style('background-color', color);
            }
        });

        carCount++;
    }

    // Apply the "cose" layout to the graph
    cy.layout({
        name: 'cola', // Use the cola layout algorithm
        animate: true, // Enable animation during layout
        refresh: 1, // Refresh rate of the layout animation
        fit: true, // Fit the graph to the container
        padding: 30, // Padding around the graph
        edgeLength: 1500, // Ideal edge length
        edgeSymDiffLength: 10, // Edge length difference for symmetric differences
        nodeSpacing: 170, // Minimum spacing between nodes
        randomize: false, // Disable randomization of node positions
        maxSimulationTime: 10000 // Maximum duration of the layout simulation
    }).run();
}

