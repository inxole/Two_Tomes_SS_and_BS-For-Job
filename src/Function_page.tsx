import { Bone, Color3, DynamicTexture, Matrix, Mesh, MeshBuilder, Scene, Skeleton, StandardMaterial, Vector3, VertexData } from "@babylonjs/core"
import createYRotationAnimation from "./Animation_data"

function createPageMesh(scene: Scene, name: string, z: number, isFront: boolean) {
    const width = 0.2
    const height = 0.296
    const widthSubdivisions = 9
    const heightSubdivisions = 1

    const page = new Mesh(name, scene)
    page.isPickable = false
    const positions = []
    const indices = []
    const normals = []
    const uvs = []
    const weights = []
    const influences = []

    let x = -0.1
    for (let h = 0; h <= heightSubdivisions; h++) {
        x = -0.1
        for (let w = 0; w <= widthSubdivisions; w++) {
            const y = (h * height) / heightSubdivisions - height / 2
            positions.push(x, y, z)
            normals.push(0, 0, isFront ? -1 : 1)
            uvs.push((x + 0.1) / 0.2, h / heightSubdivisions)

            // ウェイトとインフルエンスの設定
            const weight = (x + 0.1) / 0.2
            weights.push(weight, 1 - weight, 0, 0)
            const influence1 = Math.min(w, widthSubdivisions - 1)
            const influence2 = Math.min(w + 1, widthSubdivisions)
            influences.push(influence1, influence2, 0, 0)

            // xの位置をjの値によって変更
            if (w < 4) {
                x += width * 0.05
            } else if (w < 7) {
                x += width * 0.24
            } else if (w === 7) {
                x += width * 0.05
            } else {
                x += width * 0.075
            }
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
        const context = Texture.getContext()
        context.fillStyle = "#ffffff"
        context.fillRect(0, 0, Texture.getSize().width, Texture.getSize().height)

        context.save()
        context.translate(345, 512 - text_size)//基準点は右下
        context.rotate(Math.PI / 1)
        context.fillStyle = "#000000"
        context.font = font
        context.fillText(text, 0, 0)
        context.restore()

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

export function createSkeleton(scene: Scene, name: string, targetMesh: Mesh, z: number, animationName: string) {
    const skeleton = new Skeleton(name, animationName, scene)
    let parentBone = new Bone(`${animationName}_Bone`, skeleton, null, Matrix.Translation(-0.11, 0, z))
    const widthSubdivisions = 10
    const boneRatios = [1, 1, 1, 1, 1, 4.8, 4.8, 4.8, 1, 1.5]

    for (let w = 0; w <= widthSubdivisions; w++) {
        const boneName = `${animationName}_bone${w}`
        const ratio = boneRatios[w]
        parentBone = new Bone(boneName, skeleton, parentBone, Matrix.Translation(ratio * 0.01, 0, 0))

        const boneAnimation = createYRotationAnimation(animationName, boneName)
        parentBone.animations = [boneAnimation]

        const hitBox = MeshBuilder.CreateBox(`hitBox_${boneName}`, { width: ratio * 0.01, height: 0.296, depth: 0.01 }, scene)
        hitBox.material = createHitBoxMaterial(scene, boneName, new Color3(0.5, 0.5, 1))
        if (boneName === `${animationName}_bone5` || boneName === `${animationName}_bone6` || boneName === `${animationName}_bone7`) {
            hitBox.position = new Vector3(-0.019, 0, 0)
        } else if (boneName === `${animationName}_bone9`) {
            hitBox.position = new Vector3(-0.0025, 0, 0)
        } else {
            hitBox.position = new Vector3(0, 0, 0)
        }
        hitBox.attachToBone(parentBone, targetMesh)
    }
    return skeleton
}

export function createHitBoxMaterial(scene: Scene, boneName: string, diffuseColor: Color3): StandardMaterial {
    const material = new StandardMaterial(`hitBoxMat_${boneName}`, scene)
    material.alpha = 0.3
    material.diffuseColor = diffuseColor
    return material
}

export default createPageMesh