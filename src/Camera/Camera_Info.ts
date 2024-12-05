import { ArcRotateCamera, Scene, Vector3 } from "@babylonjs/core"

export interface Camera_Angle {
    name: string
    camera: ArcRotateCamera | null
    GetCamera: (Scene: Scene) => void
    ToDefaultPose: (camera: ArcRotateCamera) => void
    SetBS: (camera: ArcRotateCamera) => void
    SetSS: (camera: ArcRotateCamera) => void
    SetTargetCam: (x: number) => void
    SetTargetBS: (x: number) => void
    SetTargetSS: (x: number) => void
    defaultPosition: Vector3
}