import { useRef, useEffect } from "react"
import { GLTFFileLoader } from '@babylonjs/loaders'
import { Engine, MeshBuilder, Scene, StandardMaterial, Texture, SceneLoader } from '@babylonjs/core'

const App = () => {
  const renderRef = useRef(null)

  useEffect(() => {
    if (renderRef.current) {
      const engine = new Engine(renderRef.current, true)
      const scene = new Scene(engine)

      scene.createDefaultCameraOrLight(true, true, true)

      const ground = MeshBuilder.CreateGround("ground", { width: 6, height: 6 }, scene)
      const groundMaterial = new StandardMaterial("Ground Material", scene)
      let groundTexture = new Texture("path/to/checkerboard_basecolor.png", scene)

      groundMaterial.diffuseTexture = groundTexture
      ground.material = groundMaterial

      engine.runRenderLoop(() => {
        scene.render()
      })
      GLTFFileLoader.IncrementalLoading = true
      SceneLoader.ImportMesh("", "./", "Tome_SS.glb", scene, function (newMeshes) {
        // This function is called when the GLB file is loaded
        // newMeshes is an array of all the meshes in the GLB file
        newMeshes.forEach(mesh => {
          // Do something with the mesh
          if (mesh.name === "nameOfTheMeshYouWantToModify") {
            // Modify the mesh
          }
        })
      })

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

// ゲームの進行状況の保存

// 未クリア：天使文字変換不可
// クリア：天使文字変換

// frontend(見た目) babylon

//OpenID と OAuth
// backend user認証 supabase 
// user data supabase postgreSQL
