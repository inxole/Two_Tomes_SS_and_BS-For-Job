import { useEffect, useReducer, useRef } from 'react'
import { useRecoilState } from 'recoil'
import { Inspector } from '@babylonjs/inspector'
import { Engine, Scene, Vector3, SkeletonViewer, Mesh, DynamicTexture, Skeleton, SceneLoader, AnimationGroup, MeshBuilder, Matrix } from '@babylonjs/core'
import { Long_Text, Pages_Number, Text_Switch } from './atom'
import { ToggleAnimationHandler, animationReducer, useDynamicReducers } from './Function_action'
import LightUp, { CameraWork } from './Function_canvas'
import attachHitBox, { GetMeshForGLB, GetSkeletonForGLB, attachHalfCylinder, mesh_BS } from './Function_glb'
import { createPage, createSkeleton } from './Function_page'

const isDebug = true
const skeletons_amount = 1
let mergedMesh: Mesh

const Canvas = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const animationRef = useRef<AnimationGroup | null>(null)
    const dispatchers = useDynamicReducers(animationReducer, false, skeletons_amount).map(([_, dispatch]) => dispatch)
    const glb_dispatcher = useReducer(animationReducer, false)
    const [text_update, setText_update] = useRecoilState(Text_Switch)
    const [meshes_amount,] = useRecoilState(Pages_Number)
    const [updated_text,] = useRecoilState(Long_Text)

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
            GetMeshForGLB(scene, "Tome_BS_primitive0")
            GetMeshForGLB(scene, "Tome_BS_primitive1")
            GetMeshForGLB(scene, "Tome_BS_primitive2")
            mergedMesh = Mesh.MergeMeshes(mesh_BS, true, true, undefined, false, true) as Mesh
            mergedMesh.isPickable = false

            if (!mergedMesh) return
            GetSkeletonForGLB(scene, mergedMesh, "BS_Armature")
            const rotateTransform = Matrix.RotationY(Math.PI / 1)
            mergedMesh.bakeTransformIntoVertices(rotateTransform)
            mergedMesh.skeleton?.bones.forEach(bone => {
                const currentMatrix = bone.getLocalMatrix()
                const newMatrix = currentMatrix.multiply(rotateTransform)
                bone.getLocalMatrix().copyFrom(newMatrix)
            })

            mergedMesh.skeleton?.bones
                .filter(bone => ['Bone.003', 'Bone.008', 'Bone.014'].includes(bone.name))
                .forEach(bone => {
                    if (bone.name === 'Bone.008') {
                        attachHalfCylinder(bone, 0.05, 0.32, new Vector3(0, 0.01, 0.012), scene, mergedMesh)
                    } else {
                        attachHitBox(bone, { width: 0.32, height: 0.23, depth: 0.02 }, new Vector3(0, -0.07, 0), scene, mergedMesh)
                    }
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
                        dispatch: glb_dispatcher[1],
                        skeleton: mergedMesh.skeleton as Skeleton,
                        pickNamePattern: new RegExp(`^Tome_hitBox_`)
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
