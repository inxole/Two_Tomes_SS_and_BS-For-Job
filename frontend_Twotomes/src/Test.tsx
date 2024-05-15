import React, { useRef, useEffect } from 'react'
import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, MeshBuilder, StandardMaterial, Color3, AxesViewer } from '@babylonjs/core'
import { Mesh } from '@babylonjs/core/Meshes/mesh'

const BabylonScene: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        const engine = new Engine(canvas!, true)
        const scene = new Scene(engine)

        const camera = new ArcRotateCamera('camera1', Math.PI / 2, Math.PI / 4, 3, new Vector3(0, 0, 0), scene)
        camera.attachControl(canvas, true)
        camera.setPosition(new Vector3(3, 3, 3))

        const light = new HemisphericLight('light1', new Vector3(1, 1, 0), scene)
        light.intensity = 0.7


        const axesViewer = new AxesViewer(scene, 0.5)
        axesViewer.update(new Vector3(0, 0, 0), new Vector3(1, 0, 0), new Vector3(0, 1, 0), new Vector3(0, 0, 1))

        // ページの作成
        const pageWidth = 1
        const pageHeight = 1.5
        const page = MeshBuilder.CreatePlane('page', { width: pageWidth, height: pageHeight, sideOrientation: Mesh.DOUBLESIDE }, scene)
        const pageMaterial = new StandardMaterial('pageMat', scene)
        pageMaterial.diffuseColor = new Color3(1, 1, 1)
        page.material = pageMaterial
        page.rotation = new Vector3(Math.PI / 2, 0, Math.PI / 2)


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
