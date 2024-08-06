import { Animation, AnimationGroup, Bone, Color3, Matrix, Mesh, MeshBuilder, Scene, Skeleton, StandardMaterial, Vector3 } from "@babylonjs/core"
import createYRotationAnimation from "../Animation_data"
import ForwardAnimation, { ReverseAnimation } from "../Animation_sub_data"

const data_N: Animation[] = []
const data_R: Animation[] = []

function createSkeleton(scene: Scene, name: string, targetMesh: Mesh, z: number, animationName: string, N: AnimationGroup, R: AnimationGroup) {
    const skeleton = new Skeleton(name, animationName, scene)
    let parentBone = new Bone(`${animationName}_Bone`, skeleton, null, Matrix.Translation(-0.11, 0, z))
    const widthSubdivisions = 10
    const boneRatios = [1, 1, 1, 1, 1, 4.8, 4.8, 4.8, 1, 1.5]

    for (let w = 0; w <= widthSubdivisions; w++) {
        const boneName = `${animationName}_bone${w.toString().padStart(2, '0')}`
        const ratio = boneRatios[w]
        parentBone = new Bone(boneName, skeleton, parentBone, Matrix.Translation(ratio * 0.01, 0, 0))

        const boneAnimation = createYRotationAnimation(animationName, boneName)
        const N_Animation = ForwardAnimation(animationName, boneName)
        const R_Animation = ReverseAnimation(animationName, boneName)
        data_N.push(N_Animation)
        data_R.push(R_Animation)
        parentBone.animations = [boneAnimation]

        const hitBox = MeshBuilder.CreateBox(`hitBox_${boneName}`, { width: ratio * 0.01, height: 0.296, depth: 0.01 }, scene)
        hitBox.material = createHitBoxMaterial(scene, boneName, new Color3(0.5, 0.5, 1))
        if (boneName === `${animationName}_bone05` || boneName === `${animationName}_bone06` || boneName === `${animationName}_bone07`) {
            hitBox.position = new Vector3(-0.019, 0, 0)
        } else if (boneName === `${animationName}_bone09`) {
            hitBox.position = new Vector3(-0.0025, 0, 0)
        } else {
            hitBox.position = new Vector3(0, 0, 0)
        }
        hitBox.attachToBone(parentBone, targetMesh)

        N.addTargetedAnimation(data_N[w], parentBone)
        R.addTargetedAnimation(data_R[w], parentBone)
    }
    return skeleton
}

export function createHitBoxMaterial(scene: Scene, boneName: string, diffuseColor: Color3): StandardMaterial {
    const material = new StandardMaterial(`hitBoxMat_${boneName}`, scene)
    material.alpha = 0
    material.diffuseColor = diffuseColor
    return material
}

export default createSkeleton