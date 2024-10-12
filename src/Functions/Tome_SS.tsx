import { Matrix, Mesh, Scene, SceneLoader, Vector3 } from "@babylonjs/core"
import "@babylonjs/loaders/glTF"
import { attachHalfCylinder, attachHitBox, GetSkeletonForGLB } from "./Tome_BS"

export const mesh_SS: Mesh[] = []
export let BookCover_SS: Mesh

/**
 * Check the mesh
 * @param scene add to scene
 * @param name mesh name
 */
export function GetMeshForGLB_SS(scene: Scene, name: string): void {
    let mesh = scene.getMeshByName(name)
    if (mesh === null) {
        throw new Error(`Mesh ${name} not found`)
    }
    mesh_SS.push(mesh as Mesh)
}

/**
 * import GLB file
 * @param scene add to scene
 * @param animationRefs animation group reference
 */
function load_Tome_SS(scene: Scene) {
    SceneLoader.ImportMeshAsync("", "./", "Tome_SS.glb", scene).then(() => {
        GetMeshForGLB_SS(scene, "Tome_SS_primitive0")
        GetMeshForGLB_SS(scene, "Tome_SS_primitive1")
        BookCover_SS = Mesh.MergeMeshes(mesh_SS, true, true, undefined, false, true) as Mesh
        BookCover_SS.name = "Tome_SS"
        BookCover_SS.isPickable = false
        BookCover_SS.position = new Vector3(0.5, 0, 0)

        if (!BookCover_SS) return
        GetSkeletonForGLB(scene, BookCover_SS, "SS_Armature")
        const rotateTransform = Matrix.RotationY(Math.PI / 1)
        BookCover_SS.bakeTransformIntoVertices(rotateTransform)
        BookCover_SS.skeleton?.bones.forEach(bone => {
            const currentMatrix = bone.getLocalMatrix()
            const newMatrix = currentMatrix.multiply(rotateTransform)
            bone.getLocalMatrix().copyFrom(newMatrix)
        })

        BookCover_SS.skeleton?.bones
            .filter(bone => ['Bone.003', 'Bone.008', 'Bone.014'].includes(bone.name))
            .forEach(bone => {
                if (bone.name === 'Bone.003') {
                    attachHitBox(bone, { width: 0.32, height: 0.23, depth: 0.013 }, new Vector3(0, -0.07, 0.003), scene, BookCover_SS)
                } else if (bone.name === 'Bone.008') {
                    attachHalfCylinder(bone, 0.05, 0.32, new Vector3(0, 0.01, 0.012), scene, BookCover_SS)
                } else {
                    attachHitBox(bone, { width: 0.32, height: 0.23, depth: 0.013 }, new Vector3(0, -0.07, -0.003), scene, BookCover_SS)
                }
            })
    })
}
export default load_Tome_SS