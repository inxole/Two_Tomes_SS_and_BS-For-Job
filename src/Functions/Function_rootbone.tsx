import { AnimationGroup, Vector3, Animation, Bone } from "@babylonjs/core"

/**
 * Apply rotation animation to root bone parent
 * @param group animation group
 * @param bone bone
 * @param index index of the bone
 * @param reverse forward? or reverse?
 * @param rotationAngle angle of rotation
 */
export function addAnimationGroup(group: AnimationGroup, bone: Bone, index: number, reverse: boolean, rotationAngle: number) {
    const rootBone = bone
    const animationName = reverse ? `F_Controller_${index}` : `R_Controller_${index}`
    const positionAnimation = new Animation(animationName, "rotation", 120, Animation.ANIMATIONTYPE_VECTOR3, Animation.ANIMATIONLOOPMODE_CONSTANT)
    const positionKeys = reverse
        ? [
            { frame: 1000, value: new Vector3(0, 0, 0) },
            { frame: 1010, value: new Vector3(0, 0, 0) },
            { frame: 1060, value: new Vector3(0, rotationAngle, 0) }
        ]
        : [
            { frame: 1060, value: new Vector3(0, rotationAngle, 0) },
            { frame: 1070, value: new Vector3(0, rotationAngle, 0) },
            { frame: 1120, value: new Vector3(0, 0, 0) }
        ]

    positionAnimation.setKeys(positionKeys)
    rootBone.animations.push(positionAnimation)
    group.addTargetedAnimation(positionAnimation, rootBone)
}