import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addRequest, step, FLOORS } from "../store/elevatorSlice";
import type { RootState, AppDispatch } from "../store";

export const Elevator: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { currentFloor, direction, queue, moving } = useSelector(
    (s: RootState) => s.elevator
  );

  // Move elevator every 1.5 seconds
  useEffect(() => {
    if (!direction) return;

    const timer = setInterval(() => {
      dispatch(step());
    }, 1500);

    return () => clearInterval(timer);
  }, [direction]);

  return (
    <div className="p-4 flex gap-8">
      {/* Floors */}
      <div className="flex flex-col-reverse gap-4">
        {FLOORS.map((floor) => (
          <div key={floor} className="flex items-center gap-4">
            {/* Buttons outside */}
            <div className="flex flex-col">
              {floor < 5 && (
                <button
                  className="px-2 py-1 bg-blue-300 rounded"
                  onClick={() => dispatch(addRequest(floor))}
                >
                  ↑
                </button>
              )}
              {floor > 0 && (
                <button
                  className="px-2 py-1 bg-blue-300 rounded mt-1"
                  onClick={() => dispatch(addRequest(floor))}
                >
                  ↓
                </button>
              )}
            </div>

            {/* Elevator car */}
            <div
              className={`w-16 h-16 flex items-center justify-center rounded 
              ${
                currentFloor === floor ? "bg-green-500 text-white" : "bg-gray-300"
              }`}
            >
              {floor}
            </div>

            {/* Highlight stops */}
            {queue.includes(floor) && (
              <div className="text-yellow-500 font-bold text-xl">●</div>
            )}
          </div>
        ))}
      </div>

      {/* Inside panel */}
      <div className="p-3 border rounded">
        <div className="font-medium mb-2">Inside Panel</div>

        <div className="grid grid-cols-1 gap-2">
          {FLOORS.map((f) => (
            <button
              key={f}
              className={`px-3 py-2 rounded transition
                ${currentFloor === f ? "bg-green-500 text-white" : ""}
                ${queue.includes(f) ? "bg-yellow-300" : "bg-gray-100"}
              `}
              onClick={() => dispatch(addRequest(f))}
            >
              Floor {f}
            </button>
          ))}
        </div>

        <div className="mt-2 text-xs text-blue-500">
          {moving ? "Elevator moving..." : "Elevator stopped"}
        </div>
      </div>
    </div>
  );
};