import { ArcRotateCamera, DefaultRenderingPipeline, DirectionalLight, HemisphericLight, Scene, SpotLight, Vector3 } from "@babylonjs/core"

/**
 * create a light
 * @param scene add to scene
 */
export function LightUp(scene: Scene) {
    const light = new HemisphericLight('light1', new Vector3(1, 1, 0), scene)
    light.intensity = 0.9

    const keyLight = new DirectionalLight('KeyLight', Vector3.Zero(), scene)
    keyLight.intensity = 0.7
    keyLight.position = new Vector3(-3, 5, -5)

    const fillLight = new SpotLight('FillLight', Vector3.Zero(), Vector3.Zero(), Math.PI / 3, 2, scene)
    fillLight.intensity = 0.25
    fillLight.position = new Vector3(3, 1, -3)

    const backLight = new DirectionalLight('BackLight', Vector3.Zero(), scene)
    backLight.intensity = 0.4
    backLight.position = new Vector3(0, 0, 5)

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
    camera.upperRadiusLimit = 8
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