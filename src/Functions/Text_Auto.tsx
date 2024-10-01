import { DynamicTexture, Scene } from "@babylonjs/core"
import { getTextLayoutDetails } from "./Text_Layout"

export const textAutoEdit = (scene: Scene, updated_text: string, text_size: number) => {
    const font = "bold " + text_size + "px monospace"
    const pageLimit = 50
    const front_textures_info = []
    const back_textures_info = []
    const front_textures = []
    const back_textures = []
    const lines = []
    let textField = ""
    let { labelHeight, max_chars_per_line, max_lines_per_page, between_line, column } = getTextLayoutDetails(text_size)

    // Get texture for each page
    for (let i = 0; i < pageLimit; i++) {
        front_textures_info.push(scene.getMeshByName('front_page_' + i)?.material?.getActiveTextures())
        front_textures.push(front_textures_info[i]?.values().next().value as DynamicTexture)
        back_textures_info.push(scene.getMeshByName('back_page_' + i)?.material?.getActiveTextures())
        back_textures.push(back_textures_info[i]?.values().next().value as DynamicTexture)
    }

    const words = updated_text.split(/(\s|\n)/).filter(word => word !== ' ' && word !== '')

    for (let i = 0; i < words.length; i++) {
        let word = words[i]

        // Check if the word is longer than the maximum characters per line
        while (word.length > max_chars_per_line) {
            // Add the first part of the word that fits the line
            const split_word = word.slice(0, max_chars_per_line - textField.length)
            textField += (textField.length > 0 ? " " : "") + split_word
            lines.push(textField)
            textField = ""

            // Reduce the word by the split portion and continue
            word = word.slice(max_chars_per_line - textField.length)
        }

        if (word === "\n") {
            if (textField.length > 0) {
                lines.push(textField)
                textField = ""
            }
            if (i > 0 && words[i - 1] === "\n") {
                lines.push("")
            }
        } else {
            if (i > 0 && words[i - 1] === "\n") {
                textField = " " + word
            } else {
                if (textField.length + word.length + 1 <= max_chars_per_line) {
                    textField += (textField.length > 0 ? " " : "") + word
                } else {
                    lines.push(textField)
                    textField = word
                }
            }
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
            const text = lines[lineIndex]
            front_texture.drawText(text, column, line, font, "black", null, true, true)
            line += labelHeight - between_line
            lineIndex++
        }

        // draw on back_page
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