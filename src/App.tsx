import * as BABYLON from 'babylonjs';
import { Suspense, useRef, useEffect } from "react";

const App = () => {
  const renderRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    if (renderRef.current) {
      const engine = new BABYLON.Engine(renderRef.current, true)
      const scene = new BABYLON.Scene(engine)

      scene.createDefaultCameraOrLight(true, true, true)

      const ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 6, height: 6 }, scene)
      const groundMaterial = new BABYLON.StandardMaterial("Ground Material", scene)
      let groundTexture = new BABYLON.Texture("path/to/checkerboard_basecolor.png", scene)

      groundMaterial.diffuseTexture = groundTexture
      ground.material = groundMaterial

      engine.runRenderLoop(() => {
        scene.render()
      })

      return () => {
        engine.dispose()
      }
    }
  }, [])

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <canvas id="render" style={{ width: "100%", height: "800px" }} ref={renderRef}>
      </canvas>
    </Suspense>
  )
}

export default App

// ゲームの進行状況の保存

// 未クリア：天使文字変換不可
// クリア：天使文字変換

// frontend(見た目) babylon

//OpenID と OAuth
// backend user認証 supabase 
// user data supabase postgreSQL
