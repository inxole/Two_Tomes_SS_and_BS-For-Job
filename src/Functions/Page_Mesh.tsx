import { Color3, DynamicTexture, Mesh, Scene, StandardMaterial, Vector3, VertexData } from "@babylonjs/core"

/**
 * create page mesh
 * @param scene add to scene
 * @param name mesh name
 * @param z z position
 * @param isFront front? or back?
 * @returns page mesh
 */
export function createPageMesh(scene: Scene, name: string, z: number, isFront: boolean) {
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

    for (let h = 0; h <= heightSubdivisions; h++) {
        let x = -0.1
        for (let w = 0; w <= widthSubdivisions; w++) {
            const y = (h * height) / heightSubdivisions - height / 2
            positions.push(x, y, z)
            normals.push(0, 0, isFront ? -1 : 1)
            uvs.push((x + 0.1) / 0.2, h / heightSubdivisions)
            const weight = (x + 0.1) / 0.2
            weights.push(weight, 1 - weight, 0, 0)
            const influence1 = Math.min(w, widthSubdivisions - 1)
            const influence2 = Math.min(w + 1, widthSubdivisions)
            influences.push(influence1, influence2, 0, 0)
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

const text_size = 22
export const fontFace = new FontFace('NieR-Regular', 'url(/fonts/NieR-Regular.ttf)')
/**
 * create page texture
 * @param scene add to scene
 * @param text add text to texture
 * @param isFront front? or back?
 * @returns page texture
 */
export function createPageTexture(scene: Scene, text: string, isFront: boolean) {
    let font = "bold " + text_size + "px monospace"
    const match = text.match(/\d+/)
    if (match) {
        let number = Number(match[0])
        if (number > 100) {
            font = "bold " + text_size + "px 'NieR-Regular'"
        }
        if (number >= 101 && number <= 200) {
            number = number - 100
            text = text.replace(/\d+/, `${number}`)
        }
    }

    const texture = new DynamicTexture("DynamicTexture", { width: 345, height: 512 }, scene, true)
    texture.hasAlpha = true

    fontFace.load().then(() => {
        document.fonts.add(fontFace)

        const ctx = texture.getContext()
        if (ctx) {
            if (isFront) {
                texture.drawText(text, 20, text_size + 15, font, "#000000", "#ffffff", true)
                texture.uOffset = -0.05
            } else {
                texture.drawText(text, 10, text_size + 15, font, "#000000", "#ffffff", true)
                texture.vAng = Math.PI
            }
        }
    }).catch((error) => {
        console.error('Font loading failed:', error)
    })

    return texture
}

/**
 * create page material
 * @param scene add to scene
 * @param texture add to material
 * @returns page material
 */
export function createPageMaterial(scene: Scene, texture: DynamicTexture) {
    const material = new StandardMaterial("pageMat", scene)
    material.diffuseTexture = texture
    material.diffuseColor = new Color3(1, 1, 1)
    material.backFaceCulling = false
    return material
}

/**
 * create page mesh and texture and material
 * @param scene add to scene
 * @param name mesh name
 * @param text mesh text
 * @param z z position
 * @param isFront front? or back?
 * @returns page object
 */
export function createPage(scene: Scene, name: string, text: string, z: number, isFront: boolean) {
    const page = createPageMesh(scene, name, z, isFront)
    const texture = createPageTexture(scene, text, isFront)
    page.material = createPageMaterial(scene, texture)
    page.rotation = new Vector3(Math.PI / 2, 0, 0)
    return page
}