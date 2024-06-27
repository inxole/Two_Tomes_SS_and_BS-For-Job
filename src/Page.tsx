import React, { Reducer, useEffect, useReducer, useRef } from 'react'
import { Engine, Scene, Vector3, SkeletonViewer, PointerInfo, PointerEventTypes, Mesh, DynamicTexture, Skeleton, SceneLoader, AnimationGroup, MeshBuilder, Matrix, Color3 } from '@babylonjs/core'
import { useRecoilState } from 'recoil'
import { Inspector } from '@babylonjs/inspector'
import { Long_Text, Pages_Number, Text_Switch } from './atom'
import { CameraWork, LightUp, createHitBoxMaterial, createPage, createSkeleton } from './Canvas_Function'

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

function ToggleAnimationHandler(pointerInfo: PointerInfo, scene: Scene, toggleAnimationSetups: ToggleAnimationSetup[], glb_animation: React.MutableRefObject<AnimationGroup | null>) {
    if (pointerInfo.pickInfo !== null && pointerInfo.type === PointerEventTypes.POINTERDOWN) {
        for (const { dispatch, skeleton, pickNamePattern } of toggleAnimationSetups) {
            if (pointerInfo.pickInfo.hit && pickNamePattern.test(pointerInfo.pickInfo.pickedMesh?.name || "")) {
                if (pointerInfo.pickInfo.pickedMesh?.name.startsWith("hitBox_animation")) {
                    dispatch({
                        type: "TOGGLE",
                        open: () => {
                            scene.beginAnimation(skeleton, 0, 60, true, undefined, () => { })
                            console.log("open")
                        },
                        close: () => {
                            scene.beginAnimation(skeleton, 60, 120, true, undefined, () => { })
                            console.log("close")
                        }
                    })
                } else {
                    dispatch({
                        type: "TOGGLE",
                        open: () => {
                            if (glb_animation.current === null) return
                            glb_animation.current.start(true)
                            console.log("open_1")
                        },
                        close: () => {
                            if (glb_animation.current === null) return
                            glb_animation.current.stop()
                            console.log("close_1")
                        }
                    })
                }
            }
        }
    }
}

const useDynamicReducers = (reducer: Reducer<boolean, Action>, initialState: boolean, count: number) => {
    return Array.from({ length: count }, () => useReducer(reducer, initialState))
}

const isDebug = true
const skeletons_amount = 1
const mesh_BS: Mesh[] = []
let mergedMesh: Mesh

function GetMeshFromeGLB(scene: Scene, name: string) {
    let mesh = scene.getMeshByName(name)
    if (mesh === null) { throw new Error(`Mesh ${name} not found`) }
    mesh_BS.push(mesh as Mesh)
}

function GetSkeletonFromeGLB(scene: Scene, mesh: Mesh, name: string) {
    mesh.skeleton = scene.getSkeletonByName(name)
}

const Canvas = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const [text_update, setText_update] = useRecoilState(Text_Switch)
    const [meshes_amount,] = useRecoilState(Pages_Number)
    const [updated_text,] = useRecoilState(Long_Text)
    const dispatchers = useDynamicReducers(animationReducer, false, skeletons_amount).map(([_, dispatch]) => dispatch)
    const dispatcher1 = useReducer(animationReducer, false)

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

        SceneLoader.Append("./", "Tome_BS.glb", scene, function () {
            animationRef.current = scene.getAnimationGroupByName("1_BS_action_15")
            GetMeshFromeGLB(scene, "Tome_BS_primitive0")
            GetMeshFromeGLB(scene, "Tome_BS_primitive1")
            GetMeshFromeGLB(scene, "Tome_BS_primitive2")
            mergedMesh = Mesh.MergeMeshes(mesh_BS, true, true, undefined, false, true) as Mesh
            mergedMesh.isPickable = false

            if (!mergedMesh) return
            GetSkeletonFromeGLB(scene, mergedMesh, "BS_Armature")
            const rotateTransform = Matrix.RotationY(Math.PI / 1)
            mergedMesh.bakeTransformIntoVertices(rotateTransform)
            mergedMesh.skeleton?.bones.forEach(bone => {
                const currentMatrix = bone.getLocalMatrix()
                const newMatrix = currentMatrix.multiply(rotateTransform)
                bone.getLocalMatrix().copyFrom(newMatrix)
            })

            mergedMesh.skeleton?.bones
                .filter(bone => /^Bone(\.0?1[0-9]|\.00[1-9])?$/.test(bone.name))
                .map(bone => {
                    const test_hitBox = MeshBuilder.CreateBox(`test_hitBox_${bone.name}`, { width: 0.02, height: 0.02, depth: 0.2 }, scene)
                    test_hitBox.material = createHitBoxMaterial(scene, bone.name, new Color3(0.7, 0.2, 0.7))
                    test_hitBox.attachToBone(bone, scene.meshes[0])
                    test_hitBox.position = new Vector3(0, 0, 0)
                })
            if (mergedMesh.skeleton !== null) {
                const skeletonViewer = new SkeletonViewer(mergedMesh.skeleton, mergedMesh, scene, false, 3, {
                    displayMode: SkeletonViewer.DISPLAY_SPHERE_AND_SPURS
                })
                skeletonViewer.isEnabled = true
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
            (pointerInfo) => ToggleAnimationHandler(pointerInfo, scene,
                [
                    ...pageSkeletons.map((pageSkeleton, i) => ({
                        dispatch: dispatchers[i],
                        skeleton: pageSkeleton,
                        pickNamePattern: new RegExp(`^hitBox_animation${i + 1}_`)
                    })),
                    {
                        dispatch: dispatcher1[1],
                        skeleton: mergedMesh.skeleton as Skeleton,
                        pickNamePattern: new RegExp(`^test_hitBox_`)
                    }
                ],
                animationRef
            )
        )

        engine.runRenderLoop(() => { scene.render() })
        const resize = () => { engine.resize() }
        window.addEventListener('resize', resize)
        return () => {
            engine.dispose()
            window.removeEventListener('resize', resize)
        }
    }, [text_update, meshes_amount])

    return <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
}

export default Canvas
