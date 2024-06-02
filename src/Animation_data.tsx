import { Animation, Vector3 } from '@babylonjs/core'

// ボーンごとの回転値を定義
const boneRotations: { [key: string]: { zero: number, one: number, two: number, three: number, four: number, five: number, six: number } } = {
    'bone0':  { zero: 0.00, one: 0.15, two: 0.20, three: 0.50, four: 1.00, five: 1.00, six:  1.80 },
    'bone1':  { zero: 0.00, one: 0.05, two: 0.10, three: 0.25, four: 0.25, five: 0.50, six:  0.50 },
    'bone2':  { zero: 0.00, one: 0.05, two: 0.10, three: 0.25, four: 0.25, five: 0.50, six:  0.50 },
    'bone3':  { zero: 0.00, one: 0.02, two: 0.10, three: 0.10, four: 0.10, five: 0.10, six:  0.25 },
    'bone4':  { zero: 0.00, one: 0.02, two: 0.10, three: 0.10, four: 0.10, five: 0.10, six:  0.25 },
    'bone5':  { zero: 0.00, one: 0.02, two: 0.10, three: 0.10, four: 0.10, five: 0.10, six:  0.01 },
    'bone6':  { zero: 0.00, one: 0.02, two: 0.10, three: 0.10, four: 0.10, five: 0.10, six:  0.01 },
    'bone7':  { zero: 0.00, one: 0.02, two: 0.10, three: 0.10, four: 0.10, five: 0.10, six:  0.00 },
    'bone8':  { zero: 0.00, one: 0.02, two: 0.10, three: 0.02, four: 0.02, five: 0.02, six:  0.00 },
    'bone9':  { zero: 0.00, one: 0.02, two: 0.10, three: 0.02, four: 0.02, five: 0.02, six:  0.00 },
    'bone10': { zero: 0.00, one: 0.02, two: 0.10, three: 0.02, four: 0.02, five: 0.02, six:  0.00 },
    'bone11': { zero: 0.00, one: 0.02, two: 0.05, three: 0.02, four: 0.02, five: 0.02, six:  0.00 },
    'bone12': { zero: 0.00, one: 0.02, two: 0.05, three: 0.02, four: 0.02, five: 0.02, six:  0.00 },
    'bone13': { zero: 0.00, one: 0.02, two: 0.05, three: 0.02, four: 0.02, five: 0.02, six:  0.00 },
    'bone14': { zero: 0.00, one: 0.02, two: 0.05, three: 0.02, four: 0.02, five: 0.02, six:  0.00 },
    'bone15': { zero: 0.00, one: 0.02, two: 0.05, three: 0.02, four: 0.02, five: 0.02, six: -0.05 },
    'bone16': { zero: 0.00, one: 0.02, two: 0.05, three: 0.02, four: 0.02, five: 0.02, six: -0.05 },
    'bone17': { zero: 0.00, one: 0.02, two: 0.05, three: 0.02, four: 0.02, five: 0.02, six: -0.05 },
    'bone18': { zero: 0.00, one: 0.02, two: 0.05, three: 0.02, four: 0.02, five: 0.02, six:  0.00 },
    'bone19': { zero: 0.00, one: 0.02, two: 0.05, three: 0.02, four: 0.02, five: 0.02, six:  0.00 },
    'bone20': { zero: 0.00, one: 0.02, two: 0.05, three: 0.02, four: 0.02, five: 0.02, six:  0.00 },
}

const createYRotationAnimation = (skeletonName: string, boneName: string) => {
    const rotation = boneRotations[boneName.replace(`${skeletonName}_`, '')] || { zero: 0.0, one: 0.0, two: 0.0, three: 0.0, four: 0.0, five: 0.0, six: 0.0 }
    const animationName = `${skeletonName}_${boneName}Animation`

    const animation = new Animation(animationName, "rotation", 120, Animation.ANIMATIONTYPE_VECTOR3, Animation.ANIMATIONLOOPMODE_CONSTANT)

    // キーフレームの設定
    const keys = [
        { frame: 0, value: new Vector3(0, rotation.zero, 0) },
        { frame: 10, value: new Vector3(0, rotation.one, 0) },
        { frame: 20, value: new Vector3(0, rotation.two, 0) },
        { frame: 30, value: new Vector3(0, rotation.three, 0) },
        { frame: 40, value: new Vector3(0, rotation.four, 0) },
        { frame: 50, value: new Vector3(0, rotation.five, 0) },
        { frame: 60, value: new Vector3(0, rotation.six, 0) },
        { frame: 70, value: new Vector3(0, rotation.five, 0) },
        { frame: 80, value: new Vector3(0, rotation.four, 0) },
        { frame: 90, value: new Vector3(0, rotation.three, 0) },
        { frame: 100, value: new Vector3(0, rotation.two, 0) },
        { frame: 110, value: new Vector3(0, rotation.one, 0) },
        { frame: 120, value: new Vector3(0, rotation.zero, 0) },
    ]
    animation.setKeys(keys)

    return animation
}

export default createYRotationAnimation
