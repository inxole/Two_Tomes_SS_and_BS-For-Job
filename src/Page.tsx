import { useEffect, useRef } from 'react'
import { BookMark, CoverSwitch, Long_Text, Text_Switch } from './atom'
import { useRecoilState, useRecoilValue } from 'recoil'
import { AnimationGroup, Scene, DynamicTexture, Skeleton, Mesh, PointerEventTypes } from '@babylonjs/core'
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
    const root_controller = useRef<Mesh | null>(null)
    const animationData = sceneRef.current?.animationGroups as AnimationGroup[]
    const [bookmark, setBookmark] = useRecoilState(BookMark)
    const coverCheck = useRecoilValue(CoverSwitch)

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

        const front_textures_info = []
        const back_textures_info = []
        const front_textures = []
        const back_textures = []
        const pageLimit = 50

        // Get texture for each page
        for (let i = 0; i < pageLimit; i++) {
            front_textures_info.push(scene.getMeshByName('front_page_' + i)?.material?.getActiveTextures())
            front_textures.push(front_textures_info[i]?.values().next().value as DynamicTexture)
            back_textures_info.push(scene.getMeshByName('back_page_' + i)?.material?.getActiveTextures())
            back_textures.push(back_textures_info[i]?.values().next().value as DynamicTexture)
        }

        const max_chars_per_line = 25// Maximum number of characters in one line
        const max_lines_per_page = 18// Maximum number of lines per page
        const lines = []
        let textField = ""
        let text = ""
        const labelHeight = 1.5 * text_size

        for (let i = 0; i < updated_text.length; i++) {
            textField += updated_text[i]
            if (textField.length >= max_chars_per_line || updated_text[i] === '\n') {
                lines.push(textField)
                textField = ""
            }
        }
        if (textField.length > 0) { lines.push(textField) }

        let currentPage = 0
        let lineIndex = 0
        while (currentPage < pageLimit) {
            const front_texture = front_textures[currentPage]
            const back_texture = back_textures[currentPage]

            front_texture.clear()
            back_texture.clear()
            front_texture.drawText("", 0, 0, font, "black", "white", true, true)
            back_texture.drawText("", 0, 0, font, "black", "white", true, true)

            let line = labelHeight

            // draw on front_page
            for (let i = 0; i < max_lines_per_page && lineIndex < lines.length; i++) {
                text = lines[lineIndex]
                front_texture.drawText(text, 40, line, font, "black", null, true, true)
                line += labelHeight - 6
                lineIndex++
            }

            // draw on back_page
            if (lineIndex < lines.length) {
                line = labelHeight
                for (let i = 0; i < max_lines_per_page && lineIndex < lines.length; i++) {
                    text = lines[lineIndex]
                    back_texture.drawText(text, 10, line, font, "black", null, true, true)
                    back_texture.vAng = Math.PI
                    line += labelHeight - 6
                    lineIndex++
                }
            }
            currentPage++
        }
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
                        open: () => {
                            openPageAnimation(animationData)
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
                    },
                    close: () => { console.error(`page ${index} open fail`) }
                })
            } else {
                dispatch({
                    type: "CLOSE",
                    open: () => { console.error(`page ${index} close fail`) },
                    close: () => {
                        pageBackAnimation(scene, index - 1)
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
                if (!(pointerInfo.type === PointerEventTypes.POINTERDOWN)) { return }
                ToggleAnimationHandler(
                    pointerInfo,
                    setBookmark,
                )
            }
        )

        return () => {
            scene.onPointerObservable.clear()
        }
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
