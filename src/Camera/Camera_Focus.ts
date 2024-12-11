import { ArcRotateCamera, Scene, Vector3 } from "@babylonjs/core"
import { Camera_Angle } from "./Camera_Info"
import { TargetAnimations } from "./Camera_Target"

const name = 'camera1'
const defaultOpenPosition = new Vector3(0, 0, -1.5)
const defaultClosePosition = new Vector3(-0.115981, 0, -1.5)
const Tome_BS_OpenPosition = new Vector3(-0.28, 0, -1.5)
const Tome_BS_ClosePosition = new Vector3(-0.392505, 0, -1.5)
const Tome_SS_OpenPosition = new Vector3(0.28, 0, -1.5)
const Tome_SS_ClosePosition = new Vector3(0.164019, 0, -1.5)

const defaultOpenTarget = new Vector3(-0.115981, 0, 0)
const defaultCloseTarget = Vector3.Zero()
const Tome_BS_OpenTarget = new Vector3(-0.28, 0, 0)
const Tome_BS_CloseTarget = new Vector3(-0.392505, 0, 0)
const Tome_SS_OpenTarget = new Vector3(0.28, 0, 0)
const Tome_SS_CloseTarget = new Vector3(0.164019, 0, 0)

const A_Camera: Camera_Angle = {
    name: name,
    camera: null,
    GetCamera: () => { },
    FocusOnDefault: FocusOnDefault,
    FocusOnBS: FocusOnBS,
    FocusOnSS: FocusOnSS,
    CameraAnimation: TargetAnimations,
}

const getCamera = (scene: Scene) => {
    A_Camera.camera = scene.getCameraByName(name) as ArcRotateCamera
}

function FocusOnDefault(OpenUp: boolean) {
    if (!A_Camera.camera) return
    A_Camera.camera.position = OpenUp ? defaultClosePosition : defaultOpenPosition
    A_Camera.camera.setTarget(OpenUp ? defaultOpenTarget : defaultCloseTarget)
}

function FocusOnBS(OpenUp: boolean) {
    if (!A_Camera.camera) return
    A_Camera.camera.position = OpenUp ? Tome_BS_ClosePosition : Tome_BS_OpenPosition
    A_Camera.camera.setTarget(OpenUp ? Tome_BS_CloseTarget : Tome_BS_OpenTarget)
}

function FocusOnSS(OpenUp: boolean) {
    if (!A_Camera.camera) return
    A_Camera.camera.position = OpenUp ? Tome_SS_ClosePosition : Tome_SS_OpenPosition
    A_Camera.camera.setTarget(OpenUp ? Tome_SS_CloseTarget : Tome_SS_OpenTarget)
}

A_Camera.GetCamera = getCamera
export { A_Camera }