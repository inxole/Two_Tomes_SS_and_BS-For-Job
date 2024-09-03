import { useEffect, useRef } from 'react'
import { BookMark, CoverSwitch, Long_Text, Text_Switch, TextReSize } from './atom'
import { useRecoilState, useRecoilValue } from 'recoil'
import { AnimationGroup, Scene, Skeleton, Mesh, PointerEventTypes } from '@babylonjs/core'
import { initializeScene } from './Babylon_Scene'
import { animationReducer, closePageAnimation, openPageAnimation, pageBackAnimation, pageFrontAnimation, ToggleAnimationHandler, useDynamicReducers } from './Functions/Action'
import { updatePageTextures } from './Functions/Latest_Text'

const pageAmount = 51

function CanvasComponent() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const sceneRef = useRef<Scene | null>(null)
    const skeletonRefs = useRef<Skeleton[] | null>(null)
    const [text_update, setText_update] = useRecoilState(Text_Switch)
    const updated_text = useRecoilValue(Long_Text)
    const dispatchers = useDynamicReducers(animationReducer, { isOpen: false }, pageAmount).map(([_, dispatch]) => dispatch)
    const root_controller = useRef<Mesh | null>(null)
    const animationData = sceneRef.current?.animationGroups as AnimationGroup[]
    const [bookmark, setBookmark] = useRecoilState(BookMark)
    const coverCheck = useRecoilValue(CoverSwitch)
    const text_size = useRecoilValue(TextReSize)

    // Initialize the scene
    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        return initializeScene(canvas, sceneRef, skeletonRefs, updated_text, root_controller)
    }, [])

    // Update the text on the front page
    useEffect(() => {
        const scene = sceneRef.current
        if (!scene) return
        if (!text_update) return
        updatePageTextures(scene, updated_text, text_size)
        setText_update(false)
    }, [text_update])

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
                    open: () => { pageFrontAnimation(scene, index - 1) },
                    close: () => { console.error(`page ${index} open fail`) }
                })
            } else {
                dispatch({
                    type: "CLOSE",
                    open: () => { console.error(`page ${index} close fail`) },
                    close: () => { pageBackAnimation(scene, index - 1) }
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
