import { DynamicTexture, Scene } from "@babylonjs/core"
import { getTextLayoutDetails } from "./Text/Text_Layout"
import { fontFace } from "./Functions/Page_Mesh"
import { splitTextIntoLines_Free } from "./Text/Split_Text"

export const oneTextDefaultEdit = async (scene: Scene, updated_text: string, text_size: number, target: number) => {
    const defaultFont = "bold " + text_size + "px monospace"
    let { labelHeight, max_chars_per_line, max_lines_per_page, between_line, column } = getTextLayoutDetails(text_size)
    const lines = splitTextIntoLines_Free(updated_text, max_chars_per_line)

    let lineIndex = 0
    if (target % 2 == 1) {
        const book1_front_number = (target - 1) / 2
        const front_textures_book1 = await scene.getMeshByName('front_page_' + book1_front_number)?.material?.getActiveTextures().values().next().value as DynamicTexture
        front_textures_book1.clear()
        front_textures_book1.drawText("", 0, 0, defaultFont, "black", "white", true, true)

        let line = labelHeight
        for (let i = 0; i < max_lines_per_page && lineIndex < lines.length; i++) {
            const text = lines[lineIndex]
            front_textures_book1.drawText(text, column, line, defaultFont, "black", null, true, true)
            line += labelHeight - between_line
            lineIndex++
        }
    } else if (target % 2 == 0) {
        const book1_back_number = (target - 2) / 2
        const back_textures_book1 = await scene.getMeshByName('back_page_' + book1_back_number)?.material?.getActiveTextures().values().next().value as DynamicTexture
        back_textures_book1.clear()
        back_textures_book1.drawText("", 0, 0, defaultFont, "black", "white", true, true)

        let line = labelHeight
        for (let i = 0; i < max_lines_per_page && lineIndex < lines.length; i++) {
            const text = lines[lineIndex]
            back_textures_book1.drawText(text, column / 2, line, defaultFont, "black", null, true, true)
            back_textures_book1.vAng = Math.PI
            line += labelHeight - between_line
            lineIndex++
        }
    }
}

export const oneTextNieREdit = async (scene: Scene, updated_text: string, text_size: number, target: number) => {
    const nieRFont = "bold " + text_size + "px 'NieR-Regular'"
    let { labelHeight, max_chars_per_line, max_lines_per_page, between_line, column } = getTextLayoutDetails(text_size)
    const lines = splitTextIntoLines_Free(updated_text, max_chars_per_line)

    await fontFace.load().then(() => {
        document.fonts.add(fontFace)
    }).catch(error => console.error("Font loading failed:", error))

    let lineIndex = 0
    if (target % 2 == 1) {
        const book2_front_number = 50 + (target - 1) / 2
        const front_textures_book2 = await scene.getMeshByName('front_page_' + book2_front_number)?.material?.getActiveTextures().values().next().value as DynamicTexture
        front_textures_book2.clear()
        front_textures_book2.drawText("", 0, 0, nieRFont, "black", "white", true, true)

        let line = labelHeight
        for (let i = 0; i < max_lines_per_page && lineIndex < lines.length; i++) {
            const text = lines[lineIndex]
            front_textures_book2.drawText(text, column, line, nieRFont, "black", null, true, true)
            line += labelHeight - between_line
            lineIndex++
        }
    } else if (target % 2 == 0) {
        const book2_back_number = 50 + (target - 2) / 2
        const back_textures_book2 = await scene.getMeshByName('back_page_' + book2_back_number)?.material?.getActiveTextures().values().next().value as DynamicTexture
        back_textures_book2.clear()
        back_textures_book2.drawText("", 0, 0, nieRFont, "black", "white", true, true)

        let line = labelHeight
        for (let i = 0; i < max_lines_per_page && lineIndex < lines.length; i++) {
            const text = lines[lineIndex]
            back_textures_book2.drawText(text, column / 2, line, nieRFont, "black", null, true, true)
            back_textures_book2.vAng = Math.PI
            line += labelHeight - between_line
            lineIndex++
        }
    }
}