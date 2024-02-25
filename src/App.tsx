import Model from './Model/Test_page' 
import { Canvas } from '@react-three/fiber'
import { Suspense } from "react"

const App = () => {
  return (
    <span>
      <Suspense fallback={null}>	
        <Canvas>
          <Model/> 
        </Canvas>
      </Suspense>
    </span>
  )
}

export default App
