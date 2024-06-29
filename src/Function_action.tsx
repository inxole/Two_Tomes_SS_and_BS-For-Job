import { AnimationGroup, PointerEventTypes, PointerInfo, Scene, Skeleton } from "@babylonjs/core"
import { Reducer, useReducer } from "react"

export type Action = { type: 'TOGGLE', open: VoidFunction, close: VoidFunction }

export type ToggleAnimationSetup = {
    dispatch: React.Dispatch<Action>,
    skeleton: Skeleton,
    pickNamePattern: RegExp,
}

export function animationReducer(state: boolean, action: Action): boolean {
    switch (action.type) {
        case 'TOGGLE':
            if (state) {
                action.close()
            } else {
                action.open()
            }
            return !state
        default:
            throw new Error()
    }
}

export function ToggleAnimationHandler(
    pointerInfo: PointerInfo,
    scene: Scene,
    toggleAnimationSetups: ToggleAnimationSetup[],
    glb_animation: React.MutableRefObject<AnimationGroup | null>
) {
    if (pointerInfo.pickInfo !== null && pointerInfo.type === PointerEventTypes.POINTERDOWN) {
        for (const { dispatch, skeleton, pickNamePattern } of toggleAnimationSetups) {
            if (pointerInfo.pickInfo.hit && pickNamePattern.test(pointerInfo.pickInfo.pickedMesh?.name || "")) {
                if (pointerInfo.pickInfo.pickedMesh?.name.startsWith("hitBox_animation")) {
                    dispatch({
                        type: "TOGGLE",
                        open: () => {
                            scene.beginAnimation(skeleton, 0, 60, true, undefined, () => { })
                            console.log("open")
                        },
                        close: () => {
                            scene.beginAnimation(skeleton, 60, 120, true, undefined, () => { })
                            console.log("close")
                        }
                    })
                } else {
                    dispatch({
                        type: "TOGGLE",
                        open: () => {
                            if (glb_animation.current === null) return
                            glb_animation.current.start(true)
                            console.log("open_1")
                        },
                        close: () => {
                            if (glb_animation.current === null) return
                            glb_animation.current.stop()
                            console.log("close_1")
                        }
                    })
                }
            }
        }
    }
}

export const useDynamicReducers = (reducer: Reducer<boolean, Action>, initialState: boolean, count: number) => {
    return Array.from({ length: count }, () => useReducer(reducer, initialState))
}