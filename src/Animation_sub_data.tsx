import { Vector3, Animation } from "@babylonjs/core"

const subboneRotations: { [key: string]: { zero: number, one: number } } = {
    'bone0': { zero: 0.00, one: -Math.PI / 9   },
    'bone1': { zero: 0.00, one: -Math.PI / 7.5 },
    'bone2': { zero: 0.00, one: -Math.PI / 7.5 },
    'bone3': { zero: 0.00, one: -Math.PI / 18  },
    'bone4': { zero: 0.00, one: -Math.PI / 18  },
    'bone5': { zero: 0.00, one: 0.00 },
    'bone6': { zero: 0.00, one: 0.00 },
    'bone7': { zero: 0.00, one: 0.00 },
    'bone8': { zero: 0.00, one: 0.00 }
}

function NormalAnimation(skeletonName: string, boneName: string) {
    const rotation = subboneRotations[boneName.replace(`${skeletonName}_`, '')] || { zero: 0.0, one: 0.0, two: 0.0, three: 0.0, four: 0.0, five: 0.0, six: 0.0 }
    const animationName = `${skeletonName}_${boneName}Animation`
    const animation = new Animation(animationName, "rotation", 120, Animation.ANIMATIONTYPE_VECTOR3, Animation.ANIMATIONLOOPMODE_CONSTANT)

    const keys = [
        { frame: 1000, value: new Vector3(0, rotation.zero, 0) },
        { frame: 1010, value: new Vector3(0, rotation.zero, 0) },
        { frame: 1050, value: new Vector3(0, rotation.one, 0) }
    ]
    animation.setKeys(keys)

    return animation
}

export function ReverseAnimation(skeletonName: string, boneName: string) {
    const rotation = subboneRotations[boneName.replace(`${skeletonName}_`, '')] || { zero: 0.0, one: 0.0, two: 0.0, three: 0.0, four: 0.0, five: 0.0, six: 0.0 }
    const animationName = `${skeletonName}_${boneName}Animation`
    const animation = new Animation(animationName, "rotation", 120, Animation.ANIMATIONTYPE_VECTOR3, Animation.ANIMATIONLOOPMODE_CONSTANT)

    const keys = [
        { frame: 1050, value: new Vector3(0, rotation.one, 0) },
        { frame: 1070, value: new Vector3(0, rotation.one, 0) },
        { frame: 1100, value: new Vector3(0, rotation.zero, 0) }
    ]
    animation.setKeys(keys)

    return animation
}

export default NormalAnimation