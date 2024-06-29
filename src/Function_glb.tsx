import { Bone, CSG, Color3, Mesh, MeshBuilder, Scene, Vector3 } from "@babylonjs/core"
import { createHitBoxMaterial } from "./Function_page"

function attachHitBox(bone: Bone, dimensions: { width: number, height: number, depth: number }, position: Vector3, scene: Scene, mesh: Mesh) {
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

export default attachHitBox