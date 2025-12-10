import { createSlice, type PayloadAction } from "@reduxjs/toolkit";


export type Direction = "up" | "down" | null;
export type Status = "idle" | "moving" | "stop";

interface ElevatorState {
  currentFloor: number;
  direction: Direction;
  queue: number[];
  moving: boolean;
  status: Status;
  stopTimer: number | null;
}

const initialState: ElevatorState = {
  currentFloor: 0,
  direction: null,
  queue: [],
  moving: false,
  status: "idle",
  stopTimer: null,
};

const FLOORS = [0, 1, 2, 3, 4, 5];

const elevatorSlice = createSlice({
  name: "elevator",
  initialState,
  reducers: {
    addRequest(state, action: PayloadAction<number>) {
      const floor = action.payload;

      if (state.queue.includes(floor) || floor === state.currentFloor) return;

      state.queue.push(floor);

      if (!state.direction) {
        state.direction = floor > state.currentFloor ? "up" : "down";
      }

      state.queue = reorderQueue(
        state.queue,
        state.currentFloor,
        state.direction
      );
    },

    step(state) {
      // countdown
      if (state.status === "stop") {
        if (state.stopTimer && state.stopTimer > 0) {
          state.stopTimer -= 1;
          return;
        }

        // Stop finished - recalculate direction based on remaining queue
        state.status = "moving";
        state.stopTimer = null;
        
        if (state.queue.length === 0) {
          state.direction = null;
          state.moving = false;
          state.status = "idle";
          return;
        }

        // Recalculate direction after stop
        const next = state.queue[0];
        state.direction = next > state.currentFloor ? "up" : "down";
      }

      if (!state.direction || state.queue.length === 0) {
        state.moving = false;
        state.direction = null;
        state.status = "idle";
        return;
      }

      state.moving = true;
      state.status = "moving";

      // Check if we should continue in current direction
      const hasFloorsInCurrentDirection = 
        state.direction === "up" 
          ? state.queue.some(f => f > state.currentFloor)
          : state.queue.some(f => f < state.currentFloor);

      // If no floors in current direction, reverse immediately
      if (!hasFloorsInCurrentDirection) {
        state.direction = state.direction === "up" ? "down" : "up";
      }

      // Move in the current direction
      if (state.direction === "up") {
        if (state.currentFloor < 5) {
          state.currentFloor += 1;
        }
      } else if (state.direction === "down") {
        if (state.currentFloor > 0) {
          state.currentFloor -= 1;
        }
      }

      // If this is a stop floor
      if (state.queue.includes(state.currentFloor)) {
        state.queue = state.queue.filter((f) => f !== state.currentFloor);

        state.status = "stop";
        state.stopTimer = 1; // 1 second
        state.moving = false;

      
        return;
      }

      // If queue is empty after moving
      if (state.queue.length === 0) {
        state.direction = null;
        state.moving = false;
        state.status = "idle";
        return;
      }
    },
  },
});

// Helper for ordering queue
function reorderQueue(
  queue: number[],
  currentFloor: number,
  direction: Direction
) {
  if (direction === "up") {
    return [
      ...queue.filter((f) => f > currentFloor).sort((a, b) => a - b),
      ...queue.filter((f) => f < currentFloor).sort((a, b) => b - a),
    ];
  }

  if (direction === "down") {
    return [
      ...queue.filter((f) => f < currentFloor).sort((a, b) => b - a),
      ...queue.filter((f) => f > currentFloor).sort((a, b) => a - b),
    ];
  }

  return queue;
}

export const { addRequest, step } = elevatorSlice.actions;
export default elevatorSlice.reducer;
export { FLOORS };