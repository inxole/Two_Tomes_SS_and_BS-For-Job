import React, { Reducer, useEffect, useReducer, useRef, useState } from 'react'
import { Engine, Scene, Vector3, AxesViewer, SkeletonViewer, PointerInfo, PointerEventTypes, Mesh, DynamicTexture, Skeleton, SceneLoader, AnimationGroup, MeshBuilder, IBoneWeightShaderOptions, StandardMaterial, Color3, Matrix } from '@babylonjs/core'
import { useRecoilState } from 'recoil'
import { Inspector } from '@babylonjs/inspector'
import { Long_Text, Pages_Number, Text_Switch } from './atom'
import { CameraWork, LightUp, createHitBoxMaterial, createPage, createSkeleton } from './Canvas_Function'
import { bonesDeclaration } from '@babylonjs/core/Shaders/ShadersInclude/bonesDeclaration'

type Action = { type: 'TOGGLE', open: VoidFunction, close: VoidFunction }
function animationReducer(state: boolean, action: Action) {
    switch (action.type) {
        case 'TOGGLE':
            if (state) {
                action.close()
            } else {
                action.open()
            }
            return !state
        default:
            throw new Error()
    }
}

type ToggleAnimationSetup = {
    dispatch: React.Dispatch<Action>,
    skeleton: Skeleton,
    pickNamePattern: RegExp,
}

function ToggleAnimationHandler(pointerInfo: PointerInfo, scene: Scene, toggleAnimationSetups: ToggleAnimationSetup[]) {
    if (pointerInfo.pickInfo !== null && pointerInfo.type === PointerEventTypes.POINTERDOWN) {
        for (const { dispatch, skeleton, pickNamePattern } of toggleAnimationSetups) {
            if (pointerInfo.pickInfo.hit && pickNamePattern.test(pointerInfo.pickInfo.pickedMesh?.name || "")) {
                dispatch({
                    type: "TOGGLE",
                    open: () => {
                        scene.beginAnimation(skeleton, 0, 60, true, undefined, () => { })
                    },
                    close: () => {
                        scene.beginAnimation(skeleton, 60, 120, true, undefined, () => { })
                    }
                })
            }
        }
    }
}

const useDynamicReducers = (reducer: Reducer<boolean, Action>, initialState: boolean, count: number) => {
    return Array.from({ length: count }, () => useReducer(reducer, initialState))
}

const Canvas = () => {
    const isDebug = true
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const [text_update, setText_update] = useRecoilState(Text_Switch)
    const [meshes_amount,] = useRecoilState(Pages_Number)
    const [updated_text,] = useRecoilState(Long_Text)
    const skeletons_amount = 1
    const dispatchers = useDynamicReducers(animationReducer, false, skeletons_amount).map(([_, dispatch]) => dispatch)

    const [isAnimating, setIsAnimating] = useState(false)
    const animationRef = useRef<AnimationGroup | null>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        const engine = new Engine(canvas, true)
        const scene = new Scene(engine)
        LightUp(scene)
        CameraWork(scene, canvas)

        const front_pages: Mesh[] = []
        const back_pages: Mesh[] = []
        const pageSkeletons: Skeleton[] = []
        for (let i = 0; i < meshes_amount; i++) {
            const front_page = createPage(scene, `front_page_${i}`, i === 0 ? updated_text : `page_${2 * i + 1}`, i * 0.01, true)
            const back_page = createPage(scene, `back_page_${i}`, `page_${2 * i + 2}`, i * 0.01 + 0.0001, false)

            front_pages.push(front_page)
            back_pages.push(back_page)
        }
        for (let i = 0; i < skeletons_amount; i++) {
            const pageSkeleton = createSkeleton(scene, `skeleton_${i}`, front_pages[i], i * 0.01, `animation${i + 1}`)
            pageSkeletons.push(pageSkeleton)
        }
        for (let i = 0; i < meshes_amount; i++) {
            front_pages[i].skeleton = pageSkeletons[i]
            back_pages[i].skeleton = pageSkeletons[i]
        }

        const front_texture_info = front_pages[0].material?.getActiveTextures()
        const front_texture = front_texture_info?.values().next().value as DynamicTexture
        if (text_update) {
            const text_size = 22
            const font = "bold " + text_size + "px monospace"
            front_texture.clear()
            front_texture.drawText(updated_text, 0, text_size, font, "#000000", "#ffffff", true)
            setText_update(false)
        }

        const mesh_BS: Mesh[] = []
        const skeletons_BS: Skeleton[] = []

        SceneLoader.Append("./", "Tome_BS.glb", scene, function () {
            let foundAnimation = scene.getAnimationGroupByName("1_BS_action_15")
            if (foundAnimation) {
                animationRef.current = foundAnimation
            }

            // メッシュの取得
            const testCubeMesh_0 = scene.getMeshByName("Tome_BS_primitive0") as Mesh
            const testCubeMesh_1 = scene.getMeshByName("Tome_BS_primitive1") as Mesh
            const testCubeMesh_2 = scene.getMeshByName("Tome_BS_primitive2") as Mesh

            if (testCubeMesh_0 && testCubeMesh_1 && testCubeMesh_2) {
                // メッシュの統合
                const mergedMesh = Mesh.MergeMeshes([testCubeMesh_0, testCubeMesh_1, testCubeMesh_2], true, true, undefined, false, true)
                if (mergedMesh) {
                    // 統合したメッシュの名前を設定
                    mergedMesh.name = "Tome_BS"

                    // スケルトン「BS_Armature」を取得
                    const skeleton = scene.getSkeletonByName("BS_Armature")
                    mergedMesh.skeleton = skeleton

                    if (mergedMesh.skeleton && skeleton) {
                        // メッシュとスケルトンの回転
                        const rotateTransform = Matrix.RotationY(Math.PI / 1)
                        mergedMesh.bakeTransformIntoVertices(rotateTransform)

                        // スケルトンのボーンの回転
                        skeleton.bones.forEach(bone => {
                            const currentMatrix = bone.getLocalMatrix()
                            const newMatrix = currentMatrix.multiply(rotateTransform)
                            bone.getLocalMatrix().copyFrom(newMatrix)
                        })

                        // mergedMesh と skeleton を配列に追加
                        mesh_BS.push(mergedMesh)
                        skeletons_BS.push(skeleton)
                    }
                    // mesh_BS 内のメッシュと skeletons_BS 内のスケルトンのスケルトンビューアーを作成
                    mesh_BS.forEach((mesh, index) => {
                        const skeleton = skeletons_BS[index]
                        const skeletonViewer = new SkeletonViewer(skeleton, mesh, scene, false, 3, {
                            displayMode: SkeletonViewer.DISPLAY_SPHERE_AND_SPURS
                        })
                        skeletonViewer.isEnabled = true
                    })
                }
            }
        })

        const box_mesh = MeshBuilder.CreateBox("box", { size: 0.01 }, scene)
        box_mesh.position = new Vector3(0.003, 0, 0)
        front_pages[0].parent = box_mesh
        back_pages[0].parent = box_mesh

        if (isDebug) {
            pageSkeletons.forEach((pageSkeleton, i) => {
                const skeletonViewer = new SkeletonViewer(pageSkeleton, front_pages[i], scene, false, 3, {
                    displayMode: SkeletonViewer.DISPLAY_SPHERE_AND_SPURS
                })
                skeletonViewer.isEnabled = true
            })
            scene.debugLayer.show({
                embedMode: true
            })
            Inspector.Show(scene, {})
        }
        scene.onPointerObservable.add(
            (pointerInfo) => ToggleAnimationHandler(pointerInfo, scene, pageSkeletons.map((pageSkeleton, i) => ({
                dispatch: dispatchers[i],
                skeleton: pageSkeleton,
                pickNamePattern: new RegExp(`^hitBox_animation${i + 1}_`)
            })))
        )

        engine.runRenderLoop(() => { scene.render() })
        const resize = () => { engine.resize() }
        window.addEventListener('resize', resize)
        return () => {
            engine.dispose()
            window.removeEventListener('resize', resize)
        }
    }, [text_update, meshes_amount])

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

    return <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} onClick={toggleAnimation} />
}

export default Canvas
