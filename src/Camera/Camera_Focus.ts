import { ArcRotateCamera, Scene, Vector3 } from "@babylonjs/core"
import { Camera_Angle } from "./Camera_Info"
import { TargetAnimations } from "./Camera_Target"

const name = 'camera1'
const camera_Z = -1.8
const defaultClosePosition = new Vector3(0, 0, camera_Z)
const defaultOpenPosition = new Vector3(-0.115981, 0, camera_Z)
const Tome_BS_ClosePosition = new Vector3(-0.28, 0, camera_Z)
const Tome_BS_OpenPosition = new Vector3(-0.392505, 0, camera_Z)
const Tome_SS_ClosePosition = new Vector3(0.28, 0, camera_Z)
const Tome_SS_OpenPosition = new Vector3(0.164019, 0, camera_Z)

const defaultOpenTarget = new Vector3(-0.115981, 0, 0)
const defaultCloseTarget = Vector3.Zero()
const Tome_BS_CloseTarget = new Vector3(-0.28, 0, 0)
const Tome_BS_OpenTarget_001 = new Vector3(-0.392505, 0, 0)
const Tome_SS_CloseTarget = new Vector3(0.28, 0, 0)
const Tome_SS_OpenTarget = new Vector3(0.164019, 0, 0)

const mobile_defaultOpenPosition = new Vector3(-0.115981, 0, -6)
const mobile_defaultClosePosition = new Vector3(0, 0, -6)
const mobil_Tome_BS_OpenPosition = new Vector3(-0.392505, 0, -3.5)
const mobil_Tome_BS_ClosePosition = new Vector3(-0.28, 0, -3.5)
const mobil_Tome_SS_OpenPosition = new Vector3(0.164019, 0, -3.5)
const mobil_Tome_SS_ClosePosition = new Vector3(0.28, 0, -3.5)

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

function FocusOnDefault(OpenUp: boolean, usedMobile: boolean) {
    if (!A_Camera.camera) return
    if (usedMobile) {
        A_Camera.camera.position = OpenUp ? mobile_defaultOpenPosition : mobile_defaultClosePosition
    } else {
        A_Camera.camera.position = OpenUp ? defaultOpenPosition : defaultClosePosition
    }
    A_Camera.camera.setTarget(OpenUp ? defaultOpenTarget : defaultCloseTarget)
}

function FocusOnBS(OpenUp: boolean, usedMobile: boolean) {
    if (!A_Camera.camera) return
    if (usedMobile) {
        A_Camera.camera.position = OpenUp ? mobil_Tome_BS_OpenPosition : mobil_Tome_BS_ClosePosition
    } else {
        A_Camera.camera.position = OpenUp ? Tome_BS_OpenPosition : Tome_BS_ClosePosition
    }
    A_Camera.camera.setTarget(OpenUp ? Tome_BS_OpenTarget_001 : Tome_BS_CloseTarget)
}

function FocusOnSS(OpenUp: boolean, usedMobile: boolean) {
    if (!A_Camera.camera) return
    if (usedMobile) {
        A_Camera.camera.position = OpenUp ? mobil_Tome_SS_OpenPosition : mobil_Tome_SS_ClosePosition
    } else {
        A_Camera.camera.position = OpenUp ? Tome_SS_OpenPosition : Tome_SS_ClosePosition
    }
    A_Camera.camera.setTarget(OpenUp ? Tome_SS_OpenTarget : Tome_SS_CloseTarget)
}

A_Camera.GetCamera = getCamera
export { A_Camera }