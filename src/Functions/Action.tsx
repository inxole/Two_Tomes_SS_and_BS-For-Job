import { AnimationGroup, PointerInfo, Scene, Skeleton } from "@babylonjs/core"
import { Reducer, useReducer } from "react"
import { SetterOrUpdater } from "recoil"

export type Action = { type: string, open?: VoidFunction, close?: VoidFunction }
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
            if (state.isOpen) { action.close ? action.close() : {} }
            else { action.open ? action.open() : {} }
            return { isOpen: !state.isOpen }
        case 'OPEN':
            if (!state.isOpen) { action.open ? action.open() : {} }
            return { isOpen: true }
        case 'CLOSE':
            if (state.isOpen) { action.close ? action.close() : {} }
            return { isOpen: false }
        default:
            throw new Error()
    }
}

/**
 * mouse event handler for animation toggle
 * @param pointerInfo on pointer event
 * @param scene add to scene
 * @param animationData animation group reference
 */
export function ToggleAnimationHandler(
    pointerInfo: PointerInfo,
    setBookmark: SetterOrUpdater<number>,
) {
    if (!pointerInfo.pickInfo) { return }
    if (!pointerInfo.pickInfo.hit) { return }
    const name = pointerInfo.pickInfo.pickedMesh?.name || ""
    if (name == "") { return }
    const prefix = "animation"
    const splitted = name.split('_')[1]
    const cuttedNumber = splitted.substring(prefix.length)
    const hitBoxNumber: number = parseInt(cuttedNumber)
    setBookmark(previous => {
        if (previous == hitBoxNumber + 1 || previous == hitBoxNumber - 50 + 1) {
            return previous + 1
        } else if (previous == hitBoxNumber + 2 || previous == hitBoxNumber - 50 + 2) {
            return previous - 1
        } else if (previous === 0) {
            return previous + 1
        } else if (previous === 1) {
            return previous - 1
        } else {
            return previous
        }
    })
}

export function useDynamicReducers(reducer: Reducer<PageState, Action>, initialState: PageState, count: number) {
    return Array.from({ length: count }, () => useReducer(reducer, initialState))
}

/**
 * Open page animation
 * @param sortedAnimationData animation group reference
 * @returns void
 */
export function openPageAnimation(animationData: AnimationGroup[]) {
    const AD = AnimationDictionary
    const sortedAnimationData = [...animationData].sort((a, b) => a.name.localeCompare(b.name))

    // Open/switch cover
    sortedAnimationData[AD.F_0_90_Group].start(true), sortedAnimationData[AD.R_90_0_Group].stop()
    sortedAnimationData[AD.SS_F_0_90_Group].start(true), sortedAnimationData[AD.SS_R_90_0_Group].stop()
    sortedAnimationData[AD.BS_Action_0_90].start(true), sortedAnimationData[AD.BS_Non_Action].stop()
    sortedAnimationData[AD.SS_Action_0_90].start(true), sortedAnimationData[AD.SS_Non_Action].stop()

    setTimeout(() => { sortedAnimationData[AD.BS_Action_0_90].stop() }, 1000) // Tome_BS Repeat prevention
    setTimeout(() => { sortedAnimationData[AD.BS_Stay_90].start() }, 1000) // Tome_BS Start holding
    setTimeout(() => { sortedAnimationData[AD.SS_Action_0_90].stop() }, 1000) // Tome_SS Repeat prevention
    setTimeout(() => { sortedAnimationData[AD.SS_Stay_90].start() }, 1000) // Tome_SS Start holding

    // Move pages all at once and switch
    sortedAnimationData[AD.F_Controller].start(true), sortedAnimationData[AD.R_Controller].stop()
    sortedAnimationData[AD.F_Animation_Group].start(true), sortedAnimationData[AD.R_Animation_Group].stop()

    sortedAnimationData[AD.TargetCam].start(false, 1, 0, 30)
}

export function closePageAnimation(animationData: AnimationGroup[]) {
    const AD = AnimationDictionary
    const sortedAnimationData = [...animationData].sort((a, b) => a.name.localeCompare(b.name))

    // Close/switch cover
    sortedAnimationData[AD.R_90_0_Group].start(true), sortedAnimationData[AD.F_0_90_Group].stop()
    sortedAnimationData[AD.SS_R_90_0_Group].start(true), sortedAnimationData[AD.SS_F_0_90_Group].stop()
    sortedAnimationData[AD.BS_Action_back].start(true), sortedAnimationData[AD.BS_Action_0_90].stop(true)
    sortedAnimationData[AD.SS_Action_back].start(true), sortedAnimationData[AD.SS_Action_0_90].stop(true)

    setTimeout(() => { sortedAnimationData[AD.BS_Action_back]?.stop() }, 1000) // Tome_BS Repeat prevention
    sortedAnimationData[AD.BS_Stay_90].stop() // Tome_BS Stop holding
    setTimeout(() => { sortedAnimationData[AD.SS_Action_back]?.stop() }, 1000) // Tome_SS Repeat prevention
    sortedAnimationData[AD.SS_Stay_90].stop() // Tome_SS Stop holding

    // Move pages all at once and switch
    sortedAnimationData[AD.R_Controller].start(true), sortedAnimationData[AD.F_Controller].stop()
    sortedAnimationData[AD.R_Animation_Group].start(true), sortedAnimationData[AD.F_Animation_Group].stop()

    sortedAnimationData[AD.TargetCam].start(false, 1, 30, 0)
}

export enum AnimationDictionary {
    BS_Non_Action = 0,
    BS_Action_0_90 = 1,
    BS_Stay_90 = 2,
    BS_Action_back = 3,
    SS_Non_Action = 4,
    SS_Action_0_90 = 5,
    SS_Stay_90 = 6,
    SS_Action_back = 7,
    F_Controller = 8,
    F_Animation_Group = 9,
    F_0_90_Group = 10,
    R_Controller = 11,
    R_Animation_Group = 12,
    R_90_0_Group = 13,
    SS_F_0_90_Group = 14,
    SS_R_90_0_Group = 15,
    TargetCam = 16,
    TargetBS = 17,
    TargetSS = 18,
}

export function pageFrontAnimation(scene: Scene, index: number) {
    const page = scene.skeletons.find((skeleton) => skeleton.name === 'skeleton_' + index)
    if (!page) return
    scene.beginAnimation(page, 0, 60, true, undefined, () => { })
}

export function pageBackAnimation(scene: Scene, index: number) {
    const page = scene.skeletons.find((skeleton) => skeleton.name === 'skeleton_' + index)
    if (!page) return
    scene.beginAnimation(page, 60, 120, true, undefined, () => { })
}
