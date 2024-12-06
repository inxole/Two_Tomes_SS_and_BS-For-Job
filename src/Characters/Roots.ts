import { Mesh, Scene, Node, Nullable } from "@babylonjs/core"

export interface Roots {
    name: string
    mesh: Mesh | null
    GetMesh: (Scene: Scene) => void
    AddParent: (node: Nullable<Node>) => void
}