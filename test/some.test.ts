import { describe, test, expect } from "vitest"

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

describe("Test break", () => {
  test("Free break", () => {
    const updated_text = "This is a test\nof the emergency broadcast system"
    const result = splitTextIntoLines_Free(updated_text)
    expect(result).toEqual(["This is a test\n", "of the emergency broadcast", " system"])
  })
})