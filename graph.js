function createGraph(fileInput, div) {

    // Splitting the file input into lines
    var lines = fileInput.split('\n');

    // Creating a map to store streets and their connections
    var streetMap = new Map();

    // Parsing the lines to populate the street map
    lines.forEach(function (line) {
        var parts = line.split(' ');

        var fromNode = parseInt(parts[0]);
        var toNode = parseInt(parts[1]);
        var street = parts[2];

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
        '#ADD8E6', // Light Blue
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

    var options = {
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
        edges: {
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
            smooth: {
                enabled: true,
                type: 'continuous',
                roundness: 0.3
            },
            length: 750 // Increased the edge length
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
        physics: {
            enabled: true,
            barnesHut: {
                gravitationalConstant: -2000,
                centralGravity: 0.3,
                springLength: 300, // Increased the spring length
                springConstant: 0.05,
                damping: 0.09
            },
            maxVelocity: 50,
            solver: 'barnesHut',
            stabilization: {
                iterations: 2500
            }
        },
        interaction: {
            hover: true,
            tooltipDelay: 200
        }
    };

    // Creating the network graph
    var container = document.getElementById("network");
    var network = new vis.Network(container, data, options);
}