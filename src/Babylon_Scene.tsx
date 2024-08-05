import { AnimationGroup, Engine, Mesh, MeshBuilder, Scene, Skeleton, Space, Vector3 } from "@babylonjs/core"
import { Action, PageState, ToggleAnimationHandler } from "./Function_action"
import initializeGLB, { mergedMesh } from "./Function_glb"
import { createPage, createSkeleton } from "./Function_page"
import { Inspector } from "@babylonjs/inspector"
import { createRootAnimation } from "./Animation_data"
import { addAnimationGroup } from "./Function_rootbone"
import LightUp, { CameraWork } from "./Function_canvas"

const isDebug = true
export function initializeScene(
    canvas: HTMLCanvasElement,
    sceneRef: React.MutableRefObject<Scene | null>,
    skeletonRefs: React.MutableRefObject<Skeleton[] | null>,
    dispatchers: React.Dispatch<Action>[],
    glb_dispatcher: [PageState, React.Dispatch<Action>],
    updated_text: string,
    root_controller: React.MutableRefObject<Mesh | null>
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
    const N_Controller = new AnimationGroup("N_Controller")//各ルートボーンの親の回転
    const R_Controller = new AnimationGroup("R_Controller")
    const N_Animation_Group = new AnimationGroup("N_Animation_Group")//各ルートボーンの回転
    const R_Animation_Group = new AnimationGroup("R_Animation_Group")

    for (let i = 0; i < meshes_amount; i++) {
        const front_page = createPage(scene, `front_page_${i}`, i === 0 ? updated_text : `page_${2 * i + 1}`, i * 0.0002, true)
        const back_page = createPage(scene, `back_page_${i}`, `page_${2 * i + 2}`, i * 0.0002 + 0.0001, false)

        front_pages.push(front_page)
        back_pages.push(back_page)

        const pageSkeleton = createSkeleton(scene, `skeleton_${i}`, front_page, i * 0.0002, `animation${i + 1}`, N_Animation_Group, R_Animation_Group)
        pageSkeletons.push(pageSkeleton)

        front_page.skeleton = pageSkeleton
        back_page.skeleton = pageSkeleton

        const rootBone = pageSkeleton.bones[0]
        const rootBonePosition = new Vector3(-0.1075, 0, -0.015 + 0.0006 * i)
        rootBone.setPosition(rootBonePosition, Space.WORLD)

        const rotationAngle = -(Math.PI / 1300) * i
        addAnimationGroup(N_Controller, rootBone, i, true, rotationAngle)
        addAnimationGroup(R_Controller, rootBone, i, false, rotationAngle)
    }

    skeletonRefs.current = pageSkeletons

    const control_mesh = MeshBuilder.CreateBox("Root", { width: 0.01, height: 0.01, depth: 0.01 }, scene)
    root_controller.current = control_mesh
    root_controller.current.position = new Vector3(-0.0975, -0.016, 0)
    root_controller.current.isVisible = false
    front_pages.forEach(mesh => {
        mesh.parent = control_mesh
    })
    back_pages.forEach(mesh => {
        mesh.parent = control_mesh
    })

    createRootAnimation(root_controller)
    const targetPosition = new Vector3(0, 0, 0)
    front_pages.forEach(mesh => {
        mesh.position = mesh.position.subtract(control_mesh.position).add(targetPosition)
    })
    back_pages.forEach(mesh => {
        mesh.position = mesh.position.subtract(control_mesh.position).add(targetPosition)
    })

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