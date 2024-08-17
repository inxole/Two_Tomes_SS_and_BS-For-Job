import { AnimationGroup, PointerEventTypes, PointerInfo, Scene, Skeleton } from "@babylonjs/core"
import { Reducer, useReducer } from "react"
import { BookCover } from './Tome_BS'

export type Action = { type: string, open: VoidFunction, close: VoidFunction }
export type PageState = { isOpen: boolean }

export type ToggleAnimationSetup = {
    dispatch: React.Dispatch<Action>,
    skeleton: Skeleton,
    pickNamePattern: RegExp,
}

/**
 * animation reducer for page state
 * @param state boolean
 * @param action action trigger
 * @returns state
 */
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

let isAnimationPlaying = false
/**
 * mouse event handler for animation toggle
 * @param pointerInfo on pointer event
 * @param scene add to scene
 * @param animationData animation group reference
 */
export function ToggleAnimationHandler(
    pointerInfo: PointerInfo,
    scene: Scene,
    dispatchers: React.Dispatch<Action>[],
    glb_dispatcher: [PageState, React.Dispatch<Action>],
    bookmarkRef: React.MutableRefObject<number>,
) {
    const skeletonRefs = scene.skeletons as Skeleton[]
    const toggleAnimationSetups: ToggleAnimationSetup[] = [
        ...skeletonRefs.map((skeleton, index) => ({
            dispatch: dispatchers[index],
            skeleton: skeleton,
            pickNamePattern: new RegExp(`^hitBox_animation${index}`)
        })),
        {
            dispatch: glb_dispatcher[1],
            skeleton: BookCover.skeleton as Skeleton,
            pickNamePattern: new RegExp(`^Tome_hitBox`)
        }
    ];
    const animationData = scene.animationGroups as AnimationGroup[]
    if (isAnimationPlaying) { return }
    if (pointerInfo.pickInfo !== null && pointerInfo.type === PointerEventTypes.POINTERDOWN) {
        for (const { dispatch, skeleton, pickNamePattern } of toggleAnimationSetups) {
            if (pointerInfo.pickInfo.hit && pickNamePattern.test(pointerInfo.pickInfo.pickedMesh?.name || "")) {
                if (pointerInfo.pickInfo.pickedMesh?.name.startsWith(`hitBox_animation${bookmarkRef.current}`)) {
                    dispatch({
                        type: "OPEN",
                        open: () => {
                            scene.beginAnimation(skeleton, 0, 60, true, undefined, () => {
                                bookmarkRef.current += 1
                            })
                        },
                        close: () => { }
                    })
                } else if (pointerInfo.pickInfo.pickedMesh?.name.startsWith(`hitBox_animation${bookmarkRef.current - 1}`)) {
                    dispatch({
                        type: "CLOSE",
                        open: () => { },
                        close: () => {
                            scene.beginAnimation(skeleton, 60, 120, true, undefined, () => { })
                            bookmarkRef.current -= 1
                        }
                    })
                } else if (bookmarkRef.current === 0 && !isAnimationPlaying && !pointerInfo.pickInfo.pickedMesh?.name.startsWith(`hitBox_animation`)) {
                    dispatch({
                        type: "TOGGLE",
                        open: () => {
                            isAnimationPlaying = true

                            openPageAnimation(animationData)

                            const AD = AnimationDictionary
                            animationData[AD.BS_action_0_90].onAnimationEndObservable.addOnce(() => {
                                isAnimationPlaying = false
                            })
                        },
                        close: () => {
                            isAnimationPlaying = true

                            closePageAnimation(animationData)

                            const AD = AnimationDictionary
                            animationData[AD.BS_action_back]?.onAnimationEndObservable.addOnce(() => {
                                isAnimationPlaying = false
                            })
                        }
                    })
                } else { return }
            }
        }
    }
}

/**
 * Open page animation
 * @param animationData animation group reference
 * @returns void
 */
export function openPageAnimation(animationData: AnimationGroup[]) {
    const AD = AnimationDictionary
    // Open/switch cover
    animationData[AD.N_0_90_Group].start(true), animationData[AD.R_90_0_Group].stop()
    animationData[AD.BS_action_0_90].start(true), animationData[AD.BS_action_back].stop()

    setTimeout(() => { animationData[AD.BS_action_0_90].stop() }, 1000) // Repeat prevention
    setTimeout(() => { animationData[AD.BS_stay_90].start(true) }, 1000) // Start holding

    // Move pages all at once and switch
    animationData[AD.N_Controller].start(true), animationData[AD.R_Controller].stop()
    animationData[AD.N_Animation_Group].start(true), animationData[AD.R_Animation_Group].stop()
}

export function closePageAnimation(animationData: AnimationGroup[]) {
    const AD = AnimationDictionary
    // Close/switch cover
    animationData[AD.R_90_0_Group].start(true), animationData[AD.N_0_90_Group].stop()
    animationData[AD.BS_action_back].start(true), animationData[AD.BS_action_0_90].stop()

    setTimeout(() => { animationData[AD.BS_action_back]?.stop() }, 1000) // Repeat prevention
    animationData[AD.BS_stay_90].stop() // Stop holding

    // Move pages all at once and switch
    animationData[AD.R_Controller].start(true), animationData[AD.N_Controller].stop()
    animationData[AD.R_Animation_Group].start(true), animationData[AD.N_Animation_Group].stop()
}

export function useDynamicReducers(reducer: Reducer<PageState, Action>, initialState: PageState, count: number) {
    return Array.from({ length: count }, () => useReducer(reducer, initialState))
}

//glb_animationの内訳
// 0: Object { name: "N_Controller", _from: 1000, _to: 1060, … }
// 1: Object { name: "R_Controller", _from: 1060, _to: 1120, … }
// 2: Object { name: "N_Animation_Group", _from: 1000, _to: 1050, … }
// 3: Object { name: "R_Animation_Group", _from: 1050, _to: 1100, … }
// 4: Object { name: "N_0_90_Group", _from: 0, _to: 50, … }
// 5: Object { name: "R_90_0_Group", _from: 0, _to: 50, … }
// 6: Object { name: "000_BS_Non_Action", _from: 0, _to: 600, … } Do not use as it is the initial value
// 7: Object { name: "001_BS_action_0_90", _from: 0, _to: 600, … }
// 8: Object { name: "002_BS_stay_90", _from: 0, _to: 600, … }
// 9: Object { name: "003_BS_action_back", _from: 0, _to: 600, … }


export enum AnimationDictionary {
    N_Controller = 0,
    R_Controller = 1,
    N_Animation_Group = 2,
    R_Animation_Group = 3,
    N_0_90_Group = 4,
    R_90_0_Group = 5,
    BS_Non_Action = 6,
    BS_action_0_90 = 7,
    BS_stay_90 = 8,
    BS_action_back = 9,
}
