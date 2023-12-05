import { useEffect, useRef, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Map } from './Maps/Map.jsx'
import { WindGL } from './WebGL/FlowMap.js'
import { MeshGL } from './WebGL/Mesh'
const res = 5

function App() {
  const wind = useRef(null)
  const [mesh, setMesh] = useState(null)
  const windCanvasRef = useRef(null)

  useEffect(() => { 

    // const gl = windCanvasRef.current.getContext('webgl', { antialiasing: false});
    // windCanvasRef.current.width = 649*res
    // windCanvasRef.current.height = 1459*res
    // wind.current = new WindGL(gl)

    setMesh(new MeshGL())
  }, [])

  // useEffect(() => {
  //   wind.current.numParticles = 1000000
  //   function frame() {
  //     if (wind.current.windData) {
  //       wind.current.draw();
  //     }
  //     requestAnimationFrame(frame);
  //   }
  //   frame();
  // }, [wind]) 

  return (
    <>
      {/* <canvas className="flowmap2" id="flowmap" ref={windCanvasRef} /> */}
      {/* <canvas id="mesh-canvas" ref={meshCanvasRef} /> */}
      {/* <Map/> */}
      <Map mesh={mesh}/>
      <video src={'/animation.mp4'} id='video' muted="muted" autoPlay={true} loop={true} playsInline={true} width={649} height={1459}></video>
    </>
  )
}

export default App
