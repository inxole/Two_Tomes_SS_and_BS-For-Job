import { ArcRotateCamera, Scene } from "@babylonjs/core"

export interface Camera_Angle {
    name: string
    camera: ArcRotateCamera | null
    GetCamera: (Scene: Scene) => void
    FocusOnDefault: (OpenUp: boolean) => void
    FocusOnBS: (OpenUp: boolean) => void
    FocusOnSS: (OpenUp: boolean) => void
    CameraAngle: (scene: Scene, OpenUp: boolean) => void
    CameraBSAngle: (scene: Scene, OpenUp: boolean) => void
    CameraSSAngle: (scene: Scene, OpenUp: boolean) => void
}