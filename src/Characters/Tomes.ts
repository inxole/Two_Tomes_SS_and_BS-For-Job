import { AbstractMesh, Nullable, Scene, Vector3 } from "@babylonjs/core"

export interface Tomes {
    name: string
    mesh: Nullable<AbstractMesh>
    GetMesh: (Scene: Scene) => void
    ToDefaultPose: () => void
    defaultPosition: Vector3
    defaultRotation: Vector3
}