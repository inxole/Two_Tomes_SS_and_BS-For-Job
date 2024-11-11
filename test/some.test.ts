import { describe, test, expect, beforeEach } from "vitest"

const max_chars_per_line = 26

let textField_Free = ""
const lines_Free: string[] = []
const splitTextIntoLines_Free = (updated_text: string) => {
  for (let i = 0; i < updated_text.length; i++) {
    textField_Free += updated_text[i]
    if (textField_Free.length >= max_chars_per_line || updated_text[i] === '\n') {
      lines_Free.push(textField_Free)
      textField_Free = ""
    }
  }
  if (textField_Free.length > 0) { lines_Free.push(textField_Free) }
  return lines_Free
}

let textField_Auto = ""
let Lines_Auto: string[] = []
const splitTextIntoLines_Auto = (updated_text:string) => {
  const lines = updated_text.split(/\n/) // ①\nで文章をすべて分ける

  let isNewParagraph = true // 改行や空行の後かをチェックするフラグ
  lines.forEach((line: string) => {
    // ②I,II,IIIをそれぞれ分けて変数に保存
    if (/^\s+\S/.test(line)) {
      // I. 複数のスペース＋title\n
      Lines_Auto.push(line) // そのまま格納
      isNewParagraph = true
    } else if (line.trim() === "") {
      // II. 空行
      Lines_Auto.push("") // 空行を格納
      isNewParagraph = true
    } else {
      // III. 文章行
      const words = line.split(/\s+/)
      let textField_Auto = isNewParagraph ? " " : "" // 新しい段落の場合、先頭にスペースを追加
      words.forEach((word) => {
        if (textField_Auto.length + word.length + 1 <= max_chars_per_line) {
          textField_Auto += (textField_Auto.length > 1 ? " " : "") + word // スペースを挿入して単語を追加
        } else {
          Lines_Auto.push(textField_Auto.trimEnd()) // 現在の行を格納
          textField_Auto = word // 次の行を開始
        }
      })
      if (textField_Auto) Lines_Auto.push(textField_Auto.trimEnd()) // 残りの単語を追加
      isNewParagraph = false
    }
  })

  return Lines_Auto
}

describe("Line break test when was pushed free button", () => {
  test("Line break test", () => {
    const updated_text = "This is a test\nof the emergency broadcast system"
    const result = splitTextIntoLines_Free(updated_text)
    expect(result).toEqual(["This is a test\n", "of the emergency broadcast", " system"])
  })
})

describe("Line break test when was pushed auto button", () => {
  beforeEach(() => { Lines_Auto = [], textField_Auto = "" })

  test("Test to include words within specified line spacing", () => {
    const updated_text = "This is a test of the emergency broadcast system."
    splitTextIntoLines_Auto(updated_text)
    expect(Lines_Auto).toEqual([" This is a test of the", "emergency broadcast", "system."])
  })

  test("Paragraph processing", () => {
    const updated_text = "Once upon a time, there lived an old couple in a small village.\nOne day the old wife was washing her clothes in the river when a huge peach came tumbling down the stream."
    splitTextIntoLines_Auto(updated_text)
    expect(Lines_Auto).toEqual([
      " Once upon a time, there",
      "lived an old couple in a",
      "small village.",
      " One day the old wife was",
      "washing her clothes in the",
      "river when a huge peach",
      "came tumbling down the",
      "stream.",
    ])
  })

  test("Paragraph processing with space", () => {
    const updated_text = "Once upon a time, there lived an old couple in a small village.\n One day the old wife was washing her clothes in the river when a huge peach came tumbling down the stream."
    splitTextIntoLines_Auto(updated_text)
    expect(Lines_Auto).toEqual([
      " Once upon a time, there",
      "lived an old couple in a",
      "small village.",
      " One day the old wife was",
      "washing her clothes in the",
      "river when a huge peach",
      "came tumbling down the",
      "stream.",
    ])
  })


  test("title test", () => {
    const updated_text = "     STEP1\n\nOnce upon a time, there lived an old couple in a small village.\n\n     STEP2\n\nOne day the old wife was washing her clothes in the river when a huge peach came tumbling down the stream."
    splitTextIntoLines_Auto(updated_text)
    expect(Lines_Auto).toEqual([
      "     STEP1",
      "",
      " Once upon a time, there",
      "lived an old couple in a",
      "small village.",
      "",
      "     STEP2",
      "",
      " One day the old wife was",
      "washing her clothes in the",
      "river when a huge peach",
      "came tumbling down the",
      "stream.",
    ])
  })
})