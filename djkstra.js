// grid-dijkstra.js
function createGraph(rows, cols) {
  let graph = {};

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      let node = `cell-${r}-${c}`;
      graph[node] = {};

      // Define possible neighbors (Up, Down, Left, Right)
      let neighbors = [
        [r - 1, c], // Up
        [r + 1, c], // Down
        [r, c - 1], // Left
        [r, c + 1], // Right
      ];

      // Add valid neighbors to the graph
      neighbors.forEach(([nr, nc]) => {
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
          let neighborNode = `cell-${nr}-${nc}`;
          graph[node][neighborNode] = 1; // Uniform weight
        }
      });
    }
  }
  return graph;
}

function dijkstra(graph, start) {
  const distances = {};
  const previous = {};
  const unvisited = new Set();

  // Initialization
  for (const node in graph) {
    distances[node] = Infinity;
    previous[node] = null;
    unvisited.add(node);
  }
  distances[start] = 0;

  while (unvisited.size > 0) {
    // Find node with smallest distance
    let current = Array.from(unvisited).reduce((minNode, node) => {
      return distances[node] < distances[minNode] ? node : minNode;
    }, Array.from(unvisited)[0]);

    unvisited.delete(current);

    // Update neighbors
    for (const neighbor in graph[current]) {
      const alt = distances[current] + graph[current][neighbor];
      if (alt < distances[neighbor]) {
        distances[neighbor] = alt;
        previous[neighbor] = current;
      }
    }
  }

  return { distances, previous };
}

// Grid management
let startNode = null;
let endNode = null;

function createGrid(rows, cols) {
  const gridElement = document.getElementById("grid");
  gridElement.style.gridTemplateColumns = `repeat(${cols}, 40px)`;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.id = `cell-${r}-${c}`;

      cell.addEventListener("click", function () {
        if (!startNode) {
          startNode = cell.id;
          cell.classList.add("start");
        } else if (!endNode && cell.id !== startNode) {
          endNode = cell.id;
          cell.classList.add("end");
          runDijkstra();
        }
      });

      gridElement.appendChild(cell);
    }
  }
}

function runDijkstra() {
  const graph = createGraph(10, 10);
  const result = dijkstra(graph, startNode);

  // Path reconstruction
  let path = [];
  let node = endNode;
  while (node && node !== startNode) {
    path.push(node);
    node = result.previous[node];
  }

  if (node !== startNode) {
    alert("No path exists!");
    return;
  }

  path.push(startNode);
  path.reverse();

  // Visualization
  path.forEach((nodeId, index) => {
    setTimeout(() => {
      const node = document.getElementById(nodeId);
      if (nodeId !== startNode && nodeId !== endNode) {
        node.classList.add("path");
      }
    }, index * 50);
  });
}

// Initialize grid when DOM loads
document.addEventListener("DOMContentLoaded", () => {
  createGrid(10, 10);
});
