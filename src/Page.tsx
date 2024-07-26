import { useEffect, useRef, useReducer } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { Scene, DynamicTexture, Skeleton, Mesh } from '@babylonjs/core'
import { BookMark, Long_Text, Text_Switch } from './atom'
import { animationReducer, useDynamicReducers } from './Function_action'
import initializeScene from './Function_canvas'

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
    const bookmark = useRecoilValue(BookMark)
    const root_controller = useRef<Mesh | null>(null)
    const animationData = sceneRef.current?.animationGroups
    const previousBookmark = useRef(bookmark)
    console.log(animationData)
    // Initialize the scene
    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        return initializeScene(canvas, sceneRef, skeletonRefs, dispatchers, glb_dispatcher, updated_text, root_controller)
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

        if (animationData) {
            switch (true) {
                case (bookmark === 0 && previousBookmark.current === 1)://済み
                    animationData[0]?.stop()
                    animationData[10]?.stop()
                    animationData[1]?.play(true)
                    animationData[11]?.play(true)
                    animationData[8]?.play(true)
                    setTimeout(() => { animationData[11]?.stop() }, 1000)
                    break
                case (bookmark > 0 && previousBookmark.current === 0):
                    animationData[9]?.play(true)
                    animationData[0]?.play(true)
                    setTimeout(() => { animationData[9]?.stop() }, 1000)
                    setTimeout(() => { animationData[10]?.start(true) }, 1000)
                    break
                case (bookmark < 11 && previousBookmark.current === 11):
                    animationData[2]?.stop()
                    animationData[13]?.stop()
                    animationData[3]?.play(true)
                    animationData[14]?.play(true)
                    setTimeout(() => { animationData[14]?.stop() }, 1000)
                    break

                case (bookmark > 10 && previousBookmark.current === 10):
                    animationData[12]?.play(true)
                    animationData[2]?.play(true)
                    setTimeout(() => { animationData[12]?.stop() }, 1000)
                    setTimeout(() => { animationData[13]?.play(true) }, 1000)
                    break

                case (bookmark < 25 && previousBookmark.current === 25):
                    animationData[5]?.stop()
                    animationData[17]?.stop()
                    animationData[6]?.play(true)
                    animationData[18]?.play(true)
                    setTimeout(() => { animationData[18]?.stop() }, 1000)
                    break

                case (bookmark > 25 && previousBookmark.current === 25):
                    animationData[16]?.play(true)
                    animationData[5]?.play(true)
                    setTimeout(() => { animationData[16]?.stop() }, 1000)
                    setTimeout(() => { animationData[17]?.play(true) }, 1000)
                    break
                default:
                    break
            }
        }
        previousBookmark.current = bookmark
    }, [bookmark])

    return <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
}

export default CanvasComponent
