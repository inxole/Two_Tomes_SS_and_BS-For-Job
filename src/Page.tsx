import { useEffect, useRef } from 'react'
import { BookMark, CoverSwitch, Long_Text, Text_Switch_Automatic, Text_Switch_Freedom, TextReSize } from './atom'
import { useRecoilState, useRecoilValue } from 'recoil'
import { AnimationGroup, Scene, Skeleton, Mesh, PointerEventTypes, Vector3 } from '@babylonjs/core'
import { initializeScene } from './Babylon_Scene'
import { animationReducer, closePageAnimation, openPageAnimation, pageBackAnimation, pageFrontAnimation, ToggleAnimationHandler, useDynamicReducers } from './Functions/Action'
import { textAutoEdit } from './Text/Text_Auto'
import { textFreeEdit } from './Text/Text_Free'

const pageAmount = 101

function CanvasComponent() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const sceneRef = useRef<Scene | null>(null)
    const skeletonRefs = useRef<Skeleton[] | null>(null)
    const [text_update_F, setText_update_F] = useRecoilState(Text_Switch_Freedom)
    const [text_update_A, setText_update_A] = useRecoilState(Text_Switch_Automatic)
    const updated_text = useRecoilValue(Long_Text)
    const dispatchers = useDynamicReducers(animationReducer, { isOpen: false }, pageAmount).map(([_, dispatch]) => dispatch)
    const root_controller_BS = useRef<Mesh | null>(null)
    const root_controller_SS = useRef<Mesh | null>(null)
    const animationData = sceneRef.current?.animationGroups as AnimationGroup[]
    const [bookmark, setBookmark] = useRecoilState(BookMark)
    const coverCheck = useRecoilValue(CoverSwitch)
    const text_size = useRecoilValue(TextReSize)

    // Initialize the scene
    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        return initializeScene(canvas, sceneRef, skeletonRefs, updated_text, root_controller_BS, root_controller_SS)
    }, [])

    useEffect(() => {
        const scene = sceneRef.current
        if (!scene) return
        const tomeBS = scene.getMeshByName("Tome_BS")
        const tomeSS = scene.getMeshByName("Tome_SS")
        const control_mesh_BS = scene.getMeshByName("Root")
        const control_mesh_SS = scene.getMeshByName("Root_SS")
        if (control_mesh_BS && control_mesh_SS && tomeBS && tomeSS) {
            control_mesh_BS.parent = tomeBS
            control_mesh_SS.parent = tomeSS
            tomeBS.position = new Vector3(-0.28, 0, 0)
            tomeSS.position = new Vector3(0.28, 0, 0)
            tomeBS.rotation = new Vector3(-Math.PI / 2.25, 0, 0)
            tomeSS.rotation = new Vector3(-Math.PI / 2.25, 0, 0)
        }
    })

    // Update the text on the front page in freedom mode
    useEffect(() => {
        const scene = sceneRef.current
        if (!scene) return
        if (!text_update_F) return
        textFreeEdit(scene, updated_text, text_size)
        setText_update_F(false)
    }, [text_update_F])

    // Update the text on the front page in automatic mode
    useEffect(() => {
        const scene = sceneRef.current
        if (!scene) return
        if (!text_update_A) return
        textAutoEdit(scene, updated_text, text_size)
        setText_update_A(false)
    }, [text_update_A])

    // Update bookmark
    useEffect(() => {
        const scene = sceneRef.current
        if (!scene) return
        dispatchers.forEach((dispatch, index) => {
            if (index == 0) { // front cover toggle
                if (bookmark >= 1) {
                    dispatch({
                        type: "OPEN",
                        open: () => { openPageAnimation(animationData) },
                        close: () => { }
                    })
                    return
                }
                else {
                    dispatch({
                        type: "CLOSE",
                        open: () => { },
                        close: () => { closePageAnimation(animationData) }
                    })
                    return
                }
            }
            if (index < bookmark) {
                dispatch({
                    type: "OPEN",
                    open: () => { pageFrontAnimation(scene, index - 1), pageFrontAnimation(scene, index + 50 - 1) },
                    close: () => { console.error(`page ${index} open fail`) }
                })
            } else {
                dispatch({
                    type: "CLOSE",
                    open: () => { console.error(`page ${index} close fail`) },
                    close: () => { pageBackAnimation(scene, index - 1), pageBackAnimation(scene, index + 50 - 1) }
                })
            }
        })
    }, [bookmark])

    // Move this code to a separate useEffect
    useEffect(() => {
        const scene = sceneRef.current
        if (!scene) return
        scene.onPointerObservable.add(
            (pointerInfo) => {
                if (!(pointerInfo.type === PointerEventTypes.POINTERDOWN)) { return }
                ToggleAnimationHandler(
                    pointerInfo,
                    setBookmark,
                )
            }
        )
        return () => { scene.onPointerObservable.clear() }
    }, [])

    useEffect(() => {
        const scene = sceneRef.current
        if (!scene) return
        if (coverCheck) {
            scene.meshes.forEach(mesh => {
                if (mesh.name.includes('hitBox')) {
                    mesh.isPickable = false
                }
            })
        } else {
            scene.meshes.forEach(mesh => {
                if (mesh.name.includes('hitBox')) {
                    mesh.isPickable = true
                }
            })
        }
    }, [coverCheck])

    return <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
}

export default CanvasComponent
