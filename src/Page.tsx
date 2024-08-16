import React, { useEffect, useRef, useReducer } from 'react'
import { BookMark, CoverOpen, Long_Text, Text_Switch } from './atom'
import { useRecoilState, useRecoilValue } from 'recoil'
import { AnimationGroup, Scene, DynamicTexture, Skeleton, Mesh } from '@babylonjs/core'
import { initializeScene } from './Babylon_Scene'
import { animationReducer, ToggleAnimationHandler, useDynamicReducers } from './Functions/Acction'
import { mergedMesh } from './Functions/Tome_BS'

const text_size = 22
const pageAmount = 50
const font = "bold " + text_size + "px monospace"

function CanvasComponent() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const sceneRef = useRef<Scene | null>(null)
    const skeletonRefs = useRef<Skeleton[] | null>(null)
    const [text_update, setText_update] = useRecoilState(Text_Switch)
    const updated_text = useRecoilValue(Long_Text)
    const dispatchers = useDynamicReducers(animationReducer, { isOpen: false }, pageAmount).map(([_, dispatch]) => dispatch)
    const glb_dispatcher = useReducer(animationReducer, { isOpen: false })
    const root_controller = useRef<Mesh | null>(null)
    const animationData = sceneRef.current?.animationGroups as AnimationGroup[]
    const [bookmark, setBookmark] = useRecoilState(BookMark)
    const [coverSwitch, setCoverSwitch] = useRecoilState(CoverOpen)
    const bookmarkRef = useRef(bookmark)
    const animationRefs: React.MutableRefObject<AnimationGroup | null>[] = []
    const coverSwitchRef = useRef(false)

    // Initialize the scene
    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        return initializeScene(canvas, sceneRef, skeletonRefs, updated_text, root_controller, animationRefs)
    }, [])

    // Update the text on the front page
    useEffect(() => {
        const scene = sceneRef.current
        if (!scene) return

        const front_texture_info = scene.getMeshByName('front_page_0')?.material?.getActiveTextures()
        const front_texture = front_texture_info?.values().next().value as DynamicTexture
        if (!text_update) return

        front_texture.clear()
        front_texture.drawText(updated_text, 0, text_size, font, "#000000", "#ffffff", true)
        setText_update(false)

    }, [text_update])

    // Update bookmark
    useEffect(() => {
        bookmarkRef.current = bookmark
        const scene = sceneRef.current
        if (!scene) return
        dispatchers.forEach((dispatch, index) => {
            if (index < bookmark) {
                dispatch({
                    type: "OPEN",
                    open: () => {
                        if (skeletonRefs.current && skeletonRefs.current[index]) {
                            scene.beginAnimation(skeletonRefs.current[index], 0, 60, true, undefined, () => { })
                        }
                    },
                    close: () => { }
                })
            } else {
                dispatch({
                    type: "CLOSE",
                    open: () => { },
                    close: () => {
                        if (skeletonRefs.current && skeletonRefs.current[index]) {
                            scene.beginAnimation(skeletonRefs.current[index], 60, 120, true, undefined, () => { })
                        }
                    }
                })
            }
        })
    }, [bookmark])

    // Switch Cover
    useEffect(() => {
        const scene = sceneRef.current
        if (!scene) return
        if (animationData) {
            switch (true) {
                case (coverSwitch):
                    animationData[4]?.start(true), animationData[5]?.stop()
                    animationData[7]?.start(true), animationData[9]?.stop()
                    setTimeout(() => { animationData[7]?.stop() }, 1000)
                    setTimeout(() => { animationData[8]?.start(true) }, 1000)
                    animationData[0]?.start(true), animationData[1]?.stop()
                    animationData[2]?.start(true), animationData[3]?.stop()
                    break
                case (!coverSwitch):
                    animationData[5]?.start(true), animationData[4]?.stop()
                    animationData[9]?.start(true), animationData[7]?.stop()
                    setTimeout(() => { animationData[9]?.stop() }, 1000)
                    animationData[8]?.stop()
                    animationData[1]?.start(true), animationData[0]?.stop()
                    animationData[3]?.start(true), animationData[2]?.stop()
                    break
                default:
                    break
            }
        }
    }, [coverSwitch])

    // Move this code to a separate useEffect
    useEffect(() => {
        const scene = sceneRef.current
        if (!scene) return

        scene.onPointerObservable.add(
            (pointerInfo) => {
                ToggleAnimationHandler(
                    pointerInfo,
                    scene,
                    [
                        ...skeletonRefs.current!.map((pageSkeleton, i) => ({
                            dispatch: dispatchers[i],
                            skeleton: pageSkeleton,
                            pickNamePattern: new RegExp(`^hitBox_animation${i}_`)
                        })),
                        {
                            dispatch: glb_dispatcher[1],
                            skeleton: mergedMesh.skeleton as Skeleton,
                            pickNamePattern: new RegExp(`^Tome_hitBox_`)
                        }
                    ],
                    animationRefs,
                    bookmarkRef,
                    coverSwitchRef
                )

                setBookmark(bookmarkRef.current)
                setCoverSwitch(coverSwitchRef.current)
            }
        )

        return () => {
            scene.onPointerObservable.clear()
        }
    }, [setBookmark, setCoverSwitch])

    return <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
}

export default CanvasComponent
