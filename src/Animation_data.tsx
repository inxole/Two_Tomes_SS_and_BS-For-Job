import { Animation, AnimationGroup, Mesh, Vector3 } from '@babylonjs/core'

// ボーンごとの回転値を定義
const boneRotations: { [key: string]: { zero: number, one: number, two: number, three: number, four: number, five: number, six: number } } = {
    'bone0': { zero: 0.00, one: 0.15, two: 0.20, three: 0.50, four: 1.00, five: 1.00, six: 1.80 },
    'bone1': { zero: 0.00, one: 0.05, two: 0.10, three: 0.25, four: 0.25, five: 0.50, six: 0.50 },
    'bone2': { zero: 0.00, one: 0.05, two: 0.10, three: 0.25, four: 0.25, five: 0.50, six: 0.50 },
    'bone3': { zero: 0.00, one: 0.02, two: 0.10, three: 0.10, four: 0.10, five: 0.10, six: 0.25 },
    'bone4': { zero: 0.00, one: 0.02, two: 0.10, three: 0.10, four: 0.10, five: 0.10, six: 0.25 },
    'bone5': { zero: 0.00, one: 0.10, two: 0.20, three: 0.20, four: 0.20, five: 0.10, six: -0.01 },
    'bone6': { zero: 0.00, one: 0.10, two: 0.20, three: 0.20, four: 0.20, five: 0.10, six: -0.01 },
    'bone7': { zero: 0.00, one: 0.10, two: 0.20, three: 0.20, four: 0.20, five: 0.10, six: -0.15 },
    'bone8': { zero: 0.00, one: 0.10, two: 0.20, three: 0.20, four: 0.20, five: 0.10, six: 0.00 },
}

function createYRotationAnimation(skeletonName: string, boneName: string) {
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

const Reverse_keys_0_90 = [{ frame: 0, value: 0 }, { frame: 10, value: 0 }, { frame: 70, value: Math.PI / 2 }]
const Reverse_keys_90_0 = [{ frame: 0, value: Math.PI / 2 }, { frame: 50, value: 0 }]

/**
 * コントローラーにアニメーションを追加する
 * @param meshController アニメーショングループ
*/
export function createRotationAnimation(meshController: React.MutableRefObject<Mesh | null>) {
    const reverse_0_90 = new Animation("R_0_90", "rotation.z", 120, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CONSTANT)
    const reverse_90_0 = new Animation("R_90_0", "rotation.z", 120, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CONSTANT)

    reverse_0_90.setKeys(Reverse_keys_0_90)
    reverse_90_0.setKeys(Reverse_keys_90_0)

    const Zero_To_XC_Group = new AnimationGroup("R_0_90_Group")
    const XC_To_Zero_Group = new AnimationGroup("R_90_0_Group")

    Zero_To_XC_Group.addTargetedAnimation(reverse_0_90, meshController.current)
    XC_To_Zero_Group.addTargetedAnimation(reverse_90_0, meshController.current)
}

export default createYRotationAnimation
