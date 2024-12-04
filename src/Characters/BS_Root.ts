import { Scene, Node, Nullable, AbstractMesh } from "@babylonjs/core"
import { Roots } from "./Roots"

const name = 'Root_BS'
let mesh: Nullable<AbstractMesh> = null

const getMesh = (scene: Scene) => {
    mesh = scene.getMeshByName(name)
}

const addParent = (parent: Nullable<Node>) => {
    if (!mesh) return
    mesh.parent = parent
}

export const Root_BS: Roots = {
    name: name,
    mesh: mesh,
    GetMesh: getMesh,
    AddParent: addParent
}