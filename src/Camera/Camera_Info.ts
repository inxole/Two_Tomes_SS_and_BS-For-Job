import { ArcRotateCamera, Scene, Vector3 } from "@babylonjs/core"

export interface Camera_Angle {
    name: string
    camera: ArcRotateCamera | null
    GetCamera: (Scene: Scene) => void
    FocusOnDefault: (OpenUp: boolean) => void
    FocusOnBS: (OpenUp: boolean) => void
    FocusOnSS: (OpenUp: boolean) => void
    CameraAngle: (scene: Scene, offset: Vector3, OpenUp: boolean) => void
    CameraBSAngle: (scene: Scene, x: number) => void
    CameraSSAngle: (scene: Scene, x: number) => void
}