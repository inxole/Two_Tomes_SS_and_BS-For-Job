import { Skeleton, Vector3, Animation, AnimationGroup } from "@babylonjs/core"

export const rootBoneAnimation: { [key: string]: { position_1: Vector3, position_2: Vector3, rotate_1: Vector3, rotate_2: Vector3 } } = {
    'rootBone': { position_1: new Vector3(-0.107, 0, -0.015), position_2: new Vector3(-0.115, 0, -0.015), rotate_1: new Vector3(0, 0, 0), rotate_2: new Vector3(0, -Math.PI / 72, 0) }
}

function createRootBoneAnimationGroup(skeleton: Skeleton, animationData: { position_1: Vector3, position_2: Vector3, rotate_1: Vector3, rotate_2: Vector3 }) {
    const rootBone = skeleton.bones[0]

    // Animation Group
    const animationGroup = new AnimationGroup("rootBoneAnimationGroup")

    // Position Animation
    const positionAnimation = new Animation("rootBoneAnimation", "position", 120, Animation.ANIMATIONTYPE_VECTOR3, Animation.ANIMATIONLOOPMODE_CONSTANT)
    const positionKeys = [
        { frame: 1000, value: animationData.position_1 },
        { frame: 1030, value: animationData.position_2 },
        { frame: 1090, value: animationData.position_2 },
        { frame: 1120, value: animationData.position_1 },
    ]
    positionAnimation.setKeys(positionKeys)
    rootBone.animations.push(positionAnimation)
    animationGroup.addTargetedAnimation(positionAnimation, rootBone)

    // Rotation Animation
    const rotateAnimation = new Animation("rootBoneRotateAnimation", "rotation", 120, Animation.ANIMATIONTYPE_VECTOR3, Animation.ANIMATIONLOOPMODE_CONSTANT)
    const rotateKeys = [
        { frame: 1000, value: animationData.rotate_1 },
        { frame: 1030, value: animationData.rotate_2 },
        { frame: 1090, value: animationData.rotate_2 },
        { frame: 1120, value: animationData.rotate_1 },
    ]
    rotateAnimation.setKeys(rotateKeys)
    rootBone.animations.push(rotateAnimation)
    animationGroup.addTargetedAnimation(rotateAnimation, rootBone)

    return animationGroup
}

export default createRootBoneAnimationGroup
