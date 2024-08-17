import { useEffect, useRef, useReducer } from 'react'
import { BookMark, Long_Text, Text_Switch } from './atom'
import { useRecoilState, useRecoilValue } from 'recoil'
import { AnimationGroup, Scene, DynamicTexture, Skeleton, Mesh } from '@babylonjs/core'
import { initializeScene } from './Babylon_Scene'
import { animationReducer, closePageAnimation, openPageAnimation, ToggleAnimationHandler, useDynamicReducers } from './Functions/Action'

const text_size = 22
const pageAmount = 51
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
    const bookmarkRef = useRef(bookmark)

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
        const scene = sceneRef.current
        if (!scene) return
        dispatchers.forEach((dispatch, index) => {
            // console.info("bookmark: ", bookmark, ", index: ", index)
            if (index == 0) { // front cover toggle
                if (bookmark >= 1) {

                    dispatch({
                        type: "OPEN",
                        open: () => {
                            openPageAnimation(animationData)
                            console.debug("cover open")
                        },
                        close: () => { console.error("open cover error") }
                    })
                    return
                }
                else {
                    dispatch({
                        type: "CLOSE",
                        open: () => { console.error("close cover fail") },
                        close: () => {
                            closePageAnimation(animationData)
                            console.debug("cover close")
                        }
                    })
                    return
                }
            }

            if (index < bookmark) {
                dispatch({
                    type: "OPEN",
                    open: () => {
                        pageFrontAnimation(scene, index - 1)
                        console.debug(`page ${index} open`)
                    },
                    close: () => { console.error(`page ${index} open fail`) }
                })
            } else {
                dispatch({
                    type: "CLOSE",
                    open: () => { console.error(`page ${index} close fail`) },
                    close: () => {
                        pageBackAnimation(scene, index - 1)
                        console.log(`page ${index} close`)
                    }
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
                ToggleAnimationHandler(
                    pointerInfo,
                    scene,
                    dispatchers,
                    glb_dispatcher,
                    bookmarkRef,
                )

                setBookmark(bookmarkRef.current)
            }
        )

        return () => {
            scene.onPointerObservable.clear()
        }
    }, [setBookmark])

    return <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
}

function pageFrontAnimation(scene: Scene, index: number) {
    const page = scene.skeletons.find((skeleton) => skeleton.name === 'skeleton_' + index)
    if (!page) return
    scene.beginAnimation(page, 0, 60, true, undefined, () => { })
}

function pageBackAnimation(scene: Scene, index: number) {
    const page = scene.skeletons.find((skeleton) => skeleton.name === 'skeleton_' + index)
    if (!page) return
    scene.beginAnimation(page, 60, 120, true, undefined, () => { })
}

export default CanvasComponent
