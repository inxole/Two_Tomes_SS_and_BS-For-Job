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
const splitTextIntoLines_Auto = (updated_text: string) => {
  const words = updated_text.split(/(\s|\n)/).filter(word => word !== ' ' && word !== '')
  for (let i = 0; i < words.length; i++) {
    let word = words[i]
    while (word.length > max_chars_per_line) {
      const split_word = word.slice(0, max_chars_per_line - textField_Auto.length)
      textField_Auto += (textField_Auto.length > 0 ? " " : "") + split_word
      Lines_Auto.push(textField_Auto)
      textField_Auto = ""
      word = word.slice(max_chars_per_line - textField_Auto.length)
    }
    if (word === "\n") {
      if (textField_Auto.length > 0) Lines_Auto.push(textField_Auto)
      // Lines_Auto.push("")
      textField_Auto = ""
    } else {
      if (textField_Auto.length + word.length + 1 <= max_chars_per_line) {
        textField_Auto += " " + word
      } else {
        Lines_Auto.push(textField_Auto)
        textField_Auto = word
      }
    }
  }
  if (textField_Auto.length > 0) Lines_Auto.push(textField_Auto)
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
})