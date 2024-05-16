import { useRef, useEffect } from 'react'
import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, StandardMaterial, Color3, AxesViewer, Skeleton, Bone, Matrix, VertexData, DefaultRenderingPipeline } from '@babylonjs/core'
import { Mesh } from '@babylonjs/core/Meshes/mesh'
import { SkeletonViewer } from '@babylonjs/core/Debug/skeletonViewer'
import { Inspector } from '@babylonjs/inspector'

const BabylonScene = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        const engine = new Engine(canvas, true)
        const scene = new Scene(engine)

        const camera = new ArcRotateCamera('camera1', Math.PI / 2, Math.PI / 4, 2, new Vector3(0, 0, 0), scene)
        camera.attachControl(canvas, true)
        camera.setPosition(new Vector3(1, 1, -1))
        camera.wheelPrecision = 200
        camera.lowerRadiusLimit = 1.2
        camera.upperRadiusLimit = 5
        camera.fov = 0.3

        // レンダリングパイプラインの作成
        const pipeline = new DefaultRenderingPipeline("default", true, scene, [camera])

        // Depth of Fieldの設定
        pipeline.depthOfFieldEnabled = true
        pipeline.depthOfField.focalLength = 0.1
        pipeline.depthOfField.fStop = 1.4
        pipeline.depthOfField.focusDistance = 2000

        const light = new HemisphericLight('light1', new Vector3(1, 1, 0), scene)
        light.intensity = 0.7

        const axesViewer = new AxesViewer(scene, 0.1)
        axesViewer.update(new Vector3(0, 0, 0), new Vector3(1, 0, 0), new Vector3(0, 1, 0), new Vector3(0, 0, 1))

        // Define the plane's size and subdivisions
        const width = 0.2
        const height = 0.296
        const widthSubdivisions = 20
        const heightSubdivisions = 1

        // Create custom mesh
        const page = new Mesh("page", scene)
        const positions = []
        const indices = []
        const normals = []
        const uvs = []

        // Define the vertex positions, normals, and UVs
        for (let i = 0; i <= heightSubdivisions; i++) {
            for (let j = 0; j <= widthSubdivisions; j++) {
                const x = (j * width) / widthSubdivisions - width / 2
                const y = (i * height) / heightSubdivisions - height / 2
                positions.push(x, y, 0)
                normals.push(0, 0, -1)
                uvs.push(j / widthSubdivisions, i / heightSubdivisions)
            }
        }

        // Define the indices
        for (let i = 0; i < heightSubdivisions; i++) {
            for (let j = 0; j < widthSubdivisions; j++) {
                const a = i * (widthSubdivisions + 1) + j
                const b = a + 1
                const c = a + (widthSubdivisions + 1)
                const d = c + 1
                indices.push(a, b, d)
                indices.push(a, d, c)
            }
        }

        // Set the vertex data
        const vertexData = new VertexData()
        vertexData.positions = positions
        vertexData.indices = indices
        vertexData.normals = normals
        vertexData.uvs = uvs
        vertexData.applyToMesh(page)

        // Create material
        const pageMaterial = new StandardMaterial("pageMat", scene)
        pageMaterial.diffuseColor = new Color3(1, 1, 1)
        pageMaterial.wireframe = true
        page.material = pageMaterial

        // Rotate the page
        page.rotation = new Vector3(Math.PI / 2, 0, 0)

        // SceneLoader.Append("./", "page.glb", scene, function () { })

        // スケルトンの作成
        const skeleton = new Skeleton("skeleton", "001", scene)

        // 20個のボーンを作成し、x軸に沿って配置
        let parentBone = new Bone("rootBone", skeleton, null, Matrix.Translation(-0.1, 0, 0))
        for (let i = 0; i < 20; i++) {
            parentBone = new Bone(`bone${i}`, skeleton, parentBone, Matrix.Translation(0.01, 0, 0)) // ボーンをx軸に沿って配置
        }

        // メッシュにスケルトンを適用
        page.skeleton = skeleton

        // スケルトンビューアの作成
        const skeletonViewer = new SkeletonViewer(skeleton, page, scene, false, 3, {
            displayMode: SkeletonViewer.DISPLAY_SPHERE_AND_SPURS
        })
        skeletonViewer.isEnabled = true

        // スケルトンをインスペクターで見るために必須のフラグを設定
        scene.debugLayer.show({
            embedMode: true
        })

        Inspector.Show(scene, {})

        engine.runRenderLoop(() => {
            scene.render()
        })

        const resize = () => {
            engine.resize()
        }

        window.addEventListener('resize', resize)

        return () => {
            engine.dispose()
            window.removeEventListener('resize', resize)
        }
    }, [])

    return <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
}

export default BabylonScene
