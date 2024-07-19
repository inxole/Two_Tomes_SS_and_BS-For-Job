import { useEffect, useRef, useReducer } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { Scene, DynamicTexture, Skeleton } from '@babylonjs/core'
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

    // Initialize the scene
    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        return initializeScene(canvas, sceneRef, skeletonRefs, dispatchers, glb_dispatcher, updated_text)
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

        console.log(skeletonRefs.current)// 初期状態のskeletonRefsを一度だけログに出力する

        dispatchers.forEach((dispatch, index) => {
            if (bookmark <= index) {
                dispatch({
                    type: "TOGGLE",
                    open: () => {
                        if (skeletonRefs.current && skeletonRefs.current[index]) {
                            scene.beginAnimation(skeletonRefs.current[index], 0, 60, true, undefined, () => { })
                        }
                    },
                    close: () => {
                        if (skeletonRefs.current && skeletonRefs.current[index]) {
                            scene.beginAnimation(skeletonRefs.current[index], 60, 120, true, undefined, () => { })
                        }
                    }
                })
            }
        })
    }, [bookmark])


    return <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
}

export default CanvasComponent
