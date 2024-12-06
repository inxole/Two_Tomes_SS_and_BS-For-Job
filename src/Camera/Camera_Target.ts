import { Scene, Vector3, Animation } from "@babylonjs/core"
import { A_Camera } from "./Camera_Focus"

const TargetCam_position1 = Vector3.Zero()
const TargetCam_position2 = new Vector3(-0.115981, 0, 0)
const TargetCamBS_position1 = new Vector3(-0.28, 0, 0)
const TargetCamBS_position2 = new Vector3(-0.392505, 0, 0)
const TargetCamSS_position1 = new Vector3(0.28, 0, 0)
const TargetCamSS_position2 = new Vector3(0.164019, 0, 0)

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

export function CameraAngle(scene: Scene, OpenUp: boolean) {
    TargetCamAnimation()
    if (OpenUp) {
        scene.beginDirectAnimation(A_Camera.camera, [targetAnimation], 0, 30, false)
    } else {
        scene.beginDirectAnimation(A_Camera.camera, [targetAnimation], 30, 0, false)
    }
}

export function CameraBSAngle(scene: Scene, OpenUp: boolean) {
    TargetCamBSAnimation()
    if (OpenUp) {
        scene.beginDirectAnimation(A_Camera.camera, [targetAnimation], 0, 30, false)
    } else {
        scene.beginDirectAnimation(A_Camera.camera, [targetAnimation], 30, 0, false)
    }
}

export function CameraSSAngle(scene: Scene, OpenUp: boolean) {
    TargetCamSSAnimation()
    if (OpenUp) {
        scene.beginDirectAnimation(A_Camera.camera, [targetAnimation], 0, 30, false)
    } else {
        scene.beginDirectAnimation(A_Camera.camera, [targetAnimation], 30, 0, false)
    }
}
