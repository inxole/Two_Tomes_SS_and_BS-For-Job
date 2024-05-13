import { useRef, useEffect } from "react"
import { AnimationGroup, Color3, Engine, MeshBuilder, PointerEventTypes, PointerInfo, Scene, SceneLoader, StandardMaterial, Vector3 } from '@babylonjs/core'
import '@babylonjs/loaders'

const App = () => {
  const renderRef = useRef<HTMLCanvasElement>(null)
  const isAnimatingRef = useRef<boolean>(false)
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
      if (pointerInfo.pickInfo.hit && pointerInfo.pickInfo.pickedMesh?.name === "hitBox") {
        toggleAnimation()
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

      SceneLoader.Append("./", "page.glb", scene, function (scene) {
        const foundAnimation = scene.getAnimationGroupByName("page_action")
        if (foundAnimation) {
          animationRef.current = foundAnimation
        }

        const skeleton = scene.skeletons[0]
        const bone = skeleton.bones.find(b => b.name === "Bone.001")

        const Hit_Box = MeshBuilder.CreateBox("hitBox", { width: 0.1, height: 0.1, depth: 2 }, scene)
        if (bone && scene.meshes[0]) {
          Hit_Box.attachToBone(bone, scene.meshes[0])
        }

        const mat = new StandardMaterial("hitBoxMat", scene)
        mat.alpha = 0.3
        mat.diffuseColor = new Color3(0.5, 0.5, 1)
        Hit_Box.material = mat
        Hit_Box.position = new Vector3(0, 0.02, 0)
      })

      scene.onPointerObservable.add(pointerObserver)

      return () => {
        scene.dispose()
        engine.dispose()
      }
    }
  }, [])

  return <canvas id="render" style={{ width: "100%", height: "800px" }} ref={renderRef} />
}

export default App
