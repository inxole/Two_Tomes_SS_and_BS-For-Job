import { AnimationGroup, Bone, CSG, Color3, Matrix, Mesh, MeshBuilder, Scene, SceneLoader, SkeletonViewer, Vector3 } from "@babylonjs/core"
import { createHitBoxMaterial } from "./Function_page"

export function attachHitBox(bone: Bone, dimensions: { width: number, height: number, depth: number }, position: Vector3, scene: Scene, mesh: Mesh) {
    const hitBoxName = `Tome_hitBox_${bone.name}`
    const test_hitBox = MeshBuilder.CreateBox(hitBoxName, dimensions, scene)
    test_hitBox.material = createHitBoxMaterial(scene, bone.name, new Color3(0.7, 0.2, 0.7))
    test_hitBox.attachToBone(bone, mesh)
    test_hitBox.position = position
}

export function attachHalfCylinder(bone: Bone, radius: number, height: number, position: Vector3, scene: Scene, mesh: Mesh) {
    const hitBoxName = `Tome_hitBox_${bone.name}`
    const fullCylinder = MeshBuilder.CreateCylinder(hitBoxName, { diameter: radius * 1.15, height: height, tessellation: 24 }, scene)
    fullCylinder.rotation = new Vector3(0, 0, Math.PI / 2)

    const halfBox = MeshBuilder.CreateBox("halfBox", { width: height, height: height * 2, depth: radius * 1.5 }, scene)
    halfBox.position = new Vector3(0, 0, -0.04)

    const halfCylinder = CSG.FromMesh(fullCylinder).subtract(CSG.FromMesh(halfBox))
    const hitBox = halfCylinder.toMesh(hitBoxName, null, scene)
    hitBox.material = createHitBoxMaterial(scene, bone.name, new Color3(0.7, 0.2, 0.7))
    hitBox.attachToBone(bone, mesh)
    hitBox.position = position
    hitBox.rotation = new Vector3(Math.PI / 4.9, Math.PI, Math.PI / 2)

    fullCylinder.dispose()
    halfBox.dispose()
}

export const mesh_BS: Mesh[] = []
export function GetMeshForGLB(scene: Scene, name: string): void {
    let mesh = scene.getMeshByName(name)
    if (mesh === null) {
        throw new Error(`Mesh ${name} not found`)
    }
    mesh_BS.push(mesh as Mesh)
}

export function getMergedMesh(): Mesh | null {
    if (mesh_BS.length === 0) {
        throw new Error("No meshes available to merge")
    }
    return Mesh.MergeMeshes(mesh_BS, true, true, undefined, false, true) as Mesh
}

export function GetSkeletonForGLB(scene: Scene, mesh: Mesh, name: string) {
    mesh.skeleton = scene.getSkeletonByName(name)
}

export let mergedMesh: Mesh
function initializeGLB(
    scene: Scene,
    animationRefs: React.MutableRefObject<AnimationGroup | null>[],
) {
    SceneLoader.Append("./", "Tome_BS.glb", scene, function () {
        const animationGroups = scene.animationGroups
        animationGroups.forEach((animationGroup, index) => {
            animationRefs[index] = { current: animationGroup }
        })
        GetMeshForGLB(scene, "Tome_BS_primitive0")
        GetMeshForGLB(scene, "Tome_BS_primitive1")
        GetMeshForGLB(scene, "Tome_BS_primitive2")
        mergedMesh = Mesh.MergeMeshes(mesh_BS, true, true, undefined, false, true) as Mesh
        mergedMesh.isPickable = false

        if (!mergedMesh) return
        GetSkeletonForGLB(scene, mergedMesh, "BS_Armature")
        const rotateTransform = Matrix.RotationY(Math.PI / 1)
        mergedMesh.bakeTransformIntoVertices(rotateTransform)
        mergedMesh.skeleton?.bones.forEach(bone => {
            const currentMatrix = bone.getLocalMatrix()
            const newMatrix = currentMatrix.multiply(rotateTransform)
            bone.getLocalMatrix().copyFrom(newMatrix)
        })

        mergedMesh.skeleton?.bones
            .filter(bone => ['Bone.003', 'Bone.008', 'Bone.014'].includes(bone.name))
            .forEach(bone => {
                if (bone.name === 'Bone.003') {
                    attachHitBox(bone, { width: 0.32, height: 0.23, depth: 0.013 }, new Vector3(0, -0.07, 0.003), scene, mergedMesh)
                } else if (bone.name === 'Bone.008') {
                    attachHalfCylinder(bone, 0.05, 0.32, new Vector3(0, 0.01, 0.012), scene, mergedMesh)
                } else {
                    attachHitBox(bone, { width: 0.32, height: 0.23, depth: 0.013 }, new Vector3(0, -0.07, -0.003), scene, mergedMesh)
                }
            })
        if (mergedMesh.skeleton !== null) {
            const skeletonViewer = new SkeletonViewer(mergedMesh.skeleton, mergedMesh, scene, false, 3, {
                displayMode: SkeletonViewer.DISPLAY_SPHERE_AND_SPURS
            })
            skeletonViewer.isEnabled = true
        }
    })
}
export default initializeGLB