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
                            //表紙を開く＆切り替え
                            glb_animation[4].current?.start(true), glb_animation[5].current?.stop()
                            glb_animation[7].current?.start(true), glb_animation[9].current?.stop()

                            setTimeout(() => { glb_animation[7]?.current?.stop() }, 1000)//繰り返しの防止
                            setTimeout(() => { glb_animation[8]?.current?.start(true) }, 1000)//保持の開始

                            //pagesをまとめて動かす&&切り替え
                            glb_animation[0].current?.start(true), glb_animation[1].current?.stop()
                            glb_animation[2].current?.start(true), glb_animation[3].current?.stop()
                        },
                        close: () => {
                            //表紙を閉じる＆切り替え
                            glb_animation[5].current?.start(true), glb_animation[4].current?.stop()
                            glb_animation[9].current?.start(true), glb_animation[7].current?.stop()

                            setTimeout(() => { glb_animation[9]?.current?.stop() }, 1000)//繰り返しの防止
                            glb_animation[8].current?.stop()//保持の停止

                            //pagesをまとめて動かす&&切り替え
                            glb_animation[1].current?.start(true), glb_animation[0].current?.stop()
                            glb_animation[3].current?.start(true), glb_animation[2].current?.stop()
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

//glb_animationの内訳
// 0: Object { name: "N_Controller", _from: 1000, _to: 1060, … }
// 1: Object { name: "R_Controller", _from: 1060, _to: 1120, … }
// 2: Object { name: "N_Animation_Group", _from: 1000, _to: 1050, … }
// 3: Object { name: "R_Animation_Group", _from: 1050, _to: 1100, … }
// 4: Object { name: "N_0_90_Group", _from: 0, _to: 50, … }
// 5: Object { name: "R_90_0_Group", _from: 0, _to: 50, … }
// 6: Object { name: "000_BS_Non_Action", _from: 0, _to: 600, … } 初期値なので使わない
// 7: Object { name: "001_BS_action_0_90", _from: 0, _to: 600, … }
// 8: Object { name: "002_BS_stay_90", _from: 0, _to: 600, … }
// 9: Object { name: "003_BS_action_back", _from: 0, _to: 600, … }