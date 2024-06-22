import React, { Reducer, useEffect, useReducer, useRef, useState } from 'react'
import { Engine, Scene, Vector3, AxesViewer, SkeletonViewer, PointerInfo, PointerEventTypes, Mesh, DynamicTexture, Skeleton, SceneLoader, AnimationGroup, BoneAxesViewer, IBoneWeightShaderOptions } from '@babylonjs/core'
import { useRecoilState } from 'recoil'
import { Inspector } from '@babylonjs/inspector'
import { Long_Text, Pages_Number, Text_Switch } from './atom'
import { CameraWork, LightUp, createPage, createSkeleton } from './Canvas_Function'

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

        SceneLoader.Append("./", "test_cube.glb", scene, function () {
            let foundAnimation = scene.getAnimationGroupByName("test_Armature")
            if (foundAnimation) {
                animationRef.current = foundAnimation
            }
            const testCubeMesh = scene.getMeshByName("test_Cube") as Mesh
            if (testCubeMesh && testCubeMesh.skeleton) {
                const skeletonViewer = new SkeletonViewer(testCubeMesh.skeleton, testCubeMesh, scene, false, 1, {
                    displayMode: SkeletonViewer.DISPLAY_SPHERE_AND_SPURS
                })
                skeletonViewer.isEnabled = true
            }
        })

        // ウェイト付きシェーダーのテスト
        // SceneLoader.Append("./", "test_cube.glb", scene, function () {
        //     let foundAnimation = scene.getAnimationGroupByName("test_Armature")
        //     if (foundAnimation) {
        //         animationRef.current = foundAnimation
        //     }
        //     const testCubeMesh = scene.getMeshByName("test_Cube") as Mesh
        //     scene.debugLayer.select(testCubeMesh)
        //     var boneWeightShader = SkeletonViewer.CreateBoneWeightShader(testCubeMesh as IBoneWeightShaderOptions, scene)
        //     boneWeightShader.setFloat("targetBoneIndex", 1)
        //     testCubeMesh.material = boneWeightShader

        //     var viewer = new SkeletonViewer(testCubeMesh.skeleton as Skeleton, testCubeMesh, scene, false, 1, {
        //         displayMode: SkeletonViewer.DISPLAY_SPHERE_AND_SPURS
        //     })
        //     viewer.isEnabled = true
        // })

        if (isDebug) {
            const axesViewer = new AxesViewer(scene, 0.1)
            axesViewer.update(new Vector3(0, 0, 0), new Vector3(1, 0, 0), new Vector3(0, 1, 0), new Vector3(0, 0, 1))
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
