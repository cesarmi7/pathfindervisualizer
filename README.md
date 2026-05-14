# 🧭 Pathfinding Visualizer

A clean and interactive pathfinding visualizer built with React. This project lets users draw walls, move the start and finish nodes, choose between different pathfinding algorithms, and watch how each algorithm explores the grid.

## 📌 Overview

This project is a visual tool for understanding how pathfinding algorithms work. The user can interact with a grid by placing walls, dragging the start and finish nodes, and selecting an algorithm from the dropdown menu.

Once the visualization starts, the app shows the order in which nodes are visited and then highlights the final path.

The project currently supports:

- 🔵 Dijkstra
- 🌊 Breadth-First Search
- 🌲 Depth-First Search
- ⭐ A* Search

## ✨ Features

- 🧱 Interactive grid for drawing walls
- 🟧 Movable start node
- 🟥 Movable finish node
- 🔽 Algorithm dropdown selector
- 🔵 Animated visited nodes
- 🟨 Animated final path
- 🧹 Clear Path button that resets the board and removes all walls
- 🎨 Simple and modern UI design
- 💻 Responsive layout with a clean visual style

## 🧠 Algorithms Included

### 🔵 Dijkstra

Dijkstra finds the shortest path by checking the closest available node first. Since this grid uses equal weights for every move, Dijkstra will find the shortest path.

### 🌊 Breadth-First Search

Breadth-First Search explores the grid level by level. In an unweighted grid like this one, BFS also finds the shortest path.

### 🌲 Depth-First Search

Depth-First Search explores as far as possible in one direction before backtracking. DFS is useful to visualize exploration, but it does not always find the shortest path.

### ⭐ A* Search

A* Search uses a heuristic to guide the search toward the finish node. This project uses Manhattan Distance, which works well for a grid that only allows movement up, down, left, and right.

## 🎮 How to Use

1. 🔽 Select an algorithm from the dropdown menu.
2. 🧱 Click and drag on the grid to create walls.
3. 🟧 Drag the orange start node or 🟥 red finish node to move them.
4. ▶️ Click the visualize button to run the selected algorithm.
5. 🧹 Click Clear Path to reset the board and remove all walls.

## 📁 Project Structure

```txt
src
├── algorithms
│   └── pathfindingAlgorithms.js
├── PathfindingVisualizer
│   ├── Node
│   │   ├── Node.jsx
│   │   └── Node.css
│   ├── PathfindingVisualizer.jsx
│   └── PathfindingVisualizer.css
├── App.js
├── App.css
└── index.js
