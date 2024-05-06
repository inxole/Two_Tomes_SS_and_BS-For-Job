import { useRef, useEffect, useState } from "react"
import { AnimationGroup, Engine, Scene, SceneLoader } from '@babylonjs/core'
import '@babylonjs/loaders'

const App = () => {
  const renderRef = useRef(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const animationRef = useRef<AnimationGroup | null>(null)

  useEffect(() => {
    if (renderRef.current) {
      const engine = new Engine(renderRef.current, true)
      const scene = new Scene(engine)

      scene.createDefaultCameraOrLight(true, true, true)

      engine.runRenderLoop(() => {
        scene.render()
      })

      SceneLoader.Append("./", "test_page.glb", scene, function (scene) {
        let foundAnimation = scene.getAnimationGroupByName("page_action")
        if (foundAnimation) {
          animationRef.current = foundAnimation
        }
      })

      return () => {
        scene.dispose()
        engine.dispose()
      }
    }
  }, [])

  const toggleAnimation = () => {
    if (animationRef.current) {
      if (isAnimating) {
        animationRef.current.stop()
      } else {
        animationRef.current.start(true)
      }
      setIsAnimating(!isAnimating)
    }
  }

  return (
    <canvas id="render" style={{ width: "100%", height: "800px" }} ref={renderRef} onClick={toggleAnimation}>
    </canvas>
  )
}

export default App
