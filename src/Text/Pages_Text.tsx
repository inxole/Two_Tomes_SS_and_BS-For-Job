import { getTextLayoutDetails } from "./Text_Layout"
import { splitTextIntoLines_Free } from "./Split_Text"
import { splitTextIntoLines_Auto } from "./Split_Text"

export const pagesTextEdit = async (updated_text: string, text_size: number, state: boolean) => {
    const pageLimit = 100 // 総ページ数を設定
    let { max_chars_per_line, max_lines_per_page } = getTextLayoutDetails(text_size)

    // 行単位に分割
    const lines = state
        ? splitTextIntoLines_Auto(updated_text, max_chars_per_line)
        : splitTextIntoLines_Free(updated_text, max_chars_per_line)

    // ページ単位でまとめた文字列を格納
    const allLines: string[] = []
    let lineIndex = 0

    for (let currentPage = 0; currentPage < pageLimit; currentPage++) {
        const pageLines: string[] = []

        // max_lines_per_page分だけlinesから取得してpageLinesに追加
        for (let i = 0; i < max_lines_per_page && lineIndex < lines.length; i++) {
            pageLines.push(lines[lineIndex])
            lineIndex++
        }

        // ページ内容をjoinで結合してallLinesに追加
        allLines.push(pageLines.join(""))

        if(pageLines.length === 0) {
            pageLines.push("")
        }
    }

    return allLines // ページ単位で結合された文字列を格納した配列を返す
}