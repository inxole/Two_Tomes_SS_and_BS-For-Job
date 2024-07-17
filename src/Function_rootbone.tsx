import { AnimationGroup, Skeleton, Vector3, Animation } from "@babylonjs/core"


/**
 * ルートボーンにアニメーションを追加する
 * @param group アニメーショングループ
 * @param skeleton スケルトン
 * @param position_1 ポジション1
 * @param position_2 ポジション2
 * @param index インデックス
 * @param reverse リバース
 */
export function addAnimationToGroup(group: AnimationGroup, skeleton: Skeleton, position_1: Vector3, position_2: Vector3, index: number, reverse: boolean) {
    const rootBone = skeleton.bones[0]

    // アニメーション名
    const animationName = reverse ? `rootBoneAnimationReverse_${index}` : `rootBoneAnimation_${index}`

    // ポジションアニメーション
    const positionAnimation = new Animation(animationName, "position", 120, Animation.ANIMATIONTYPE_VECTOR3, Animation.ANIMATIONLOOPMODE_CONSTANT)

    const positionKeys = reverse
        ? [
            { frame: 1090, value: position_2 },
            { frame: 1120, value: position_1 }
        ]
        : [
            { frame: 1000, value: position_1 },
            { frame: 1030, value: position_2 }
        ]

    positionAnimation.setKeys(positionKeys)
    rootBone.animations.push(positionAnimation)
    group.addTargetedAnimation(positionAnimation, rootBone)
}