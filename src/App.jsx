import { useEffect, useRef, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Map } from './Maps/Map.jsx'
import { WindGL } from './WebGL/FlowMap.js'
const res = 5

function App() {
  const wind = useRef(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    const gl = canvasRef.current.getContext('webgl', { antialiasing: false});
    canvasRef.current.width = 649*res
    canvasRef.current.height = 1459*res
    wind.current = new WindGL(gl)
  }, [])

  useEffect(() => {
    wind.current.numParticles = 50000
    function frame() {
      if (wind.current.windData) {
        wind.current.draw();
      }
      requestAnimationFrame(frame);
    }
    frame();
  }, [wind])

  return (
    <>
      <canvas className="flowmap2" id="flowmap" ref={canvasRef} />
      <Map />
    </>
  )
}

export default App
