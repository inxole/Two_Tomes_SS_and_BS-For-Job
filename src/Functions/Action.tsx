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
        if (previous == hitBoxNumber + 1) {
            return previous + 1
        } else if (previous == hitBoxNumber + 2) {
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
 * @param animationData animation group reference
 * @returns void
 */
export function openPageAnimation(animationData: AnimationGroup[]) {
    const AD = AnimationDictionary
    // Open/switch cover
    animationData[AD.N_0_90_Group].start(true), animationData[AD.R_90_0_Group].stop()
    animationData[AD.Action_0_90_BS].start(true), animationData[AD.Non_Action_BS].stop()

    setTimeout(() => { animationData[AD.Action_0_90_BS].stop() }, 1000) // Repeat prevention

    // Move pages all at once and switch
    animationData[AD.N_Controller].start(true), animationData[AD.R_Controller].stop()
    animationData[AD.N_Animation_Group].start(true), animationData[AD.R_Animation_Group].stop()
}

export function closePageAnimation(animationData: AnimationGroup[]) {
    const AD = AnimationDictionary
    // Close/switch cover
    animationData[AD.R_90_0_Group].start(true), animationData[AD.N_0_90_Group].stop()
    animationData[AD.Action_back_BS].start(true)

    setTimeout(() => { animationData[AD.Action_back_BS]?.stop() }, 1000) // Repeat prevention

    // Move pages all at once and switch
    animationData[AD.R_Controller].start(true), animationData[AD.N_Controller].stop()
    animationData[AD.R_Animation_Group].start(true), animationData[AD.N_Animation_Group].stop()
}

export enum AnimationDictionary {
    N_Controller = 0,
    R_Controller = 1,
    N_Animation_Group = 2,
    R_Animation_Group = 3,
    N_0_90_Group = 4,
    R_90_0_Group = 5,
    Action_0_90_BS = 6,
    Stay_90_BS = 7,
    Action_back_BS = 8,
    Non_Action_BS = 9,
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