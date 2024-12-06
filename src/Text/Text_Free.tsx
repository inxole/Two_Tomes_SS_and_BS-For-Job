import { DynamicTexture, Scene } from "@babylonjs/core"
import { getTextLayoutDetails } from "./Text_Layout"
import { fontFace } from "../Functions/Page_Mesh"
import { splitTextIntoLines_Free } from "./Split_Text"

//22,23,26,27行目のawaitは、updated_textの更新が確実に行われるようにするためのもの。外すとテクスチャが意図しないものになる。
export const textFreeEdit = async (scene: Scene, updated_text: string, text_size: number) => {
    const pageLimit = 50
    const defaultFont = "bold " + text_size + "px monospace"
    const nieRFont = "bold " + text_size + "px 'NieR-Regular'"
    const front_textures_book1 = []
    const back_textures_book1 = []
    const front_textures_book2 = []
    const back_textures_book2 = []
    let { labelHeight, max_chars_per_line, max_lines_per_page, between_line, column } = getTextLayoutDetails(text_size)

    await fontFace.load().then(() => {
        document.fonts.add(fontFace)
    }).catch(error => console.error("Font loading failed:", error))

    for (let i = 0; i < pageLimit; i++) {
        front_textures_book1.push(await scene.getMeshByName('front_page_' + i)?.material?.getActiveTextures().values().next().value as DynamicTexture)
        back_textures_book1.push(await scene.getMeshByName('back_page_' + i)?.material?.getActiveTextures().values().next().value as DynamicTexture)
    }
    for (let i = pageLimit; i < pageLimit + pageLimit; i++) {
        front_textures_book2.push(await scene.getMeshByName('front_page_' + i)?.material?.getActiveTextures().values().next().value as DynamicTexture)
        back_textures_book2.push(await scene.getMeshByName('back_page_' + i)?.material?.getActiveTextures().values().next().value as DynamicTexture)
    }

    const lines = splitTextIntoLines_Free(updated_text, max_chars_per_line)
    let currentPage = 0
    let lineIndex = 0
    while (currentPage < pageLimit) {
        const front_texture = front_textures_book1[currentPage]
        const back_texture = back_textures_book1[currentPage]
        const font = defaultFont

        front_texture.clear()
        back_texture.clear()
        front_texture.drawText("", 0, 0, font, "black", "white", true, true)
        back_texture.drawText("", 0, 0, font, "black", "white", true, true)

        let line = labelHeight
        for (let i = 0; i < max_lines_per_page && lineIndex < lines.length; i++) {
            const text = lines[lineIndex]
            front_texture.drawText(text, column, line, font, "black", null, true, true)
            line += labelHeight - between_line
            lineIndex++
        }
        if (lineIndex < lines.length) {
            line = labelHeight
            for (let i = 0; i < max_lines_per_page && lineIndex < lines.length; i++) {
                const text = lines[lineIndex]
                back_texture.drawText(text, column / 2, line, font, "black", null, true, true)
                back_texture.vAng = Math.PI
                line += labelHeight - between_line
                lineIndex++
            }
        }
        currentPage++
    }

    currentPage = 0
    lineIndex = 0
    while (currentPage < pageLimit) {
        const front_texture = front_textures_book2[currentPage]
        const back_texture = back_textures_book2[currentPage]
        const font = nieRFont

        front_texture.clear()
        back_texture.clear()
        front_texture.drawText("", 0, 0, font, "black", "white", true, true)
        back_texture.drawText("", 0, 0, font, "black", "white", true, true)

        let line = labelHeight
        for (let i = 0; i < max_lines_per_page && lineIndex < lines.length; i++) {
            const text = lines[lineIndex]
            front_texture.drawText(text, column, line, font, "black", null, true, true)
            line += labelHeight - between_line
            lineIndex++
        }
        if (lineIndex < lines.length) {
            line = labelHeight
            for (let i = 0; i < max_lines_per_page && lineIndex < lines.length; i++) {
                const text = lines[lineIndex]
                back_texture.drawText(text, column / 2, line, font, "black", null, true, true)
                back_texture.vAng = Math.PI
                line += labelHeight - between_line
                lineIndex++
            }
        }
        currentPage++
    }
}