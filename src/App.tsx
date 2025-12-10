import { Elevator } from "./components/ElevatorShaft"
function App() {
  

  return (
     <div className="app-bg">
       <div className="w-full max-w-xl bg-white rounded-lg shadow">
        <h1 className="text-center text-2xl font-semibold text-teal-600 mb-6">Elevator Playground</h1>
        <Elevator />
      </div>
    </div>
  )
}

export default App
