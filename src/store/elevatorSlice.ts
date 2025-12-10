import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type Direction = "up" | "down" | null;
export type Status = "idle" | "moving" | "stop";

interface ElevatorState {
  currentFloor: number;
  direction: Direction;
  queue: number[];
  moving: boolean;
  status: Status; // ← added
  stopTimer: number | null; // ← for 1-second stop tracking
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
      // If currently stopping → countdown
      if (state.status === "stop") {
        if (state.stopTimer && state.stopTimer > 0) {
          state.stopTimer -= 1; // 1 step = 1 second
          return;
        }

        // Stop finished
        state.status = "moving";
        state.stopTimer = null;
      }

      if (!state.direction || state.queue.length === 0) {
        state.moving = false;
        state.direction = null;
        state.status = "idle";
        return;
      }

      state.moving = true;
      state.status = "moving";

      // Move 1 floor
      if (state.direction === "up") state.currentFloor += 1;
      else state.currentFloor -= 1;

      // If this is a stop floor
      if (state.queue.includes(state.currentFloor)) {
        state.queue = state.queue.filter((f) => f !== state.currentFloor);

        // >>> ADD STOP FOR 1 SECONDS <<<
        state.status = "stop";
        state.stopTimer = 1; // 1 seconds
        state.moving = false;

        // Direction is recalculated after stop
        return;
      }

      // Queue empty → idle
      if (state.queue.length === 0) {
        state.direction = null;
        state.moving = false;
        state.status = "idle";
        return;
      }

      // Re-evaluate direction
      const next = state.queue[0];
      state.direction = next > state.currentFloor ? "up" : "down";
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