import React, { useRef, useEffect, useReducer } from 'react'
import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, StandardMaterial, Color3, AxesViewer, Skeleton, Bone, Matrix, VertexData, DefaultRenderingPipeline, PointerInfo, PointerEventTypes, MeshBuilder, DynamicTexture } from '@babylonjs/core'
import { Mesh } from '@babylonjs/core/Meshes/mesh'
import { SkeletonViewer } from '@babylonjs/core/Debug/skeletonViewer'
import { Inspector } from '@babylonjs/inspector'
import createYRotationAnimation from './Animation_data'

type Action = { type: 'TOGGLE', open: VoidFunction, close: VoidFunction }
function animationReducer(state: boolean, action: Action) {
    switch (action.type) {
        case 'TOGGLE':
            if (state) {
                action.close()
            }
            else {
                action.open()
            }
            return !state
        default:
            throw new Error()
    }
}

function toggleAnimation(pointerInfo: PointerInfo, dispatch: React.Dispatch<Action>, scene: Scene, skeleton: Skeleton) {
    if (pointerInfo.pickInfo !== null && pointerInfo.type === PointerEventTypes.POINTERDOWN) {
        if (pointerInfo.pickInfo.hit && /^hitBox_/.test(pointerInfo.pickInfo.pickedMesh?.name || "")) {
            dispatch({
                type: "TOGGLE",
                open: () => {
                    scene.beginAnimation(skeleton, 0, 60, true, undefined, () => {
                    })
                },
                close: () => {
                    scene.beginAnimation(skeleton, 60, 120, true, undefined, () => {
                    })
                }
            })
        }
    }
}

const BabylonScene = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const [, dispatch] = useReducer(animationReducer, false)
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
        const light = new HemisphericLight('light1', new Vector3(1, 1, 0), scene)
        light.intensity = 1.0

        const axesViewer = new AxesViewer(scene, 0.1)
        axesViewer.update(new Vector3(0, 0, 0), new Vector3(1, 0, 0), new Vector3(0, 1, 0), new Vector3(0, 0, 1))

        const pipeline = new DefaultRenderingPipeline("default", true, scene, [camera])
        pipeline.depthOfFieldEnabled = true
        pipeline.depthOfField.focalLength = 0.1
        pipeline.depthOfField.fStop = 1.4
        pipeline.depthOfField.focusDistance = 2000

        const width = 0.2
        const height = 0.296
        const widthSubdivisions = 20
        const heightSubdivisions = 1

        const page = new Mesh("page", scene)
        const positions = []
        const indices = []
        const normals = []
        const uvs = []
        const weights = []
        const influences = []

        for (let i = 0; i <= heightSubdivisions; i++) {
            for (let j = 0; j <= widthSubdivisions; j++) {
                const x = (j * width) / widthSubdivisions - width / 2
                const y = (i * height) / heightSubdivisions - height / 2
                positions.push(x, y, 0)
                normals.push(0, 0, -1)
                uvs.push(j / widthSubdivisions, i / heightSubdivisions)

                // ウェイトとインフルエンスの設定
                const weight = j / widthSubdivisions
                weights.push(weight, 1 - weight, 0, 0)
                const influence1 = Math.min(j, widthSubdivisions - 1)
                const influence2 = Math.min(j + 1, widthSubdivisions)
                influences.push(influence1, influence2, 0, 0)
            }
        }

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

        const vertexData = new VertexData()
        vertexData.positions = positions
        vertexData.indices = indices
        vertexData.normals = normals
        vertexData.uvs = uvs
        vertexData.matricesWeights = weights
        vertexData.matricesIndices = influences
        vertexData.applyToMesh(page)

        const FrontTexture = new DynamicTexture("DynamicTexture", 512, scene, true)
        FrontTexture.hasAlpha = true
        const font = "bold 44px monospace"
        FrontTexture.drawText("Hello, Babylon.js!", null, null, font, "#000000", "#ffffff", true)

        const pageMaterial = new StandardMaterial("pageMat", scene)
        pageMaterial.diffuseTexture = FrontTexture
        pageMaterial.diffuseColor = new Color3(1, 1, 1)
        pageMaterial.backFaceCulling = false
        page.material = pageMaterial
        page.rotation = new Vector3(Math.PI / 2, 0, 0)

        const back_page = new Mesh("back_page", scene)
        const back_positions = []
        const back_indices = []
        const back_normals = []
        const back_uvs = []
        const back_weights = []
        const back_influences = []

        for (let i = 0; i <= heightSubdivisions; i++) {
            for (let j = 0; j <= widthSubdivisions; j++) {
                const x = (j * width) / widthSubdivisions - width / 2
                const y = (i * height) / heightSubdivisions - height / 2
                back_positions.push(x, y, 0.0001)
                back_normals.push(0, 0, 1)
                back_uvs.push(j / widthSubdivisions, i / heightSubdivisions)

                // ウェイトとインフルエンスの設定
                const weight = j / widthSubdivisions
                back_weights.push(weight, 1 - weight, 0, 0)
                const influence1 = Math.min(j, widthSubdivisions - 1)
                const influence2 = Math.min(j + 1, widthSubdivisions)
                back_influences.push(influence1, influence2, 0, 0)
            }
        }

        for (let i = 0; i < heightSubdivisions; i++) {
            for (let j = 0; j < widthSubdivisions; j++) {
                const a = i * (widthSubdivisions + 1) + j
                const b = a + 1
                const c = a + (widthSubdivisions + 1)
                const d = c + 1
                back_indices.push(a, b, d)
                back_indices.push(a, d, c)
            }
        }

        const back_vertexData = new VertexData()
        back_vertexData.positions = back_positions
        back_vertexData.indices = back_indices
        back_vertexData.normals = back_normals
        back_vertexData.uvs = back_uvs
        back_vertexData.matricesWeights = back_weights
        back_vertexData.matricesIndices = back_influences
        back_vertexData.applyToMesh(back_page)

        const BackTexture = new DynamicTexture("DynamicTexture", { width: 345, height: 512 }, scene, true)
        BackTexture.hasAlpha = true
        const back = "bold 44px monospace"

        // Canvasの2Dコンテキストにアクセス
        const ctx = BackTexture.getContext()

        // 背景を白に設定
        ctx.fillStyle = "#ffffff"
        ctx.fillRect(0, 0, BackTexture.getSize().width, BackTexture.getSize().height)

        // テキストを描画する前にコンテキストを傾ける
        ctx.save()
        ctx.translate(270, 245)
        ctx.rotate(Math.PI / 1)// 45度傾ける
        ctx.fillStyle = "#000000"
        ctx.font = back
        ctx.fillText("I'm back!", 0, 0)
        ctx.restore()

        // テクスチャを更新
        BackTexture.update(false)

        const back_pageMaterial = new StandardMaterial("pageMat", scene)
        back_pageMaterial.diffuseTexture = BackTexture
        back_pageMaterial.diffuseColor = new Color3(1, 1, 1)
        back_pageMaterial.backFaceCulling = false
        back_page.material = back_pageMaterial
        back_page.rotation = new Vector3(Math.PI / 2, 0, 0)

        const skeleton = new Skeleton("skeleton", "001", scene)

        function createHitBoxMaterial(boneName: string, scene: Scene): StandardMaterial {
            const material = new StandardMaterial(`hitBoxMat_${boneName}`, scene)
            material.alpha = 0.0
            material.diffuseColor = new Color3(0.5, 0.5, 1)
            return material
        }

        let parentBone = new Bone("rootBone", skeleton, null, Matrix.Translation(-0.11, 0, 0))
        for (let i = 0; i <= widthSubdivisions; i++) {
            const boneName = `bone${i}`
            parentBone = new Bone(boneName, skeleton, parentBone, Matrix.Translation(0.01, 0, 0))

            // 各ボーンにy軸回転アニメーションを適用
            const boneAnimation = createYRotationAnimation(boneName)
            parentBone.animations = [boneAnimation]

            // ヒットボックスを生成する部分
            const hitBox = MeshBuilder.CreateBox(`hitBox_${boneName}`, { width: 0.01, height: 0.296, depth: 0.01 }, scene)
            hitBox.material = createHitBoxMaterial(boneName, scene)
            hitBox.position = new Vector3(0, 0, 0)  // 初期位置
            hitBox.attachToBone(parentBone, page)  // ページメッシュに対してボーンをアタッチ

        }

        page.skeleton = skeleton
        back_page.skeleton = skeleton
        const skeletonViewer = new SkeletonViewer(skeleton, page, scene, false, 3, {
            displayMode: SkeletonViewer.DISPLAY_SPHERE_AND_SPURS
        })
        skeletonViewer.isEnabled = true

        scene.debugLayer.show({
            embedMode: true
        })

        scene.onPointerObservable.add(
            (pointerInfo) => toggleAnimation(pointerInfo, dispatch, scene, skeleton)
        )

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
