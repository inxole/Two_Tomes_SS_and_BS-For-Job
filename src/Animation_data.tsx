import { Animation, AnimationGroup, Mesh, Vector3 } from '@babylonjs/core'

// ボーンごとの回転値を定義
const boneRotations: { [key: string]: { zero: number, one: number, two: number, three: number, four: number, five: number, six: number } } = {
    'bone0': { zero: -Math.PI /   9, one: -Math.PI / 24, two: -Math.PI / 36, three: -Math.PI / 12 , four: Math.PI / 36, five: Math.PI / 24, six:  Math.PI /  12 },
    'bone1': { zero: -Math.PI / 7.5, one: -Math.PI / 10, two: -Math.PI / 18, three:  Math.PI / 180, four: Math.PI / 27, five: Math.PI / 12, six:  Math.PI /   6 },
    'bone2': { zero: -Math.PI / 7.5, one: -Math.PI / 10, two: -Math.PI / 18, three:  Math.PI / 180, four: Math.PI / 27, five: Math.PI / 12, six:  Math.PI /   6 },
    'bone3': { zero: -Math.PI /  18, one: -Math.PI / 15, two: -Math.PI / 36, three:  Math.PI / 90 , four: Math.PI / 36, five: Math.PI / 20, six:  Math.PI /  18 },
    'bone4': { zero: -Math.PI /  18, one: -Math.PI / 15, two: -Math.PI / 36, three:  Math.PI / 90 , four: Math.PI / 36, five: Math.PI / 20, six:  Math.PI /  18 },
    'bone5': { zero:              0, one:  Math.PI / 24, two:  Math.PI / 24, three:  Math.PI / 24 , four: Math.PI / 24, five: Math.PI / 24, six:  Math.PI / 360 },
    'bone6': { zero:              0, one:  Math.PI / 24, two:  Math.PI / 24, three:  Math.PI / 24 , four: Math.PI / 24, five: Math.PI / 24, six:  Math.PI / 360 },
    'bone7': { zero:              0, one:  Math.PI / 24, two:  Math.PI / 24, three:  Math.PI / 24 , four: Math.PI / 24, five: Math.PI / 24, six: -Math.PI /  60 },
    'bone8': { zero:              0, one:             0, two:             0, three:              0, four:            0, five:            0, six:              0 },
}

function createYRotationAnimation(skeletonName: string, boneName: string) {
    const rotation = boneRotations[boneName.replace(`${skeletonName}_`, '')] || { zero: 0.0, one: 0.0, two: 0.0, three: 0.0, four: 0.0, five: 0.0, six: 0.0 }
    const animationName = `${skeletonName}_${boneName}Animation`

    const animation = new Animation(animationName, "rotation", 120, Animation.ANIMATIONTYPE_VECTOR3, Animation.ANIMATIONLOOPMODE_CONSTANT)

    // キーフレームの設定
    const keys = [
        { frame:   0, value: new Vector3(0, rotation.zero , 0) },
        { frame:  10, value: new Vector3(0, rotation.one  , 0) },
        { frame:  20, value: new Vector3(0, rotation.two  , 0) },
        { frame:  30, value: new Vector3(0, rotation.three, 0) },
        { frame:  40, value: new Vector3(0, rotation.four , 0) },
        { frame:  50, value: new Vector3(0, rotation.five , 0) },
        { frame:  60, value: new Vector3(0, rotation.six  , 0) },
        { frame:  70, value: new Vector3(0, rotation.five , 0) },
        { frame:  80, value: new Vector3(0, rotation.four , 0) },
        { frame:  90, value: new Vector3(0, rotation.three, 0) },
        { frame: 100, value: new Vector3(0, rotation.two  , 0) },
        { frame: 110, value: new Vector3(0, rotation.one  , 0) },
        { frame: 120, value: new Vector3(0, rotation.zero , 0) },
    ]
    animation.setKeys(keys)

    return animation
}

const Normal_keys_0_90 = [
    { frame: 0, value: 0 },
    { frame: 10, value: 0 },
    { frame: 50, value: Math.PI / 2 }
]
const Reverse_keys_90_0 = [
    { frame: 0, value: Math.PI / 2 },
    { frame: 20, value: Math.PI / 2 },
    { frame: 50, value: 0 }
]

const Position_keys_0_90 = [
    { frame: 0, value: new Vector3(-0.0975, -0.0144, 0) },
    { frame: 50, value: new Vector3(-0.101, -0.02, 0) }
]
const Position_keys_90_0 = [
    { frame: 0, value: new Vector3(-0.101, -0.02, 0) },
    { frame: 50, value: new Vector3(-0.0975, -0.0144, 0) }
]

/**
 * コントローラーにアニメーションを追加する
 * @param meshController アニメーショングループ
*/
export function createRootAnimation(meshController: React.MutableRefObject<Mesh | null>) {
    const normal_0_90 = new Animation("N_0_90", "rotation.z", 120, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CONSTANT)
    const reverse_90_0 = new Animation("R_90_0", "rotation.z", 120, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CONSTANT)

    normal_0_90.setKeys(Normal_keys_0_90)
    reverse_90_0.setKeys(Reverse_keys_90_0)

    const position_0_90 = new Animation("P_0_90", "position", 120, Animation.ANIMATIONTYPE_VECTOR3, Animation.ANIMATIONLOOPMODE_CONSTANT)
    const position_90_0 = new Animation("P_90_0", "position", 120, Animation.ANIMATIONTYPE_VECTOR3, Animation.ANIMATIONLOOPMODE_CONSTANT)

    position_0_90.setKeys(Position_keys_0_90)
    position_90_0.setKeys(Position_keys_90_0)

    const Zero_To_Ninety_Group = new AnimationGroup("N_0_90_Group")
    const Ninety_To_Zero_Group = new AnimationGroup("R_90_0_Group")

    Zero_To_Ninety_Group.addTargetedAnimation(normal_0_90, meshController.current)
    Zero_To_Ninety_Group.addTargetedAnimation(position_0_90, meshController.current)

    Ninety_To_Zero_Group.addTargetedAnimation(reverse_90_0, meshController.current)
    Ninety_To_Zero_Group.addTargetedAnimation(position_90_0, meshController.current)
}

export default createYRotationAnimation
