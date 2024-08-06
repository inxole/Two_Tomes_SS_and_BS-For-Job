import { Vector3, Animation } from "@babylonjs/core"

const subboneRotations: { [key: string]: { zero: number, one: number } } = {
    'bone00': { zero: 0.00, one: -Math.PI /   9 },
    'bone01': { zero: 0.00, one: -Math.PI / 7.5 },
    'bone02': { zero: 0.00, one: -Math.PI / 7.5 },
    'bone03': { zero: 0.00, one: -Math.PI /  18 },
    'bone04': { zero: 0.00, one: -Math.PI /  18 },
    'bone06': { zero: 0.00, one:           0.00 },
    'bone05': { zero: 0.00, one:           0.00 },
    'bone07': { zero: 0.00, one:           0.00 },
    'bone08': { zero: 0.00, one:           0.00 }
}

/**
 * Forward rotation animation of each page when opening the cover
 * @param skeleton skeleton name
 * @param bone bone name
 * @returns one animation data
 */
function ForwardAnimation(skeleton: string, bone: string) {
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

export default ForwardAnimation