import { Scene, Vector3 } from "@babylonjs/core"
import { Tomes } from "./Tomes"

const name = 'Tome_BS'
const defaultPosition = new Vector3(-0.28, 0, 0)
const defaultRotation = new Vector3(-Math.PI / 2.25, 0, 0)

const Tome_BS: Tomes = {
    name: name,
    mesh: null,
    GetMesh: () => { },
    ToDefaultPose: ToDefaultPose,
    defaultPosition: defaultPosition,
    defaultRotation: defaultRotation,
}

const getMesh = (scene: Scene) => {
    Tome_BS.mesh = scene.getMeshByName(name)
}

function ToDefaultPose() {
    if (!Tome_BS.mesh) return
    Tome_BS.mesh.position = defaultPosition
    Tome_BS.mesh.rotation = defaultRotation
}

Tome_BS.GetMesh = getMesh
export { Tome_BS }