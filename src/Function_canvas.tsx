import { AnimationGroup, ArcRotateCamera, DefaultRenderingPipeline, Engine, HemisphericLight, Mesh, Scene, Skeleton, Space, Vector3 } from "@babylonjs/core"
import { Action, PageState, ToggleAnimationHandler } from "./Function_action"
import initializeGLB, { mergedMesh } from "./Function_glb"
import { createPage, createSkeleton } from "./Function_page"
import { Inspector } from "@babylonjs/inspector"
import { addAnimationToGroup } from "./Function_rootbone"

export function LightUp(scene: Scene) {
    const light = new HemisphericLight('light1', new Vector3(1, 1, 0), scene)
    light.intensity = 1.0
}

export function createCamera(scene: Scene, canvas: HTMLCanvasElement) {
    const camera = new ArcRotateCamera('camera1', Math.PI / 2, Math.PI / 4, 2, new Vector3(0, 0, 0), scene)
    camera.attachControl(canvas, true)
    camera.setPosition(new Vector3(1, 1, -1))
    camera.wheelPrecision = 200
    camera.lowerRadiusLimit = 1.2
    camera.upperRadiusLimit = 5
    camera.fov = 0.3
    return camera
}

export function CameraWork(scene: Scene, canvas: HTMLCanvasElement | null) {
    if (!canvas) {
        throw new Error("HTMLCanvasElement is not found.")
    }
    const camera = createCamera(scene, canvas)
    const pipeline = new DefaultRenderingPipeline("default", true, scene, [camera])
    pipeline.depthOfFieldEnabled = true
    pipeline.depthOfField.focalLength = 0.1
    pipeline.depthOfField.fStop = 1.4
    pipeline.depthOfField.focusDistance = 2000
}

const isDebug = true
export function initializeScene(
    canvas: HTMLCanvasElement,
    sceneRef: React.MutableRefObject<Scene | null>,
    skeletonRefs: React.MutableRefObject<Skeleton[] | null>,
    dispatchers: React.Dispatch<Action>[],
    glb_dispatcher: [PageState, React.Dispatch<Action>],
    updated_text: string,
) {
    const meshes_amount = 50
    const engine = new Engine(canvas, true)
    const scene = new Scene(engine)
    sceneRef.current = scene
    let animationRefs: React.MutableRefObject<AnimationGroup | null>[] = []
    LightUp(scene)
    CameraWork(scene, canvas)
    initializeGLB(scene, animationRefs)

    const front_pages: Mesh[] = []
    const back_pages: Mesh[] = []
    const pageSkeletons: Skeleton[] = []
    const rootBoneAnimationGroup = new AnimationGroup("rootBoneAnimationGroup")
    const rootBoneAnimationGroupReverse = new AnimationGroup("rootBoneAnimationGroupReverse")

    for (let i = 0; i < meshes_amount; i++) {
        const front_page = createPage(scene, `front_page_${i}`, i === 0 ? updated_text : `page_${2 * i + 1}`, i * 0.0002, true)
        const back_page = createPage(scene, `back_page_${i}`, `page_${2 * i + 2}`, i * 0.0002 + 0.0001, false)

        front_pages.push(front_page)
        back_pages.push(back_page)

        const pageSkeleton = createSkeleton(scene, `skeleton_${i}`, front_page, i * 0.0002, `animation${i + 1}`)
        pageSkeletons.push(pageSkeleton)

        front_page.skeleton = pageSkeleton
        back_page.skeleton = pageSkeleton

        const rootBone = pageSkeleton.bones[0]
        const rootBonePosition = new Vector3(-0.1075, 0, -0.015 + 0.0006 * i)
        rootBone.setPosition(rootBonePosition, Space.WORLD)

        const position_1 = new Vector3(-0.1075, 0, -0.015 + 0.0006 * i)
        const position_2 = new Vector3(-0.115 + 0.00015 * i, 0, -0.015 + 0.0006 * i)

        addAnimationToGroup(rootBoneAnimationGroup, pageSkeleton, position_1, position_2, i, false)
        addAnimationToGroup(rootBoneAnimationGroupReverse, pageSkeleton, position_1, position_2, i, true)
    }

    skeletonRefs.current = pageSkeletons

    if (isDebug) {
        scene.debugLayer.show({
            embedMode: true
        })
        Inspector.Show(scene, {})
    }
    scene.onPointerObservable.add(
        (pointerInfo) => ToggleAnimationHandler(pointerInfo, scene,
            [
                ...pageSkeletons.map((pageSkeleton, i) => ({
                    dispatch: dispatchers[i],
                    skeleton: pageSkeleton,
                    pickNamePattern: new RegExp(`^hitBox_animation${i + 1}_`)
                })),
                {
                    dispatch: glb_dispatcher[1],
                    skeleton: mergedMesh.skeleton as Skeleton,
                    pickNamePattern: new RegExp(`^Tome_hitBox_`)
                }
            ],
            animationRefs,
        )
    )

    engine.runRenderLoop(() => scene.render())
    const resize = () => engine.resize()
    window.addEventListener('resize', resize)
    return () => {
        engine.dispose()
        window.removeEventListener('resize', resize)
    }
}

export default initializeScene