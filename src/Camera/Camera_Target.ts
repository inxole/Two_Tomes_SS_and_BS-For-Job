import { Scene, Vector3, Animation } from "@babylonjs/core"
import { A_Camera } from "./Camera_Controll"

const TargetCam_position1 = Vector3.Zero()
const TargetCam_position2 = new Vector3(-0.115981, 0, 0)
const TargetCamBS_position1 = new Vector3(-0.28, 0, 0)
const TargetCamBS_position2 = new Vector3(-0.392505, 0, 0)
const TargetCamSS_position1 = new Vector3(0.28, 0, 0)
const TargetCamSS_position2 = new Vector3(0.164019, 0, 0)

const positionAnimation = new Animation(
    "cameraPositionAnimation",
    "position",
    60,
    Animation.ANIMATIONTYPE_VECTOR3,
    Animation.ANIMATIONLOOPMODE_CONSTANT
)

const targetAnimation = new Animation(
    "cameraTargetAnimation",
    "target",
    60,
    Animation.ANIMATIONTYPE_VECTOR3,
    Animation.ANIMATIONLOOPMODE_CONSTANT
)

const animeCamBS_position1 = new Vector3(-0.28, 0, -1.5)
const animeCamBS_position2 = (x: number) => new Vector3(-0.392505 + x, 0, -1.5)
const animeCamSS_position1 = new Vector3(0.28, 0, -1.5)
const animeCamSS_position2 = (x: number) => new Vector3(0.164019 + x, 0, -1.5)

const CamBSPositionKey = (x: number) => [{ frame: 0, value: animeCamBS_position1 }, { frame: 30, value: animeCamBS_position2(x) }]
const CamSSPositionKey = (x: number) => [{ frame: 0, value: animeCamSS_position1 }, { frame: 30, value: animeCamSS_position2(x) }]

const getCamBSAnimation = (x: number) => { positionAnimation.setKeys(CamBSPositionKey(x)) }
const getCamSSAnimation = (x: number) => { positionAnimation.setKeys(CamSSPositionKey(x)) }

const CamTargetKey = [{ frame: 0, value: TargetCam_position1 }, { frame: 30, value: TargetCam_position2 }]
const CamBSTargetKey = [{ frame: 0, value: TargetCamBS_position1 }, { frame: 30, value: TargetCamBS_position2 }]
const CamSSTargetKey = [{ frame: 0, value: TargetCamSS_position1 }, { frame: 30, value: TargetCamSS_position2 }]

const TargetCamAnimation = () => { targetAnimation.setKeys(CamTargetKey) }
const TargetCamBSAnimation = () => { targetAnimation.setKeys(CamBSTargetKey) }
const TargetCamSSAnimation = () => { targetAnimation.setKeys(CamSSTargetKey) }

export function CameraAngle(scene: Scene,  OpenUp: boolean) {
    TargetCamAnimation()
    if (OpenUp) {
        scene.beginDirectAnimation(A_Camera.camera, [targetAnimation], 0, 30, false)
    } else {
        scene.beginDirectAnimation(A_Camera.camera, [targetAnimation], 30, 0, false)
    }
}

export function CameraBSAngle(scene: Scene, x: number) {
    getCamBSAnimation(x)
    TargetCamBSAnimation()
    scene.beginDirectAnimation(A_Camera.camera, [positionAnimation], 0, 30, false)
    scene.beginDirectAnimation(A_Camera.camera, [targetAnimation], 0, 30, false)
}

export function CameraSSAngle(scene: Scene, x: number) {
    getCamSSAnimation(x)
    TargetCamSSAnimation()
    scene.beginDirectAnimation(A_Camera.camera, [positionAnimation], 0, 30, false)
    scene.beginDirectAnimation(A_Camera.camera, [targetAnimation], 0, 30, false)
}
