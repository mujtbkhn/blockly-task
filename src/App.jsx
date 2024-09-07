import './App.css'
import Map from "./components/Map"

function App() {

  return (
    <>
      <div className="flex flex-col gap-3 items-center justify-center w-full">
        <h1 className='text-3xl mt-5 font-bold' >Vehicle Movement on a Map</h1>
        <h2 className='text-2xl font-mono my-2'>Click on the map <span className='font-semibold'>first time</span> to set the starting route and <span className='font-semibold'>second time</span> for the destination!</h2>
        <Map />
      </div>
    </>
  )
}

export default App
