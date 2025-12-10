// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import type { RootState, AppDispatch } from "../store";
// import { pressFloor, pressOutside, startElevatorIfNeeded, setTravelDelay, clearAllRequests } from "../store/elevatorSlice";


// const FLOORS = [4,3,2,1,0]; // show top -> bottom (5 floors: 0..4)

// const ElevatorShaft: React.FC = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const elevator = useSelector((s: RootState) => s.elevator);

//   // whenever requests change and elevator is not moving -> start
//   useEffect(() => {
//     dispatch(startElevatorIfNeeded());
//   }, [elevator.requests.join(","), elevator.moving, dispatch]);

//   return (
//     <div className="flex gap-6">
//       {/* Outside buttons column */}
//       <div className="flex flex-col items-center gap-6">
//         {FLOORS.map((floor) => (
//           <OutsideButtons key={floor} floor={floor} onCall={(dir) => dispatch(pressOutside({floor, direction: dir}))} />
//         ))}
//       </div>

//       {/* Shaft */}
//       <div className="flex flex-col-reverse items-center gap-4">
//         {FLOORS.slice().reverse().map((floor) => ( // draw bottom->top inside shaft
//           <div key={floor} className="w-40 h-16 border border-gray-200 rounded-xl flex items-center justify-center relative">
//             {/* Elevator car */}
//             {elevator.currentFloor === floor && (
//               <div className={`w-28 h-12 rounded-lg flex items-center justify-center
//                 ${floor === 0 ? "bg-teal-500 text-white" : "bg-gray-700 text-white"}`}>
//                 {floor}
//               </div>
//             )}
//             {/* small indicator of requested floors on right */}
//             <div className="absolute right-2 top-2 text-xs text-gray-500">
//               {elevator.requests.includes(floor) ? "●" : ""}
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Inside panel and controls */}
//       <div className="flex flex-col gap-4">
//         <InsidePanel
//           currentFloor={elevator.currentFloor}
//           requests={elevator.requests}
//           moving={elevator.moving}
//           onPress={(f) => dispatch(pressFloor(f))}
//         />
//         <div className="p-3 border rounded">
//           <div className="text-sm">Status</div>
//           <div>Floor: <strong>{elevator.currentFloor}</strong></div>
//           <div>Direction: <strong>{elevator.direction}</strong></div>
//           <div>Moving: <strong>{elevator.moving ? "Yes" : "No"}</strong></div>
//           <div>Queue: <strong>{elevator.requests.join(", ") || "—"}</strong></div>
//           <div className="mt-2 flex gap-2">
//             <button
//               className="px-2 py-1 border rounded text-sm"
//               onClick={() => dispatch(setTravelDelay(400))}
//             >Fast</button>
//             <button
//               className="px-2 py-1 border rounded text-sm"
//               onClick={() => dispatch(setTravelDelay(800))}
//             >Normal</button>
//             <button
//               className="px-2 py-1 border rounded text-sm"
//               onClick={() => dispatch(clearAllRequests())}
//             >Clear</button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ElevatorShaft;

// /* InsidePanel & OutsideButtons components below (in same file for brevity) */

// const InsidePanel: React.FC<{
//   currentFloor: number;
//   requests: number[];
//   moving: boolean;
//   onPress: (floor: number) => void;
// }> = ({ currentFloor, requests, moving, onPress }) => {
//   return (
//     <div className="p-3 border rounded">
//       <div className="font-medium mb-2">Inside Panel</div>

//       {/* FLOOR BUTTONS */}
//       <div className="grid grid-cols-1 gap-2">
//         {[0, 1, 2, 3, 4].map((f) => (
//           <button
//             key={f}
//             onClick={() => onPress(f)}
//             className={`
//               px-3 py-2 rounded transition
//               ${currentFloor === f ? "bg-green-500 text-white" : ""}
//               ${requests.includes(f) ? "bg-yellow-300" : "bg-gray-100"}
//             `}
//           >
//             Floor {f}
//           </button>
//         ))}
//       </div>

//       {/* MOVEMENT STATUS */}
//       <div className="mt-2 text-xs text-blue-500">
//         {moving ? "Elevator moving..." : "Elevator stopped"}
//       </div>

//       <div className="mt-1 text-xs text-gray-500">
//         Tip: press floors while moving to change route
//       </div>
//     </div>
//   );
// };


// const OutsideButtons: React.FC<{ floor: number; onCall: (dir: "up" | "down") => void }> = ({ floor, onCall }) => {
//   return (
//     <div className="flex items-center gap-2">
//       <div className="w-6 text-right text-sm">{floor}</div>
//       <div className="flex flex-col">
//         <button
//           className="w-8 h-6 mb-1 flex items-center justify-center border rounded text-xs"
//           onClick={() => onCall("up")}
//           disabled={floor === 4}
//         >↑</button>
//         <button
//           className="w-8 h-6 flex items-center justify-center border rounded text-xs"
//           onClick={() => onCall("down")}
//           disabled={floor === 0}
//         >↓</button>
//       </div>
//     </div>
//   );
// };

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