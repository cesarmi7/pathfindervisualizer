import React, { Component } from 'react';
import Node from './Node/Node';
import {
  ALGORITHMS,
  getNodesInShortestPathOrder,
} from '../algorithms/pathfindingAlgorithms';

import './PathfindingVisualizer.css';

const DEFAULT_START_NODE_ROW = 10;
const DEFAULT_START_NODE_COL = 15;
const DEFAULT_FINISH_NODE_ROW = 10;
const DEFAULT_FINISH_NODE_COL = 35;

export default class PathfindingVisualizer extends Component {
  constructor() {
    super();

    this.state = {
      grid: [],
      mouseIsPressed: false,
      movingNodeType: null,
      startNodeRow: DEFAULT_START_NODE_ROW,
      startNodeCol: DEFAULT_START_NODE_COL,
      finishNodeRow: DEFAULT_FINISH_NODE_ROW,
      finishNodeCol: DEFAULT_FINISH_NODE_COL,
      selectedAlgorithm: 'dijkstra',
      isAnimating: false,
      statusMessage: '',
    };

    this.timeouts = [];
  }

  componentDidMount() {
    const grid = getInitialGrid(
      DEFAULT_START_NODE_ROW,
      DEFAULT_START_NODE_COL,
      DEFAULT_FINISH_NODE_ROW,
      DEFAULT_FINISH_NODE_COL
    );

    this.setState({ grid });
  }

  componentWillUnmount() {
    this.clearAllTimeouts();
  }

  clearAllTimeouts() {
    for (const timeout of this.timeouts) {
      clearTimeout(timeout);
    }

    this.timeouts = [];
  }

  handleMouseDown(row, col) {
    if (this.state.isAnimating) return;

    this.clearAllTimeouts();

    const {
      grid,
      startNodeRow,
      startNodeCol,
      finishNodeRow,
      finishNodeCol,
    } = this.state;

    const cleanGrid = getCleanGrid(
      grid,
      startNodeRow,
      startNodeCol,
      finishNodeRow,
      finishNodeCol
    );

    const node = cleanGrid[row][col];

    if (node.isStart) {
      this.setState({
        grid: cleanGrid,
        mouseIsPressed: true,
        movingNodeType: 'start',
        statusMessage: '',
      });
      return;
    }

    if (node.isFinish) {
      this.setState({
        grid: cleanGrid,
        mouseIsPressed: true,
        movingNodeType: 'finish',
        statusMessage: '',
      });
      return;
    }

    const newGrid = getNewGridWithWallToggled(cleanGrid, row, col);

    this.setState({
      grid: newGrid,
      mouseIsPressed: true,
      movingNodeType: 'wall',
      statusMessage: '',
    });
  }

  handleMouseEnter(row, col) {
    const { mouseIsPressed, movingNodeType, isAnimating } = this.state;

    if (!mouseIsPressed || isAnimating) return;

    const { grid } = this.state;

    if (movingNodeType === 'start') {
      const newGrid = getGridWithMovedSpecialNode(grid, 'start', row, col);

      if (newGrid === grid) return;

      this.setState({
        grid: newGrid,
        startNodeRow: row,
        startNodeCol: col,
        statusMessage: '',
      });

      return;
    }

    if (movingNodeType === 'finish') {
      const newGrid = getGridWithMovedSpecialNode(grid, 'finish', row, col);

      if (newGrid === grid) return;

      this.setState({
        grid: newGrid,
        finishNodeRow: row,
        finishNodeCol: col,
        statusMessage: '',
      });

      return;
    }

    if (movingNodeType === 'wall') {
      const newGrid = getNewGridWithWallAdded(grid, row, col);
      this.setState({ grid: newGrid });
    }
  }

  handleMouseUp() {
    this.setState({
      mouseIsPressed: false,
      movingNodeType: null,
    });
  }

  clearPath(callback) {
    this.clearAllTimeouts();

    const {
      grid,
      startNodeRow,
      startNodeCol,
      finishNodeRow,
      finishNodeCol,
    } = this.state;

    const cleanGrid = getCleanGrid(
      grid,
      startNodeRow,
      startNodeCol,
      finishNodeRow,
      finishNodeCol
    );

    this.setState(
      {
        grid: cleanGrid,
        isAnimating: false,
        statusMessage: '',
      },
      callback
    );
  }

  resetGrid() {
    this.clearAllTimeouts();

    const grid = getInitialGrid(
      DEFAULT_START_NODE_ROW,
      DEFAULT_START_NODE_COL,
      DEFAULT_FINISH_NODE_ROW,
      DEFAULT_FINISH_NODE_COL
    );

    this.setState({
      grid,
      mouseIsPressed: false,
      movingNodeType: null,
      startNodeRow: DEFAULT_START_NODE_ROW,
      startNodeCol: DEFAULT_START_NODE_COL,
      finishNodeRow: DEFAULT_FINISH_NODE_ROW,
      finishNodeCol: DEFAULT_FINISH_NODE_COL,
      selectedAlgorithm: 'dijkstra',
      isAnimating: false,
      statusMessage: '',
    });
  }

  markNode(row, col, updates) {
    this.setState((prevState) => {
      const newGrid = prevState.grid.map((gridRow) => gridRow.slice());
      const node = newGrid[row][col];

      newGrid[row][col] = {
        ...node,
        ...updates,
      };

      return { grid: newGrid };
    });
  }

  animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        const timeout = setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);

        this.timeouts.push(timeout);
        return;
      }

      const timeout = setTimeout(() => {
        const node = visitedNodesInOrder[i];

        if (node.isStart || node.isFinish) return;

        this.markNode(node.row, node.col, {
          isVisitedClass: true,
        });
      }, 10 * i);

      this.timeouts.push(timeout);
    }
  }

  animateShortestPath(nodesInShortestPathOrder) {
    if (!nodesInShortestPathOrder.length) {
      this.setState({
        isAnimating: false,
        statusMessage: 'No path found. Try removing some walls.',
      });
      return;
    }

    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      const timeout = setTimeout(() => {
        const node = nodesInShortestPathOrder[i];

        if (!node.isStart && !node.isFinish) {
          this.markNode(node.row, node.col, {
            isShortestPath: true,
          });
        }

        if (i === nodesInShortestPathOrder.length - 1) {
          const { selectedAlgorithm } = this.state;
          const algorithm = ALGORITHMS[selectedAlgorithm];

          this.setState({
            isAnimating: false,
            statusMessage: algorithm.note,
          });
        }
      }, 40 * i);

      this.timeouts.push(timeout);
    }
  }

  visualizeAlgorithm() {
    if (this.state.isAnimating) return;

    this.clearPath(() => {
      const {
        grid,
        startNodeRow,
        startNodeCol,
        finishNodeRow,
        finishNodeCol,
        selectedAlgorithm,
      } = this.state;

      const startNode = grid[startNodeRow][startNodeCol];
      const finishNode = grid[finishNodeRow][finishNodeCol];

      const algorithm = ALGORITHMS[selectedAlgorithm];
      const visitedNodesInOrder = algorithm.run(grid, startNode, finishNode);
      const nodesInShortestPathOrder =
        getNodesInShortestPathOrder(finishNode);

      this.setState({ isAnimating: true }, () => {
        this.animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder);
      });
    });
  }

  render() {
    const {
      grid,
      mouseIsPressed,
      isAnimating,
      selectedAlgorithm,
      statusMessage,
    } = this.state;

    const algorithm = ALGORITHMS[selectedAlgorithm];

    return (
      <main className="visualizerPage">
        <section className="heroPanel">
          <p className="eyebrow">Pathfinding Visualizer</p>
          <h1>{algorithm.label}</h1>
          <p>
            Draw walls, drag the start or finish node, choose an algorithm,
            then visualize how the path is found.
          </p>

          <div className="controls">
            <select
              className="algorithmSelect"
              value={selectedAlgorithm}
              disabled={isAnimating}
              onChange={(event) =>
                this.setState({
                  selectedAlgorithm: event.target.value,
                  statusMessage: '',
                })
              }
            >
              {Object.entries(ALGORITHMS).map(([key, value]) => (
                <option key={key} value={key}>
                  {value.label}
                </option>
              ))}
            </select>

            <button
              className="primaryBtn"
              onClick={() => this.visualizeAlgorithm()}
              disabled={isAnimating}
            >
              {isAnimating ? 'Visualizing...' : `Visualize ${algorithm.label}`}
            </button>

            <button
              className="secondaryBtn"
              onClick={() => this.clearPath()}
            >
              Clear Path
            </button>

            <button
              className="secondaryBtn"
              onClick={() => this.resetGrid()}
            >
              Reset Board
            </button>
          </div>

          {statusMessage && (
            <p className="statusMessage">{statusMessage}</p>
          )}
        </section>

        <section className="boardPanel">
          <div className="legend">
            <span className="legendItem">
              <span className="legendBox legendStart"></span>
              Start
            </span>

            <span className="legendItem">
              <span className="legendBox legendFinish"></span>
              Finish
            </span>

            <span className="legendItem">
              <span className="legendBox legendWall"></span>
              Wall
            </span>

            <span className="legendItem">
              <span className="legendBox legendVisited"></span>
              Visited
            </span>

            <span className="legendItem">
              <span className="legendBox legendPath"></span>
              Path
            </span>
          </div>

          <div className="grid">
            {grid.map((row, rowIdx) => {
              return (
                <div className="gridRow" key={rowIdx}>
                  {row.map((node) => {
                    const {
                      row,
                      col,
                      isFinish,
                      isStart,
                      isWall,
                      isVisitedClass,
                      isShortestPath,
                    } = node;

                    return (
                      <Node
                        key={`${row}-${col}`}
                        col={col}
                        isFinish={isFinish}
                        isStart={isStart}
                        isWall={isWall}
                        isVisited={isVisitedClass}
                        isShortestPath={isShortestPath}
                        mouseIsPressed={mouseIsPressed}
                        onMouseDown={(row, col) =>
                          this.handleMouseDown(row, col)
                        }
                        onMouseEnter={(row, col) =>
                          this.handleMouseEnter(row, col)
                        }
                        onMouseUp={() => this.handleMouseUp()}
                        row={row}
                      ></Node>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </section>
      </main>
    );
  }
}

const getInitialGrid = (startRow, startCol, finishRow, finishCol) => {
  const grid = [];

  for (let row = 0; row < 20; row++) {
    const currentRow = [];

    for (let col = 0; col < 50; col++) {
      currentRow.push(
        createNode(col, row, startRow, startCol, finishRow, finishCol)
      );
    }

    grid.push(currentRow);
  }

  return grid;
};

const createNode = (col, row, startRow, startCol, finishRow, finishCol) => {
  return {
    col,
    row,
    isStart: row === startRow && col === startCol,
    isFinish: row === finishRow && col === finishCol,
    distance: Infinity,
    totalDistance: Infinity,
    isVisited: false,
    isVisitedClass: false,
    isShortestPath: false,
    isWall: false,
    previousNode: null,
  };
};

const getCleanGrid = (grid, startRow, startCol, finishRow, finishCol) => {
  return grid.map((row) =>
    row.map((node) => {
      const isStart = node.row === startRow && node.col === startCol;
      const isFinish = node.row === finishRow && node.col === finishCol;

      return {
        ...node,
        isStart,
        isFinish,
        isWall: node.isWall && !isStart && !isFinish,
        distance: Infinity,
        totalDistance: Infinity,
        isVisited: false,
        isVisitedClass: false,
        isShortestPath: false,
        previousNode: null,
      };
    })
  );
};

const getNewGridWithWallToggled = (grid, row, col) => {
  const newGrid = grid.map((gridRow) => gridRow.slice());
  const node = newGrid[row][col];

  if (node.isStart || node.isFinish) {
    return newGrid;
  }

  newGrid[row][col] = {
    ...node,
    isWall: !node.isWall,
  };

  return newGrid;
};

const getNewGridWithWallAdded = (grid, row, col) => {
  const newGrid = grid.map((gridRow) => gridRow.slice());
  const node = newGrid[row][col];

  if (node.isStart || node.isFinish || node.isWall) {
    return newGrid;
  }

  newGrid[row][col] = {
    ...node,
    isWall: true,
  };

  return newGrid;
};

const getGridWithMovedSpecialNode = (grid, nodeType, newRow, newCol) => {
  const targetNode = grid[newRow][newCol];

  if (nodeType === 'start' && (targetNode.isFinish || targetNode.isWall)) {
    return grid;
  }

  if (nodeType === 'finish' && (targetNode.isStart || targetNode.isWall)) {
    return grid;
  }

  const newGrid = grid.map((row) =>
    row.map((node) => {
      return {
        ...node,
        isStart: nodeType === 'start' ? false : node.isStart,
        isFinish: nodeType === 'finish' ? false : node.isFinish,
        distance: Infinity,
        totalDistance: Infinity,
        isVisited: false,
        isVisitedClass: false,
        isShortestPath: false,
        previousNode: null,
      };
    })
  );

  const movedNode = {
    ...newGrid[newRow][newCol],
    isStart: nodeType === 'start',
    isFinish: nodeType === 'finish',
    isWall: false,
  };

  newGrid[newRow][newCol] = movedNode;

  return newGrid;
};