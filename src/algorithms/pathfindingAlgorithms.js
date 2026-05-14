export const ALGORITHMS = {
  dijkstra: {
    label: 'Dijkstra',
    run: dijkstra,
    note: 'Guarantees the shortest path on this unweighted grid.',
  },
  bfs: {
    label: 'Breadth-First Search',
    run: bfs,
    note: 'Guarantees the shortest path on this unweighted grid.',
  },
  dfs: {
    label: 'Depth-First Search',
    run: dfs,
    note: 'Explores deeply first, but does not guarantee the shortest path.',
  },
  astar: {
    label: 'A* Search',
    run: astar,
    note: 'Uses a heuristic to search faster and still finds the shortest path here.',
  },
};

function dijkstra(grid, startNode, finishNode) {
  const visitedNodesInOrder = [];
  startNode.distance = 0;

  const unvisitedNodes = getAllNodes(grid);

  while (unvisitedNodes.length) {
    sortNodesByDistance(unvisitedNodes);
    const closestNode = unvisitedNodes.shift();

    if (closestNode.isWall) continue;
    if (closestNode.distance === Infinity) return visitedNodesInOrder;
    if (closestNode.isVisited) continue;

    closestNode.isVisited = true;
    visitedNodesInOrder.push(closestNode);

    if (closestNode === finishNode) return visitedNodesInOrder;

    const neighbors = getUnvisitedNeighbors(closestNode, grid);

    for (const neighbor of neighbors) {
      const newDistance = closestNode.distance + 1;

      if (newDistance < neighbor.distance) {
        neighbor.distance = newDistance;
        neighbor.previousNode = closestNode;
      }
    }
  }

  return visitedNodesInOrder;
}

function bfs(grid, startNode, finishNode) {
  const visitedNodesInOrder = [];
  const queue = [];

  startNode.isVisited = true;
  queue.push(startNode);

  while (queue.length) {
    const currentNode = queue.shift();

    if (currentNode.isWall) continue;

    visitedNodesInOrder.push(currentNode);

    if (currentNode === finishNode) return visitedNodesInOrder;

    const neighbors = getUnvisitedNeighbors(currentNode, grid);

    for (const neighbor of neighbors) {
      neighbor.isVisited = true;
      neighbor.previousNode = currentNode;
      queue.push(neighbor);
    }
  }

  return visitedNodesInOrder;
}

function dfs(grid, startNode, finishNode) {
  const visitedNodesInOrder = [];
  const stack = [];

  startNode.isVisited = true;
  stack.push(startNode);

  while (stack.length) {
    const currentNode = stack.pop();

    if (currentNode.isWall) continue;

    visitedNodesInOrder.push(currentNode);

    if (currentNode === finishNode) return visitedNodesInOrder;

    const neighbors = getUnvisitedNeighbors(currentNode, grid).reverse();

    for (const neighbor of neighbors) {
      neighbor.isVisited = true;
      neighbor.previousNode = currentNode;
      stack.push(neighbor);
    }
  }

  return visitedNodesInOrder;
}

function astar(grid, startNode, finishNode) {
  const visitedNodesInOrder = [];
  const openSet = [];

  startNode.distance = 0;
  startNode.totalDistance = manhattanDistance(startNode, finishNode);
  openSet.push(startNode);

  while (openSet.length) {
    sortNodesByTotalDistance(openSet);
    const currentNode = openSet.shift();

    if (currentNode.isWall) continue;
    if (currentNode.isVisited) continue;

    currentNode.isVisited = true;
    visitedNodesInOrder.push(currentNode);

    if (currentNode === finishNode) return visitedNodesInOrder;

    const neighbors = getNeighbors(currentNode, grid);

    for (const neighbor of neighbors) {
      if (neighbor.isWall) continue;

      const tentativeDistance = currentNode.distance + 1;

      if (tentativeDistance < neighbor.distance) {
        neighbor.distance = tentativeDistance;
        neighbor.totalDistance =
          tentativeDistance + manhattanDistance(neighbor, finishNode);
        neighbor.previousNode = currentNode;
        openSet.push(neighbor);
      }
    }
  }

  return visitedNodesInOrder;
}

function sortNodesByDistance(nodes) {
  nodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
}

function sortNodesByTotalDistance(nodes) {
  nodes.sort((nodeA, nodeB) => nodeA.totalDistance - nodeB.totalDistance);
}

function getUnvisitedNeighbors(node, grid) {
  return getNeighbors(node, grid).filter((neighbor) => !neighbor.isVisited);
}

function getNeighbors(node, grid) {
  const neighbors = [];
  const { col, row } = node;

  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);

  return neighbors;
}

function getAllNodes(grid) {
  const nodes = [];

  for (const row of grid) {
    for (const node of row) {
      nodes.push(node);
    }
  }

  return nodes;
}

function manhattanDistance(nodeA, nodeB) {
  return Math.abs(nodeA.row - nodeB.row) + Math.abs(nodeA.col - nodeB.col);
}

export function getNodesInShortestPathOrder(finishNode) {
  const nodesInShortestPathOrder = [];

  if (!finishNode.previousNode && !finishNode.isStart) {
    return nodesInShortestPathOrder;
  }

  let currentNode = finishNode;

  while (currentNode !== null) {
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }

  return nodesInShortestPathOrder;
}