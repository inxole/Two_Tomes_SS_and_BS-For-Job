import { Skeleton, Vector3, Animation, AnimationGroup } from "@babylonjs/core"

export const rootBoneAnimation: { [key: string]: { position_1: Vector3, position_2: Vector3 } } = {
    'rootBone': { position_1: new Vector3(-0.107, 0, -0.015), position_2: new Vector3(-0.115, 0, -0.015) }
}

function createRootBoneAnimationGroup(skeleton: Skeleton, animationData: { position_1: Vector3, position_2: Vector3 }) {
    const rootBone = skeleton.bones[0]

    // Animation Group
    const animationGroup = new AnimationGroup("rootBoneAnimationGroup")

    // Position Animation
    const positionAnimation = new Animation("rootBoneAnimation", "position", 120, Animation.ANIMATIONTYPE_VECTOR3, Animation.ANIMATIONLOOPMODE_CONSTANT)
    const positionKeys = [
        { frame: 1000, value: animationData.position_1 },
        { frame: 1030, value: animationData.position_2 },
    ]
    positionAnimation.setKeys(positionKeys)
    rootBone.animations.push(positionAnimation)
    animationGroup.addTargetedAnimation(positionAnimation, rootBone)

    return animationGroup
}

export function createRootBoneAnimationGroupReverse(skeleton: Skeleton, animationData: { position_1: Vector3, position_2: Vector3 }) {
    const rootBone = skeleton.bones[0]

    // Animation Group
    const ReverseanimationGroup = new AnimationGroup("rootBoneAnimationGroupReverse")

    // Position Animation
    const positionAnimation = new Animation("rootBoneAnimationReverse", "position", 120, Animation.ANIMATIONTYPE_VECTOR3, Animation.ANIMATIONLOOPMODE_CONSTANT)
    const positionKeys = [
        { frame: 1090, value: animationData.position_2 },
        { frame: 1120, value: animationData.position_1 },
    ]
    positionAnimation.setKeys(positionKeys)
    rootBone.animations.push(positionAnimation)
    ReverseanimationGroup.addTargetedAnimation(positionAnimation, rootBone)

    return ReverseanimationGroup
}

export default createRootBoneAnimationGroup
