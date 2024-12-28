import { AnimationGroup, ArcRotateCamera, Scene } from "@babylonjs/core"

export interface Camera_Angle {
    name: string
    camera: ArcRotateCamera | null
    GetCamera: (Scene: Scene) => void
    FocusOnDefault: (OpenUp: boolean, usedMobile: boolean) => void
    FocusOnBS: (OpenUp: boolean, usedMobile: boolean) => void
    FocusOnSS: (OpenUp: boolean, usedMobile: boolean) => void
    CameraAnimation: (group: AnimationGroup[], target: ArcRotateCamera | null) => void
}