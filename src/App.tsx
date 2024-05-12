import { useRef, useEffect } from "react"
import { AnimationGroup, BoxBuilder, Color3, Engine, Mesh, MeshBuilder, PointerEventTypes, PointerInfo, Scene, SceneLoader, StandardMaterial } from '@babylonjs/core'
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

  function pointerObserver(pointerInfo: PointerInfo) {
    if (pointerInfo.pickInfo !== null && pointerInfo.type === PointerEventTypes.POINTERDOWN) {
      if (pointerInfo.pickInfo.hit && pointerInfo.pickInfo.pickedMesh) {
        if (pointerInfo.pickInfo.pickedMesh.name === "hitBox") {
          toggleAnimation()
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

        // ヒットボックスを追加
        const targetMesh = scene.getMeshByName("Plane")
        if (targetMesh) {
          const hitBox = MeshBuilder.CreateBox("hitBox", { width: 1, height: 1, depth: 1 }, scene)
          hitBox.parent = targetMesh
          hitBox.position.y += 1 // 位置を調整

          // ヒットボックスのマテリアル設定（透明）
          const mat = new StandardMaterial("hitBoxMat", scene)
          mat.alpha = 0.3 // 完全に透明
          mat.diffuseColor = new Color3(0.5, 0.5, 1)
          hitBox.material = mat
        }
      })

      scene.onPointerObservable.add(pointerObserver)

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
