import { ArcRotateCamera, Scene, Vector3, Animation } from "@babylonjs/core"
import { Camera_Angle } from "./Camera_Info"

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
    CameraAngle: CameraAngle,
    CameraBSAngle: CameraBSAngle,
    CameraSSAngle: CameraSSAngle,
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

const positionAnimation = new Animation(
    "cameraPositionAnimation",
    "position",
    60,
    Animation.ANIMATIONTYPE_VECTOR3,
    Animation.ANIMATIONLOOPMODE_CONSTANT
)

const animeCam_position1 = new Vector3(0, 0, -1.5)
const animeCam_position2 = (offset: Vector3) => new Vector3(-0.115981 + offset.x, 0, -1.5)
const animeCamBS_position1 = new Vector3(-0.28, 0, -1.5)
const animeCamBS_position2 = (x: number) => new Vector3(-0.395981 + x, 0, -1.5)
const animeCamSS_position1 = new Vector3(0.28, 0, -1.5)
const animeCamSS_position2 = (x: number) => new Vector3(0.164019 + x, 0, -1.5)

const CamPositionKey = (offset: Vector3) => [{ frame: 0, value: animeCam_position1 }, { frame: 30, value: animeCam_position2(offset) }]
const CamBSPositionKey = (x: number) => [{ frame: 0, value: animeCamBS_position1 }, { frame: 30, value: animeCamBS_position2(x) }]
const CamSSPositionKey = (x: number) => [{ frame: 0, value: animeCamSS_position1 }, { frame: 30, value: animeCamSS_position2(x) }]

const getCamAnimation = (offset: Vector3) => { positionAnimation.setKeys(CamPositionKey(offset)) }
const getCamBSAnimation = (x: number) => { positionAnimation.setKeys(CamBSPositionKey(x)) }
const getCamSSAnimation = (x: number) => { positionAnimation.setKeys(CamSSPositionKey(x)) }

const TargetCam_position1 = Vector3.Zero()
const TargetCam_position2 = new Vector3(-0.112505, 0, 0)
const TargetCamBS_position1 = new Vector3(-0.28, 0, 0)
const TargetCamBS_position2 = new Vector3(-0.392505, 0, 0)
const TargetCamSS_position1 = new Vector3(0.28, 0, 0)
const TargetCamSS_position2 = new Vector3(0.167495, 0, 0)

const targetAnimation = new Animation(
    "cameraTargetAnimation",
    "target",
    60,
    Animation.ANIMATIONTYPE_VECTOR3,
    Animation.ANIMATIONLOOPMODE_CONSTANT
)

const CamTargetKey = [{ frame: 0, value: TargetCam_position1 }, { frame: 30, value: TargetCam_position2 }]
const CamBSTargetKey = [{ frame: 0, value: TargetCamBS_position1 }, { frame: 30, value: TargetCamBS_position2 }]
const CamSSTargetKey = [{ frame: 0, value: TargetCamSS_position1 }, { frame: 30, value: TargetCamSS_position2 }]

const TargetCamAnimation = () => { targetAnimation.setKeys(CamTargetKey) }
const TargetCamBSAnimation = () => { targetAnimation.setKeys(CamBSTargetKey) }
const TargetCamSSAnimation = () => { targetAnimation.setKeys(CamSSTargetKey) }

function CameraAngle(scene: Scene, offset: Vector3, OpenUp: boolean) {
    getCamAnimation(offset)
    TargetCamAnimation()
    if (OpenUp) {
        scene.beginDirectAnimation(A_Camera.camera, [positionAnimation], 0, 30, false)
        scene.beginDirectAnimation(A_Camera.camera, [targetAnimation], 0, 30, false)
    } else {
        scene.beginDirectAnimation(A_Camera.camera, [positionAnimation], 30, 0, false)
        scene.beginDirectAnimation(A_Camera.camera, [targetAnimation], 30, 0, false)
    }
}

function CameraBSAngle(scene: Scene, x: number) {
    getCamBSAnimation(x)
    TargetCamBSAnimation()
    scene.beginDirectAnimation(A_Camera.camera, [positionAnimation], 0, 30, false)
    scene.beginDirectAnimation(A_Camera.camera, [targetAnimation], 0, 30, false)
}

function CameraSSAngle(scene: Scene, x: number) {
    getCamSSAnimation(x)
    TargetCamSSAnimation()
    scene.beginDirectAnimation(A_Camera.camera, [positionAnimation], 0, 30, false)
    scene.beginDirectAnimation(A_Camera.camera, [targetAnimation], 0, 30, false)
}

A_Camera.GetCamera = getCamera
export { A_Camera }