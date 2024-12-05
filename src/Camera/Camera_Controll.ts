import { ArcRotateCamera, Scene, Vector3, Animation } from "@babylonjs/core"
import { Camera_Angle } from "./Camera_Info"

const name = 'camera1'
const defaultPosition = new Vector3(0, 0, -1.5)
const Tome_BS_Position = new Vector3(-0.28, 0, -1.5)
const Tome_SS_Position = new Vector3(0.28, 0, -1.5)
const LookAtBS = new Vector3(-0.28, 0, 0)
const LookAtSS = new Vector3(0.28, 0, 0)

const A_Camera: Camera_Angle = {
    name: name,
    camera: null,
    GetCamera: () => { },
    ToDefaultPose: ToDefaultPose,
    SetBS: setTarget_BS,
    SetSS: setTarget_SS,
    SetTargetCam: AllCamData,
    SetTargetBS: AllCamBSData,
    SetTargetSS: AllCamSSData,
    defaultPosition: defaultPosition
}

const getCamera = (scene: Scene) => {
    A_Camera.camera = scene.getCameraByName(name) as ArcRotateCamera
}

function ToDefaultPose() {
    if (!A_Camera.camera) return
    A_Camera.camera.position = defaultPosition
    A_Camera.camera.setTarget(Vector3.Zero())
}

function setTarget_BS() {
    if (!A_Camera.camera) return
    A_Camera.camera.position = Tome_BS_Position
    A_Camera.camera.setTarget(LookAtBS)
}

function setTarget_SS() {
    if (!A_Camera.camera) return
    A_Camera.camera.position = Tome_SS_Position
    A_Camera.camera.setTarget(LookAtSS)
}

const animeCam_position1 = new Vector3(0, 0, -1.5)
const animeCam_position2 = (x: number) => new Vector3(-0.112505 + x, 0, -1.5)
const animeCamBS_position1 = new Vector3(-0.28, 0, -1.5)
const animeCamBS_position2 = (x: number) => new Vector3(-0.392505 + x, 0, -1.5)
const animeCamSS_position1 = new Vector3(0.28, 0, -1.5)
const animeCamSS_position2 = (x: number) => new Vector3(0.167495 + x, 0, -1.5)

const positionAnimation = new Animation(
    "cameraPositionAnimation",
    "position",
    30, // FPS
    Animation.ANIMATIONTYPE_VECTOR3,
    Animation.ANIMATIONLOOPMODE_CONSTANT
)

// アニメーションのキー設定
const CamPositionKey = (x: number) => [{ frame: 0, value: animeCam_position1 }, { frame: 30, value: animeCam_position2(x) }]
const CamBSPositionKey = (x: number) => [{ frame: 0, value: animeCamBS_position1 }, { frame: 30, value: animeCamBS_position2(x) }]
const CamSSPositionKey = (x: number) => [{ frame: 0, value: animeCamSS_position1 }, { frame: 30, value: animeCamSS_position2(x) }]

const getCamAnimation = (x: number) => { positionAnimation.setKeys(CamPositionKey(x)) }
const getCamBSAnimation = (x: number) => { positionAnimation.setKeys(CamBSPositionKey(x)) }
const getCamSSAnimation = (x: number) => { positionAnimation.setKeys(CamSSPositionKey(x)) }

const setCamAnimation = (x: number) => {
    getCamAnimation(x)
}
const setCamBSAnimation = (x: number) => {
    getCamBSAnimation(x)
}
const setCamSSAnimation = (x: number) => {
    getCamSSAnimation(x)
}

const TargetCam_position1 = Vector3.Zero()
const TargetCam_position2 = new Vector3(-0.112505, 0, 0)
const TargetCamBS_position1 = new Vector3(-0.28, 0, 0)
const TargetCamBS_position2 = new Vector3(-0.392505, 0, 0)
const TargetCamSS_position1 = new Vector3(0.28, 0, 0)
const TargetCamSS_position2 = new Vector3(0.167495, 0, 0)

const targetAnimation = new Animation(
    "cameraTargetAnimation",
    "target", // カメラのターゲットプロパティ
    30, // FPS
    Animation.ANIMATIONTYPE_VECTOR3,
    Animation.ANIMATIONLOOPMODE_CONSTANT
)

const CamTargetKey = [{ frame: 0, value: TargetCam_position1 }, { frame: 30, value: TargetCam_position2 }]
const CamBSTargetKey = [{ frame: 0, value: TargetCamBS_position1 }, { frame: 30, value: TargetCamBS_position2 }]
const CamSSTargetKey = [{ frame: 0, value: TargetCamSS_position1 }, { frame: 30, value: TargetCamSS_position2 }]

const TargetCamAnimation = () => { targetAnimation.setKeys(CamTargetKey) }
const TargetCamBSAnimation = () => { targetAnimation.setKeys(CamBSTargetKey) }
const TargetCamSSAnimation = () => { targetAnimation.setKeys(CamSSTargetKey) }

const setTargetAnimation = () => {
    TargetCamAnimation()
}
const setTargetBSAnimation = () => {
    TargetCamBSAnimation()
}
const setTargetSSAnimation = () => {
    TargetCamSSAnimation()
}

function AllCamData(x: number) {
    setCamAnimation(x)
    setTargetAnimation()
}
function AllCamBSData(x: number) {
    setCamBSAnimation(x)
    setTargetBSAnimation()
}
function AllCamSSData(x: number) {
    setCamSSAnimation(x)
    setTargetSSAnimation()
}

A_Camera.GetCamera = getCamera
export { A_Camera }