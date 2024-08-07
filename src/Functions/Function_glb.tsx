import { AnimationGroup, Bone, CSG, Color3, Matrix, Mesh, MeshBuilder, Scene, SceneLoader, Vector3 } from "@babylonjs/core"
import { createHitBoxMaterial } from "./Function_skeleton"

/**
 * attach hit box to bone
 * @param bone bone to attach
 * @param dimensions size of hit box
 * @param position location position
 * @param scene add to scene
 * @param mesh mesh to attach
 */
export function attachHitBox(bone: Bone, dimensions: { width: number, height: number, depth: number }, position: Vector3, scene: Scene, mesh: Mesh) {
    const hitBoxName = `Tome_hitBox_${bone.name}`
    const test_hitBox = MeshBuilder.CreateBox(hitBoxName, dimensions, scene)
    test_hitBox.material = createHitBoxMaterial(scene, bone.name, new Color3(0.7, 0.2, 0.7))
    test_hitBox.attachToBone(bone, mesh)
    test_hitBox.position = position
}

/**
 * attach half cylinder to bone
 * @param bone bone to attach
 * @param radius radius of cylinder
 * @param height height of cylinder
 * @param position location position
 * @param scene add to scene
 * @param mesh mesh to attach
 */
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

/**
 * Check the mesh
 * @param scene add to scene
 * @param name mesh name
 */
export function GetMeshForGLB(scene: Scene, name: string): void {
    let mesh = scene.getMeshByName(name)
    if (mesh === null) {
        throw new Error(`Mesh ${name} not found`)
    }
    mesh_BS.push(mesh as Mesh)
}

/**
 * Check the skeleton
 * @param scene add to scene
 * @param mesh Mesh with skeleton information
 * @param name skeleton name
 */
export function GetSkeletonForGLB(scene: Scene, mesh: Mesh, name: string) {
    mesh.skeleton = scene.getSkeletonByName(name)
    if (mesh.skeleton === null) {
        throw new Error(`Skeleton ${name} not found`)
    }
}

export let mergedMesh: Mesh

/**
 * import GLB file
 * @param scene add to scene
 * @param animationRefs animation group reference
 */
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
    })
}
export default initializeGLB