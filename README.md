# Pathfinding Visualizer

## Overview

This project is a visual demonstration of the Dijkstra algorithm, a pathfinding algorithm that finds the shortest path between two nodes in a graph. It's built using React and showcases interactive visualization of the algorithm in action. Users can visualize the algorithm's step-by-step process in finding the most optimal path.

## Features

- **Interactive Grid**: A grid where each cell represents a node in the graph. Users can interact with the grid by adding walls, which the algorithm will then navigate around.
- **Start and Finish Nodes**: Designated starting and ending points for the pathfinding.
- **Visualization Controls**: Buttons to start the visualization and reset the grid to its initial state.
- **Real-Time Algorithm Visualization**: Watch as the algorithm explores different paths and ultimately finds the shortest one.

## How It Works

The project consists of several key components:

- **PathfindingVisualizer**: The main React component that manages the state of the grid and handles user interactions.
- **Node**: Represents a single cell in the grid. It can be a start node, end node, a wall, or a regular node.
- **Dijkstra's Algorithm Implementation**: The core algorithm that finds the shortest path. It's implemented in `dijkstra.js`.

When the user clicks "Visualize Dijkstra's Algorithm", the algorithm starts from the start node and explores all possible paths until it reaches the finish node. The grid visually updates to show the progress of the algorithm, highlighting visited nodes and the final shortest path.

## How to Use

1. **Clone the Repository**: Clone this repo to your local machine.
2. **Install Dependencies**: Run `npm install` to install the required dependencies.
3. **Run the Project**: Execute `npm start` to run the app in development mode.
4. **Interact with the Grid**: Click on the grid to add walls, and use the provided button to start the visualization.

## Technologies Used

- **React**: For building the user interface.
- **CSS**: For styling the components.

## Contributing

Feel free to fork this project, make changes, and open a pull request with any improvements or additional features!
