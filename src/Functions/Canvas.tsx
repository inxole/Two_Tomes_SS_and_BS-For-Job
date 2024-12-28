import { ArcRotateCamera, DefaultRenderingPipeline, DirectionalLight, HemisphericLight, Scene, SpotLight, Vector3 } from "@babylonjs/core"

/**
 * create a light
 * @param scene add to scene
 */
export function LightUp(scene: Scene) {
    const light = new HemisphericLight('light1', new Vector3(1, 1, 0), scene)
    light.intensity = 1.0

    // キーライト (主光源)
    const keyLight = new DirectionalLight('KeyLight', new Vector3(-1, -1, -1), scene)
    keyLight.intensity = 0.8
    keyLight.position = new Vector3(5, 5, 5)

    // フィルライト (補助光源)
    const fillLight = new SpotLight('FillLight', new Vector3(1, 1, 0), new Vector3(0, 0, 0), Math.PI / 3, 2, scene)
    fillLight.intensity = 0.35
    fillLight.position = new Vector3(-5, 5, 5)

    // バックライト (後方光源)
    const backLight = new DirectionalLight('BackLight', new Vector3(0, -1, 1), scene)
    backLight.intensity = 0.5
    backLight.position = new Vector3(0, 5, -5)

    // 各ライトが (0, 0, 0) を向くように設定
    keyLight.direction = Vector3.Zero().subtract(keyLight.position).normalize()
    fillLight.direction = Vector3.Zero().subtract(fillLight.position).normalize()
    backLight.direction = Vector3.Zero().subtract(backLight.position).normalize()
}

/**
 * create a camera
 * @param scene add to scene
 * @param canvas add to canvas
 * @returns camera
 */
export function createCamera(scene: Scene, canvas: HTMLCanvasElement) {
    const camera = new ArcRotateCamera('camera1', Math.PI / 2, Math.PI / 4, 2, new Vector3(0, 0, 0), scene)
    camera.attachControl(canvas, true)
    camera.wheelPrecision = 200
    camera.lowerRadiusLimit = 1.2
    camera.upperRadiusLimit = 5
    camera.fov = 0.3
    return camera
}

/**
 * create camera work
 * @param scene add to scene
 * @param canvas add to canvas
 */
export function CameraWork(scene: Scene, canvas: HTMLCanvasElement | null) {
    if (!canvas) {
        throw new Error("HTMLCanvasElement is not found.")
    }
    const camera = createCamera(scene, canvas)
    const pipeline = new DefaultRenderingPipeline("default", true, scene, [camera], false)
    pipeline.depthOfFieldEnabled = true
    pipeline.depthOfField.focalLength = 0.1
    pipeline.depthOfField.fStop = 1.4
    pipeline.depthOfField.focusDistance = 2000
}