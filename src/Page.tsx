import { useEffect, useRef, useReducer } from 'react'
import { BookMark, CoverOpen, Long_Text, Text_Switch } from './atom'
import { useRecoilState, useRecoilValue } from 'recoil'
import { AnimationGroup, Scene, DynamicTexture, Skeleton, Mesh } from '@babylonjs/core'
import { initializeScene } from './Babylon_Scene'
import { animationReducer, closePageAnimation, openPageAnimation, ToggleAnimationHandler, useDynamicReducers } from './Functions/Action'

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
    const coverSwitchRef = useRef(false)

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
            if (index < bookmark - 1) {
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

        if (!animationData) return
        if (bookmark > 0 && bookmark === 1) {
            openPageAnimation(animationData)
            console.debug("cover open")
        } else if (bookmark < 0 && bookmark === 0) {
            closePageAnimation(animationData)
            console.debug("cover close")
        }
        //  else {}
    }, [bookmark])

    // Preventing unnecessary triggers
    useEffect(() => {
        coverSwitchRef.current = coverSwitch
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
                    dispatchers,
                    glb_dispatcher,
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
