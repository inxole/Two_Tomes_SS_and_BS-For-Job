import { useRef, useEffect } from "react"
import { AnimationGroup, Engine, PointerEventTypes, PointerInfo, Scene, SceneLoader } from '@babylonjs/core'
import '@babylonjs/loaders'

const App = () => {
  const renderRef = useRef(null)
  const isAnimatingRef = useRef(false)
  const animationRef = useRef<AnimationGroup | null>(null)

  const toggleAnimation = () => {
    if (animationRef.current) {
      if (isAnimatingRef.current) {
        animationRef.current.stop()
      } else {
        animationRef.current.start(true)
      }
      isAnimatingRef.current = !isAnimatingRef.current
    }
  }

  function pointerobserber(pointerInfo: PointerInfo) {
    if (pointerInfo.pickInfo !== null) {
      if (pointerInfo.type === PointerEventTypes.POINTERDOWN) {
        if (pointerInfo.pickInfo.hit) {
          if (pointerInfo.pickInfo.pickedMesh) {
            if (pointerInfo.pickInfo.pickedMesh.name === "Plane") {
              toggleAnimation()
            }
          }
        }
      }
    }
  }

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

      scene.onPointerObservable.add(pointerobserber)

      return () => {
        scene.dispose()
        engine.dispose()
      }
    }
  }, [])

  return (
    <canvas id="render" style={{ width: "100%", height: "800px" }} ref={renderRef}>
    </canvas>
  )
}

export default App
