import { AnimationGroup, PointerEventTypes, PointerInfo, Scene, Skeleton } from "@babylonjs/core"
import { Reducer, useReducer } from "react"

export type Action = { type: string, open: VoidFunction, close: VoidFunction }
export type PageState = { isOpen: boolean }

export type ToggleAnimationSetup = {
    dispatch: React.Dispatch<Action>,
    skeleton: Skeleton,
    pickNamePattern: RegExp,
}

export function animationReducer(state: PageState, action: Action): PageState {
    switch (action.type) {
        case 'TOGGLE':
            if (state.isOpen) { action.close() }
            else { action.open() }
            return { isOpen: !state.isOpen }
        case 'OPEN':
            if (!state.isOpen) { action.open() }
            return { isOpen: true }
        case 'CLOSE':
            if (state.isOpen) { action.close() }
            return { isOpen: false }
        default:
            throw new Error()
    }
}

export function ToggleAnimationHandler(
    pointerInfo: PointerInfo,
    scene: Scene,
    toggleAnimationSetups: ToggleAnimationSetup[],
    glb_animation: React.MutableRefObject<AnimationGroup | null>[]
) {
    if (pointerInfo.pickInfo !== null && pointerInfo.type === PointerEventTypes.POINTERDOWN) {
        for (const { dispatch, skeleton, pickNamePattern } of toggleAnimationSetups) {
            if (pointerInfo.pickInfo.hit && pickNamePattern.test(pointerInfo.pickInfo.pickedMesh?.name || "")) {
                if (pointerInfo.pickInfo.pickedMesh?.name.startsWith("hitBox_animation")) {
                    dispatch({
                        type: "TOGGLE",
                        open: () => { scene.beginAnimation(skeleton, 0, 60, true, undefined, () => { }) },
                        close: () => { scene.beginAnimation(skeleton, 60, 120, true, undefined, () => { }) }
                    })
                } else {
                    dispatch({
                        type: "TOGGLE",
                        open: () => {
                            glb_animation[2].current?.start(true), glb_animation[3].current?.stop()
                            glb_animation[5].current?.start(true), glb_animation[7].current?.stop()
                            setTimeout(() => { glb_animation[6]?.current?.start(true) }, 1000)
                            setTimeout(() => { glb_animation[5]?.current?.stop() }, 1000)
                            setTimeout(() => { glb_animation[0]?.current?.start(true) }, 1000)
                            glb_animation[1].current?.stop()
                        },
                        close: () => {
                            glb_animation[3].current?.start(true), glb_animation[2].current?.stop()
                            glb_animation[7].current?.start(true), glb_animation[5].current?.stop()
                            setTimeout(() => { glb_animation[7]?.current?.stop() }, 1000)
                            glb_animation[6].current?.stop()
                            setTimeout(() => { glb_animation[1]?.current?.start(true) }, 1000)
                            glb_animation[0].current?.stop()
                        }
                    })
                }
            }
        }
    }
}

export function useDynamicReducers(reducer: Reducer<PageState, Action>, initialState: PageState, count: number) {
    return Array.from({ length: count }, () => useReducer(reducer, initialState))
}
