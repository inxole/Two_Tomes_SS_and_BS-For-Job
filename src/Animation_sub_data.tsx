import { Vector3, Animation, AnimationGroup, Bone } from "@babylonjs/core"

const subboneRotations: { [key: string]: { zero: number, one: number } } = {
    'bone0': { zero: 0.00, one: -Math.PI /   9 },
    'bone1': { zero: 0.00, one: -Math.PI / 7.5 },
    'bone2': { zero: 0.00, one: -Math.PI / 7.5 },
    'bone3': { zero: 0.00, one: -Math.PI /  18 },
    'bone4': { zero: 0.00, one: -Math.PI /  18 },
    'bone6': { zero: 0.00, one:           0.00 },
    'bone5': { zero: 0.00, one:           0.00 },
    'bone7': { zero: 0.00, one:           0.00 },
    'bone8': { zero: 0.00, one:           0.00 }
}

/**
 * Forward rotation animation of each page when opening the cover
 * @param skeleton skeleton name
 * @param bone bone name
 * @returns one animation data
 */
export function ForwardAnimation(skeleton: string, bone: string) {
    const rotation = subboneRotations[bone.replace(`${skeleton}_`, '')] || { zero: 0.0, one: 0.0, two: 0.0, three: 0.0, four: 0.0, five: 0.0, six: 0.0 }
    const animationName = `${skeleton}_${bone}Animation`
    const animation = new Animation(animationName, "rotation", 120, Animation.ANIMATIONTYPE_VECTOR3, Animation.ANIMATIONLOOPMODE_CONSTANT)

    const keys = [
        { frame: 1000, value: new Vector3(0, rotation.zero, 0) },
        { frame: 1010, value: new Vector3(0, rotation.zero, 0) },
        { frame: 1050, value: new Vector3(0, rotation.one, 0) }
    ]
    animation.setKeys(keys)

    return animation
}

/**
 * Reverse rotation animation of each page when closing the cover
 * @param skeleton skeleton name
 * @param bone bone name
 * @returns one animation data
 */
export function ReverseAnimation(skeleton: string, bone: string) {
    const rotation = subboneRotations[bone.replace(`${skeleton}_`, '')] || { zero: 0.0, one: 0.0, two: 0.0, three: 0.0, four: 0.0, five: 0.0, six: 0.0 }
    const animationName = `${skeleton}_${bone}Animation`
    const animation = new Animation(animationName, "rotation", 120, Animation.ANIMATIONTYPE_VECTOR3, Animation.ANIMATIONLOOPMODE_CONSTANT)

    const keys = [
        { frame: 1050, value: new Vector3(0, rotation.one, 0) },
        { frame: 1070, value: new Vector3(0, rotation.one, 0) },
        { frame: 1100, value: new Vector3(0, rotation.zero, 0) }
    ]
    animation.setKeys(keys)

    return animation
}

/**
 * Apply rotation animation to (mesh)Controller
 * @param group animation group
 * @param bone bone
 * @param index index of the bone
 * @param reverse forward? or reverse?
 * @param rotationAngle angle of rotation
 */
export function ControllerAnimation(group: AnimationGroup, bone: Bone, index: number, reverse: boolean, rotationAngle: number) {
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