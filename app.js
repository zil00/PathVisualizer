// Grid dimensions
const ROWS = 30;
const COLS = 50;
let startNode = null;
let endNode = null;

// Create graph structure
function createGraph() {
  let graph = {};
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const node = `cell-${r}-${c}`;
      graph[node] = {};

      // Add neighbors (up, down, left, right)
      const neighbors = [
        [r - 1, c], // up
        [r + 1, c], // down
        [r, c - 1], // left
        [r, c + 1], // right
      ];

      neighbors.forEach(([nr, nc]) => {
        if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) {
          const neighbor = `cell-${nr}-${nc}`;
          graph[node][neighbor] = 1;
        }
      });
    }
  }
  return graph;
}

// Dijkstra's algorithm implementation
function dijkstra(graph, start) {
  const distances = {};
  const previous = {};
  const unvisited = new Set();

  // Initialize
  for (const node in graph) {
    distances[node] = Infinity;
    previous[node] = null;
    unvisited.add(node);
  }
  distances[start] = 0;

  while (unvisited.size > 0) {
    // Find node with smallest distance
    let current = Array.from(unvisited).reduce(
      (minNode, node) =>
        distances[node] < distances[minNode] ? node : minNode,
      Array.from(unvisited)[0]
    );

    if (distances[current] === Infinity) break;

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

// Create grid UI
function createGrid() {
  const grid = document.getElementById("grid");
  grid.style.gridTemplateColumns = `repeat(${COLS}, 35px)`;

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.id = `cell-${r}-${c}`;

      cell.addEventListener("click", () => handleCellClick(cell));
      grid.appendChild(cell);
    }
  }
}

// Handle cell clicks
function handleCellClick(cell) {
  if (!startNode) {
    startNode = cell.id;
    cell.classList.add("start");
  } else if (!endNode && cell.id !== startNode) {
    endNode = cell.id;
    cell.classList.add("end");
    visualizePath();
  }
}

// Visualize the path
function visualizePath() {
  const graph = createGraph();
  const result = dijkstra(graph, startNode);

  // Reconstruct path
  const path = [];
  let current = endNode;

  while (current && current !== startNode) {
    path.push(current);
    current = result.previous[current];
  }

  if (current !== startNode) {
    alert("No path exists!");
    resetGrid();
    return;
  }

  path.push(startNode);
  path.reverse();

  // Animate path
  path.forEach((nodeId, index) => {
    setTimeout(() => {
      const node = document.getElementById(nodeId);
      if (nodeId !== startNode && nodeId !== endNode) {
        node.classList.add("path");
      }
    }, index * 50);
  });
}

// Reset grid
function resetGrid() {
  startNode = null;
  endNode = null;
  document.querySelectorAll(".cell").forEach((cell) => {
    cell.className = "cell";
  });
}

// Initialize when page loads
document.addEventListener("DOMContentLoaded", createGrid);
// Reset functionality
document.getElementById("resetBtn").addEventListener("click", resetGrid);
