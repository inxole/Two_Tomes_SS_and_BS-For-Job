import { AnimationGroup, PointerEventTypes, PointerInfo, Scene, Skeleton } from "@babylonjs/core"
import { Reducer, useReducer } from "react"

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

/**
 * mouse event handler for animation toggle
 * @param pointerInfo on pointer event
 * @param scene add to scene
 * @param toggleAnimationSetups animation setup
 * @param glb_animation animation group reference
 */
export function ToggleAnimationHandler(
    pointerInfo: PointerInfo,
    scene: Scene,
    toggleAnimationSetups: ToggleAnimationSetup[],
    glb_animation: React.MutableRefObject<AnimationGroup | null>[],
    bookmarkRef: number,
    setBookmark: React.Dispatch<React.SetStateAction<number>>,
    setCoverSwitch: React.Dispatch<React.SetStateAction<boolean>>
) {
    if (pointerInfo.pickInfo !== null && pointerInfo.type === PointerEventTypes.POINTERDOWN) {
        for (const { dispatch, skeleton, pickNamePattern } of toggleAnimationSetups) {
            if (pointerInfo.pickInfo.hit && pickNamePattern.test(pointerInfo.pickInfo.pickedMesh?.name || "")) {
                if (pointerInfo.pickInfo.pickedMesh?.name.startsWith(`hitBox_animation${bookmarkRef}`)) {
                    dispatch({
                        type: "OPEN",
                        open: () => { scene.beginAnimation(skeleton, 0, 60, true, undefined, () => { setBookmark((prev) => prev + 1) }) },
                        close: () => { }
                    })
                } else if (pointerInfo.pickInfo.pickedMesh?.name.startsWith(`hitBox_animation${bookmarkRef - 1}`)) {
                    dispatch({
                        type: "CLOSE",
                        open: () => { },
                        close: () => { scene.beginAnimation(skeleton, 60, 120, true, undefined, () => { }), setBookmark((prev) => prev - 1) }
                    })
                } else if (bookmarkRef === 0) {
                    dispatch({
                        type: "TOGGLE",
                        open: () => {
                            //Open/switch cover
                            glb_animation[4].current?.start(true), glb_animation[5].current?.stop()
                            glb_animation[7].current?.start(true), glb_animation[9].current?.stop()

                            setTimeout(() => { glb_animation[7]?.current?.stop() }, 1000)//Repeat prevention
                            setTimeout(() => { glb_animation[8]?.current?.start(true) }, 1000)//start holding

                            //Move pages all at once and switch
                            glb_animation[0].current?.start(true), glb_animation[1].current?.stop()
                            glb_animation[2].current?.start(true), glb_animation[3].current?.stop()

                            glb_animation[2]?.current?.onAnimationEndObservable.addOnce(() => {
                                setCoverSwitch(true)
                            })
                        },
                        close: () => {
                            //Close/switch cover
                            glb_animation[5].current?.start(true), glb_animation[4].current?.stop()
                            glb_animation[9].current?.start(true), glb_animation[7].current?.stop()

                            setTimeout(() => { glb_animation[9]?.current?.stop() }, 1000)//Repeat prevention
                            glb_animation[8].current?.stop()//Stop holding

                            //Move pages all at once and switch
                            glb_animation[1].current?.start(true), glb_animation[0].current?.stop()
                            glb_animation[3].current?.start(true), glb_animation[2].current?.stop()

                            setCoverSwitch(false)
                        }
                    })
                } else { return }
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
// 6: Object { name: "000_BS_Non_Action", _from: 0, _to: 600, … } Do not use as it is the initial value
// 7: Object { name: "001_BS_action_0_90", _from: 0, _to: 600, … }
// 8: Object { name: "002_BS_stay_90", _from: 0, _to: 600, … }
// 9: Object { name: "003_BS_action_back", _from: 0, _to: 600, … }