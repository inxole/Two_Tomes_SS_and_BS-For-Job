import { ArcRotateCamera, Scene, Vector3 } from "@babylonjs/core"

export interface Camera_Angle {
    name: string
    camera: ArcRotateCamera | null
    GetCamera: (Scene: Scene) => void
    ToDefaultPose: () => void
    SetBS: (LookAtObject: Vector3) => void
    SetSS: (LookAtObject: Vector3) => void
    SetTargetCam: (x: number) => void
    SetTargetBS: (x: number) => void
    SetTargetSS: (x: number) => void
    defaultPosition: Vector3
}