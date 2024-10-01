import { DynamicTexture, Scene } from "@babylonjs/core"
import { getTextLayoutDetails } from "./Text_Layout"

export const textFreeEdit = (scene: Scene, updated_text: string, text_size: number) => {
    const font = "bold " + text_size + "px monospace"
    const front_textures_info = []
    const back_textures_info = []
    const front_textures = []
    const back_textures = []
    const pageLimit = 50

    let { labelHeight, max_chars_per_line, max_lines_per_page, between_line, column } = getTextLayoutDetails(text_size)

    // Get texture for each page
    for (let i = 0; i < pageLimit; i++) {
        front_textures_info.push(scene.getMeshByName('front_page_' + i)?.material?.getActiveTextures())
        front_textures.push(front_textures_info[i]?.values().next().value as DynamicTexture)
        back_textures_info.push(scene.getMeshByName('back_page_' + i)?.material?.getActiveTextures())
        back_textures.push(back_textures_info[i]?.values().next().value as DynamicTexture)
    }

    const lines = []
    let textField = ""
    let text = ""

    // Split the text into lines
    for (let i = 0; i < updated_text.length; i++) {
        textField += updated_text[i]
        if (textField.length >= max_chars_per_line || updated_text[i] === '\n') {
            lines.push(textField)
            textField = ""
        }
    }
    if (textField.length > 0) { lines.push(textField) }

    let currentPage = 0
    let lineIndex = 0
    while (currentPage < pageLimit) {
        const front_texture = front_textures[currentPage]
        const back_texture = back_textures[currentPage]

        front_texture.clear()
        back_texture.clear()
        front_texture.drawText("", 0, 0, font, "black", "white", true, true)
        back_texture.drawText("", 0, 0, font, "black", "white", true, true)

        let line = labelHeight

        // draw on front_page
        for (let i = 0; i < max_lines_per_page && lineIndex < lines.length; i++) {
            text = lines[lineIndex]
            front_texture.drawText(text, column, line, font, "black", null, true, true)
            line += labelHeight - between_line
            lineIndex++
        }

        // draw on back_page
        if (lineIndex < lines.length) {
            line = labelHeight
            for (let i = 0; i < max_lines_per_page && lineIndex < lines.length; i++) {
                text = lines[lineIndex]
                back_texture.drawText(text, column / 2, line, font, "black", null, true, true)
                back_texture.vAng = Math.PI
                line += labelHeight - between_line
                lineIndex++
            }
        }
        currentPage++
    }
}