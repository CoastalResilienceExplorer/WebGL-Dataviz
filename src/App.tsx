import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Map } from './Maps/Map.tsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className='base' />
      <Map />
    </>
  )
}

export default App
