import { useEffect, useRef, useReducer } from 'react'
import { BookMark, CoverOpen, Long_Text, Text_Switch } from './atom'
import { useRecoilState, useRecoilValue } from 'recoil'
import { Scene, DynamicTexture, Skeleton, Mesh } from '@babylonjs/core'
import { initializeScene } from './Babylon_Scene'
import { animationReducer, useDynamicReducers } from './Functions/Acction'

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
    const coverSwitch = useRecoilValue(CoverOpen)

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
    }, [bookmark])

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

    return <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
}

export default CanvasComponent
