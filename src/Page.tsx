import { useEffect, useRef, useReducer } from 'react'
import { useRecoilState } from 'recoil'
import { Scene, DynamicTexture, AnimationGroup } from '@babylonjs/core'
import { Long_Text, Pages_Number, Text_Switch } from './atom'
import { animationReducer, useDynamicReducers } from './Function_action'
import initializeScene from './Function_canvas'

const text_size = 22
const font = "bold " + text_size + "px monospace"

function CanvasComponent() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const sceneRef = useRef<Scene | null>(null)
    const animationRef = useRef<AnimationGroup | null>(null)
    const [meshes_amount,] = useRecoilState(Pages_Number)
    const [text_update, setText_update] = useRecoilState(Text_Switch)
    const [updated_text,] = useRecoilState(Long_Text)
    const dispatchers = useDynamicReducers(animationReducer, false, meshes_amount).map(([_, dispatch]) => dispatch)
    const glb_dispatcher = useReducer(animationReducer, false)

    // Initialize the scene
    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        return initializeScene(canvas, sceneRef, [animationRef], dispatchers, glb_dispatcher, updated_text)
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

    return <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
}

export default CanvasComponent
