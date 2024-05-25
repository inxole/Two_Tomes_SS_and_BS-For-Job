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

function createPageMesh(scene: Scene, name: string, z: number, isFront: boolean) {
    const width = 0.2
    const height = 0.296
    const widthSubdivisions = 20
    const heightSubdivisions = 1

    const page = new Mesh(name, scene)
    const positions = []
    const indices = []
    const normals = []
    const uvs = []
    const weights = []
    const influences = []

    for (let h = 0; h <= heightSubdivisions; h++) {
        for (let w = 0; w <= widthSubdivisions; w++) {
            const x = (w * width) / widthSubdivisions - width / 2
            const y = (h * height) / heightSubdivisions - height / 2
            positions.push(x, y, z)
            normals.push(0, 0, isFront ? -1 : 1)
            uvs.push(w / widthSubdivisions, h / heightSubdivisions)

            // ウェイトとインフルエンスの設定
            const weight = w / widthSubdivisions
            weights.push(weight, 1 - weight, 0, 0)
            const influence1 = Math.min(w, widthSubdivisions - 1)
            const influence2 = Math.min(w + 1, widthSubdivisions)
            influences.push(influence1, influence2, 0, 0)
        }
    }

    for (let h = 0; h < heightSubdivisions; h++) {
        for (let w = 0; w < widthSubdivisions; w++) {
            const topLeft = h * (widthSubdivisions + 1) + w;
            const topRight = topLeft + 1;
            const bottomLeft = topLeft + (widthSubdivisions + 1);
            const bottomRight = bottomLeft + 1;
            indices.push(topLeft, topRight, bottomRight);
            indices.push(topLeft, bottomRight, bottomLeft);
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
    return page
}

function createPageTexture(scene: Scene, text: string, isFront: boolean) {
    const font = "bold 44px monospace"
    const Texture = new DynamicTexture("DynamicTexture", isFront ? 512 : { width: 345, height: 512 }, scene, true)
    Texture.hasAlpha = true
    if (isFront) {
        Texture.drawText(text, null, null, font, "#000000", "#ffffff", true)
    }
    else {
        // Canvasの2Dコンテキストにアクセス
        const context = Texture.getContext()

        // 背景を白に設定
        context.fillStyle = "#ffffff"
        context.fillRect(0, 0, Texture.getSize().width, Texture.getSize().height)

        // テキストを描画する前にコンテキストを傾ける
        context.save()
        context.translate(270, 245)
        context.rotate(Math.PI / 1)// 45度傾ける
        context.fillStyle = "#000000"
        context.font = font
        context.fillText(text, 0, 0)
        context.restore()

        // テクスチャを更新
        Texture.update(false)
    }
    return Texture
}

function createPageMaterial(scene: Scene, texture: DynamicTexture) {
    const material = new StandardMaterial("pageMat", scene)
    material.diffuseTexture = texture
    material.diffuseColor = new Color3(1, 1, 1)
    material.backFaceCulling = false
    return material
}

function createPage(scene: Scene, name: string, text: string, z: number, isFront: boolean) {
    const page = createPageMesh(scene, name, z, isFront);
    const texture = createPageTexture(scene, text, isFront)
    page.material = createPageMaterial(scene, texture)
    page.rotation = new Vector3(Math.PI / 2, 0, 0)
    return page
}

function createCamera(scene: Scene, canvas: HTMLCanvasElement) {
    const camera = new ArcRotateCamera('camera1', Math.PI / 2, Math.PI / 4, 2, new Vector3(0, 0, 0), scene)
    camera.attachControl(canvas, true)
    camera.setPosition(new Vector3(1, 1, -1))
    camera.wheelPrecision = 200
    camera.lowerRadiusLimit = 1.2
    camera.upperRadiusLimit = 5
    camera.fov = 0.3
    return camera
}


const BabylonScene = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const [, dispatch] = useReducer(animationReducer, false)
    useEffect(() => {
        const canvas = canvasRef.current
        const engine = new Engine(canvas, true)
        const scene = new Scene(engine)

        if (!canvas) {
            throw new Error("HTMLCanvasElement is not found.")
        }
        const camera = createCamera(scene, canvas)

        const light = new HemisphericLight('light1', new Vector3(1, 1, 0), scene)
        light.intensity = 1.0

        const axesViewer = new AxesViewer(scene, 0.1)
        axesViewer.update(new Vector3(0, 0, 0), new Vector3(1, 0, 0), new Vector3(0, 1, 0), new Vector3(0, 0, 1))

        const pipeline = new DefaultRenderingPipeline("default", true, scene, [camera])
        pipeline.depthOfFieldEnabled = true
        pipeline.depthOfField.focalLength = 0.1
        pipeline.depthOfField.fStop = 1.4
        pipeline.depthOfField.focusDistance = 2000

        const widthSubdivisions = 20

        const front_page = createPage(scene, "front_page", "I'm front!", 0, true)
        const back_page = createPage(scene, "back_page", "I'm back!", 0.0001, false)

        const skeleton = new Skeleton("skeleton", "001", scene)

        function createHitBoxMaterial(boneName: string, scene: Scene): StandardMaterial {
            const material = new StandardMaterial(`hitBoxMat_${boneName}`, scene)
            material.alpha = 0.0
            material.diffuseColor = new Color3(0.5, 0.5, 1)
            return material
        }

        let parentBone = new Bone("rootBone", skeleton, null, Matrix.Translation(-0.11, 0, 0))
        for (let w = 0; w <= widthSubdivisions; w++) {
            const boneName = `bone${w}`
            parentBone = new Bone(boneName, skeleton, parentBone, Matrix.Translation(0.01, 0, 0))

            // 各ボーンにy軸回転アニメーションを適用
            const boneAnimation = createYRotationAnimation(boneName)
            parentBone.animations = [boneAnimation]

            // ヒットボックスを生成する部分
            const hitBox = MeshBuilder.CreateBox(`hitBox_${boneName}`, { width: 0.01, height: 0.296, depth: 0.01 }, scene)
            hitBox.material = createHitBoxMaterial(boneName, scene)
            hitBox.position = new Vector3(0, 0, 0)  // 初期位置
            hitBox.attachToBone(parentBone, front_page)  // ページメッシュに対してボーンをアタッチ

        }

        front_page.skeleton = skeleton
        back_page.skeleton = skeleton
        const skeletonViewer = new SkeletonViewer(skeleton, front_page, scene, false, 3, {
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
