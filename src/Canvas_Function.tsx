import { ArcRotateCamera, Bone, CSG, Color3, DefaultRenderingPipeline, DynamicTexture, HemisphericLight, Matrix, Mesh, MeshBuilder, Scene, Skeleton, StandardMaterial, Vector3, VertexData } from "@babylonjs/core"
import createYRotationAnimation from "./Animation_data"

function createPageMesh(scene: Scene, name: string, z: number, isFront: boolean) {
    const width = 0.2
    const height = 0.296
    const widthSubdivisions = 20
    const heightSubdivisions = 1

    const page = new Mesh(name, scene)
    page.isPickable = false
    const positions = []
    const indices = []
    const normals = []
    const uvs = []
    const weights = []
    const influences = []

    for (let h = 0; h <= heightSubdivisions; h++) {
        for (let w = 0; w <= widthSubdivisions; w++) {
            const x = (w * width) / widthSubdivisions - width / 2
            const y = (h * height) / heightSubdivisions - height / 2
            positions.push(x, y, z)
            normals.push(0, 0, isFront ? -1 : 1)
            uvs.push(w / widthSubdivisions, h / heightSubdivisions)

            // ウェイトとインフルエンスの設定
            const weight = w / widthSubdivisions
            weights.push(weight, 1 - weight, 0, 0)
            const influence1 = Math.min(w, widthSubdivisions - 1)
            const influence2 = Math.min(w + 1, widthSubdivisions)
            influences.push(influence1, influence2, 0, 0)
        }
    }

    for (let h = 0; h < heightSubdivisions; h++) {
        for (let w = 0; w < widthSubdivisions; w++) {
            const topLeft = h * (widthSubdivisions + 1) + w
            const topRight = topLeft + 1
            const bottomLeft = topLeft + (widthSubdivisions + 1)
            const bottomRight = bottomLeft + 1
            indices.push(topLeft, topRight, bottomRight)
            indices.push(topLeft, bottomRight, bottomLeft)
        }
    }

    const vertexData = new VertexData()
    vertexData.positions = positions
    vertexData.indices = indices
    vertexData.normals = normals
    vertexData.uvs = uvs
    vertexData.matricesWeights = weights
    vertexData.matricesIndices = influences
    vertexData.applyToMesh(page)
    return page
}

export function createPageTexture(scene: Scene, text: string, isFront: boolean) {
    const text_size = 22
    const font = "bold " + text_size + "px monospace"
    const Texture = new DynamicTexture("DynamicTexture", { width: 345, height: 512 }, scene, true)
    Texture.hasAlpha = true
    if (isFront) {
        Texture.drawText(text, 0, text_size, font, "#000000", "#ffffff", true)//基準点は左上
    }
    else {
        // Canvasの2Dコンテキストにアクセス
        const context = Texture.getContext()

        // 背景を白に設定
        context.fillStyle = "#ffffff"
        context.fillRect(0, 0, Texture.getSize().width, Texture.getSize().height)

        // テキストを描画する前にコンテキストを傾ける
        context.save()
        context.translate(345, 512 - text_size)//基準点は右下
        context.rotate(Math.PI / 1)
        context.fillStyle = "#000000"
        context.font = font
        context.fillText(text, 0, 0)
        context.restore()

        // テクスチャを更新
        Texture.update(false)
    }
    return Texture
}

export function createPageMaterial(scene: Scene, texture: DynamicTexture) {
    const material = new StandardMaterial("pageMat", scene)
    material.diffuseTexture = texture
    material.diffuseColor = new Color3(1, 1, 1)
    material.backFaceCulling = false
    return material
}

export function createPage(scene: Scene, name: string, text: string, z: number, isFront: boolean) {
    const page = createPageMesh(scene, name, z, isFront)
    const texture = createPageTexture(scene, text, isFront)
    page.material = createPageMaterial(scene, texture)
    page.rotation = new Vector3(Math.PI / 2, 0, 0)
    return page
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

export function createHitBoxMaterial(scene: Scene, boneName: string, diffuseColor: Color3): StandardMaterial {
    const material = new StandardMaterial(`hitBoxMat_${boneName}`, scene)
    material.alpha = 0.3
    material.diffuseColor = diffuseColor
    return material
}

export function createSkeleton(scene: Scene, name: string, targetMesh: Mesh, z: number, animationName: string) {
    const skeleton = new Skeleton(name, animationName, scene)
    let parentBone = new Bone(`${animationName}_Bone`, skeleton, null, Matrix.Translation(-0.11, 0, z))
    const widthSubdivisions = 20

    for (let w = 0; w <= widthSubdivisions; w++) {
        const boneName = `${animationName}_bone${w}`
        parentBone = new Bone(boneName, skeleton, parentBone, Matrix.Translation(0.01, 0, 0))

        // 各ボーンにy軸回転アニメーションを適用
        const boneAnimation = createYRotationAnimation(animationName, boneName)
        parentBone.animations = [boneAnimation]

        // ヒットボックスを生成する部分
        const hitBox = MeshBuilder.CreateBox(`hitBox_${boneName}`, { width: 0.01, height: 0.296, depth: 0.01 }, scene)
        hitBox.material = createHitBoxMaterial(scene, boneName, new Color3(0.5, 0.5, 1))
        hitBox.position = new Vector3(0, 0, 0)  // 初期位置
        hitBox.attachToBone(parentBone, targetMesh)  // ページメッシュに対してボーンをアタッチ
    }
    return skeleton
}

export function LightUp(scene: Scene) {
    const light = new HemisphericLight('light1', new Vector3(1, 1, 0), scene)
    light.intensity = 1.0
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

// ヒットボックスを作成してアタッチする関数
export function attachHitBox(bone: Bone, dimensions: { width: number, height: number, depth: number }, position: Vector3, scene: Scene, mesh: Mesh) {
    const hitBoxName = `Tome_hitBox_${bone.name}`
    const test_hitBox = MeshBuilder.CreateBox(hitBoxName, dimensions, scene)
    test_hitBox.material = createHitBoxMaterial(scene, bone.name, new Color3(0.7, 0.2, 0.7))
    test_hitBox.attachToBone(bone, mesh)
    test_hitBox.position = position
}

// 縦に割った円柱を作成してアタッチする関数
export function attachHalfCylinder(bone: Bone, radius: number, height: number, position: Vector3, scene: Scene, mesh: Mesh) {
    const hitBoxName = `Tome_hitBox_${bone.name}`
    const fullCylinder = MeshBuilder.CreateCylinder(hitBoxName, { diameter: radius * 1.15, height: height, tessellation: 24 }, scene)
    fullCylinder.rotation = new Vector3(0, 0, Math.PI / 2)

    const halfBox = MeshBuilder.CreateBox("halfBox", { width: height, height: height * 2, depth: radius * 1.5 }, scene)
    halfBox.position = new Vector3(0, 0, -0.04)

    const halfCylinder = CSG.FromMesh(fullCylinder).subtract(CSG.FromMesh(halfBox))
    const hitBox = halfCylinder.toMesh(hitBoxName, null, scene)
    hitBox.material = createHitBoxMaterial(scene, bone.name, new Color3(0.7, 0.2, 0.7))
    hitBox.attachToBone(bone, mesh)
    hitBox.position = position
    hitBox.rotation = new Vector3(Math.PI / 4.9, Math.PI, Math.PI / 2)

    fullCylinder.dispose()
    halfBox.dispose()
}

export default createPageMesh