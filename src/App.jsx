import { useEffect, useRef, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Map } from './Maps/Map.jsx'
import { WindGL } from './WebGL/FlowMap.js'

function App() {
  const wind = useRef(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    // const canvas = document.getElementById('canvasID');
    const gl = canvasRef.current.getContext('webgl', { antialiasing: false});
    canvasRef.current.width = 649
    canvasRef.current.height = 1459
    wind.current = new WindGL(gl)
    // const gl = canvasRef.current.getContext('webgl', { antialiasing: false});
    // canvasRef.current.width = 649
    // canvasRef.current.height = 1459
    // wind.current = new WindGL(gl)
  }, [])

  useEffect(() => {
    wind.current.numParticles = 10000
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
      <canvas className="flowmap" id="flowmap" ref={canvasRef} />
      <Map />
    </>
  )
}

export default App
