import { Scene, Vector3 } from "@babylonjs/core"
import { Tomes } from "./Tomes"

const name = 'Tome_SS'
const defaultPosition = new Vector3(0.28, 0, 0)
const defaultRotation = new Vector3(-Math.PI / 2.25, 0, 0)
const mobilePosition = new Vector3(0, -0.18, 0)

const Tome_SS: Tomes = {
    name: name,
    mesh: null,
    GetMesh: () => { },
    ToDefaultPose: ToDefaultPose,
    defaultPosition: defaultPosition,
    defaultRotation: defaultRotation,
}

const getMesh = (scene: Scene) => {
    Tome_SS.mesh = scene.getMeshByName(name)
}

function ToDefaultPose(usedMobile: boolean) {
    if (!Tome_SS.mesh) return
    Tome_SS.mesh.position = usedMobile ? mobilePosition : defaultPosition
    Tome_SS.mesh.rotation = defaultRotation
}

Tome_SS.GetMesh = getMesh
export { Tome_SS }