import { AnimationGroup, Engine, Mesh, MeshBuilder, Scene, Skeleton, Space, Vector3 } from "@babylonjs/core"
import { LightUp, CameraWork } from "./Functions/Canvas"
import { createPage } from "./Functions/Page_Mesh"
import { createSkeleton } from "./Functions/Skeleton"
import { createRootAnimation, createRootAnimation_SS } from "./Animation_data"
import { ControllerAnimation } from "./Animation_sub_data"
import load_Tome_BS from "./Functions/Tome_BS"
import load_Tome_SS from "./Functions/Tome_SS"

export function initializeScene(
    canvas: HTMLCanvasElement,
    sceneRef: React.MutableRefObject<Scene | null>,
    skeletonRefs: React.MutableRefObject<Skeleton[] | null>,
    updated_text: string,
    root_controller_BS: React.MutableRefObject<Mesh | null>,
    root_controller_SS: React.MutableRefObject<Mesh | null>,
) {
    const meshes_amount = 100
    const engine = new Engine(canvas, true)
    const scene = new Scene(engine)
    sceneRef.current = scene
    LightUp(scene)
    CameraWork(scene, canvas)
    load_Tome_BS(scene)
    load_Tome_SS(scene)

    const front_pages: Mesh[] = []
    const back_pages: Mesh[] = []
    const pageSkeletons: Skeleton[] = []
    const F_Controller = new AnimationGroup("F_Controller")//各ルートボーンの親の回転
    const R_Controller = new AnimationGroup("R_Controller")
    const F_Animation_Group = new AnimationGroup("F_Animation_Group")//各ルートボーンの回転
    const R_Animation_Group = new AnimationGroup("R_Animation_Group")

    for (let i = 0; i < meshes_amount; i++) {
        const front_page = createPage(scene, `front_page_${i}`, i === 0 ? updated_text : `page_${2 * i + 1}`, i * 0.0002, true)
        const back_page = createPage(scene, `back_page_${i}`, `page_${2 * i + 2}`, i * 0.0002 + 0.0001, false)

        front_pages.push(front_page)
        back_pages.push(back_page)

        const pageSkeleton = createSkeleton(scene, `skeleton_${i}`, front_page, i * 0.0002, `animation${i}`, F_Animation_Group, R_Animation_Group)
        pageSkeletons.push(pageSkeleton)

        front_page.skeleton = pageSkeleton
        back_page.skeleton = pageSkeleton

        const rootBone = pageSkeleton.bones[0]
        const rootBonePosition = new Vector3(
            i >= 50 ? -0.1075 + 0.5 : -0.1075,
            0,
            -0.015 + 0.0006 * i
        )
        rootBone.setPosition(rootBonePosition, Space.WORLD)

        const rotationIndex = i >= 50 ? i - 50 : i
        const rotationAngle = -(Math.PI / 1300) * rotationIndex
        ControllerAnimation(F_Controller, rootBone, i, true, rotationAngle)
        ControllerAnimation(R_Controller, rootBone, i, false, rotationAngle)
    }

    skeletonRefs.current = pageSkeletons

    const control_mesh_BS = MeshBuilder.CreatePlane("Root_BS", { width: 0.01, height: 0.01 }, scene)
    root_controller_BS.current = control_mesh_BS
    root_controller_BS.current.position = new Vector3(-0.0975, -0.016, 0)
    root_controller_BS.current.isVisible = false
    front_pages.slice(0, 50).forEach(mesh => { mesh.parent = control_mesh_BS })
    back_pages.slice(0, 50).forEach(mesh => { mesh.parent = control_mesh_BS })
    const control_mesh_SS = MeshBuilder.CreatePlane("Root_SS", { width: 0.01, height: 0.01 }, scene)
    root_controller_SS.current = control_mesh_SS
    root_controller_SS.current.position = new Vector3(-0.0975, -0.016, 0)
    root_controller_SS.current.isVisible = false
    front_pages.slice(50, 100).forEach(mesh => { mesh.parent = control_mesh_SS })
    back_pages.slice(50, 100).forEach(mesh => { mesh.parent = control_mesh_SS })

    createRootAnimation(root_controller_BS)
    const targetPosition = new Vector3(0, 0, 0)
    front_pages.slice(0, 50).forEach(mesh => {
        mesh.position = mesh.position.subtract(control_mesh_BS.position).add(targetPosition)
    })
    back_pages.slice(0, 50).forEach(mesh => {
        mesh.position = mesh.position.subtract(control_mesh_BS.position).add(targetPosition)
    })

    createRootAnimation_SS(root_controller_SS)
    const targetPosition_SS = new Vector3(-0.5, 0.0295, 0)
    front_pages.slice(50, 100).forEach(mesh => {
        mesh.position = mesh.position.subtract(control_mesh_SS.position).add(targetPosition_SS)
    })
    back_pages.slice(50, 100).forEach(mesh => {
        mesh.position = mesh.position.subtract(control_mesh_SS.position).add(targetPosition_SS)
    })

    engine.runRenderLoop(() => scene.render())
    const resize = () => engine.resize()
    window.addEventListener('resize', resize)
    return () => {
        engine.dispose()
        window.removeEventListener('resize', resize)
    }
}

export default initializeScene