import { Vector3, Animation, AnimationGroup, ArcRotateCamera } from "@babylonjs/core"

const TargetCam_position1 = Vector3.Zero()
const TargetCam_position2 = new Vector3(-0.115981, 0, 0)
const TargetCamBS_position1 = new Vector3(-0.28, 0, 0)
const TargetCamBS_position2 = new Vector3(-0.392505, 0, 0)
const TargetCamSS_position1 = new Vector3(0.28, 0, 0)
const TargetCamSS_position2 = new Vector3(0.164019, 0, 0)

const targetAnimation = new Animation("N_targetAnimation", "target", 60, Animation.ANIMATIONTYPE_VECTOR3, Animation.ANIMATIONLOOPMODE_CONSTANT)
const targetBSAnimation = new Animation("N_targetBSAnimation", "target", 60, Animation.ANIMATIONTYPE_VECTOR3, Animation.ANIMATIONLOOPMODE_CONSTANT)
const targetSSAnimation = new Animation("N_targetSSAnimation", "target", 60, Animation.ANIMATIONTYPE_VECTOR3, Animation.ANIMATIONLOOPMODE_CONSTANT)

const CamTargetKey = [{ frame: 0, value: TargetCam_position1 }, { frame: 30, value: TargetCam_position2 }]
const CamBSTargetKey = [{ frame: 0, value: TargetCamBS_position1 }, { frame: 30, value: TargetCamBS_position2 }]
const CamSSTargetKey = [{ frame: 0, value: TargetCamSS_position1 }, { frame: 30, value: TargetCamSS_position2 }]

const N_TargetCamAnimation = () => { targetAnimation.setKeys(CamTargetKey) }
const N_TargetCamBSAnimation = () => { targetBSAnimation.setKeys(CamBSTargetKey) }
const N_TargetCamSSAnimation = () => { targetSSAnimation.setKeys(CamSSTargetKey) }

const AnimationData = [
    targetAnimation,
    targetBSAnimation,
    targetSSAnimation,
]

export function TargetAnimations(group: AnimationGroup[], camera: ArcRotateCamera | null) {
    if (!camera) return
    N_TargetCamAnimation()
    N_TargetCamBSAnimation()
    N_TargetCamSSAnimation()

    camera.animations.push(targetAnimation)
    camera.animations.push(targetBSAnimation)
    camera.animations.push(targetSSAnimation)

    if (!camera) return
    for (let i = 0; i < group.length; i++) {
        group[i].addTargetedAnimation(AnimationData[i], camera)
    }
}
