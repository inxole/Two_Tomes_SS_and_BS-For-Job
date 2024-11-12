export const splitTextIntoLines_Free = (updated_text: string, Limit_number: number) => {
  const lines_Free: string[] = []
  let textField_Free = ""
  for (let i = 0; i < updated_text.length; i++) {
    textField_Free += updated_text[i]
    if (textField_Free.length >= Limit_number || updated_text[i] === '\n') {
      lines_Free.push(textField_Free)
      textField_Free = ""
    }
  }
  if (textField_Free.length > 0) { lines_Free.push(textField_Free) }
  return lines_Free
}

export const splitTextIntoLines_Auto = (updated_text: string, Limit_number: number) => {
  const Lines_Auto: string[] = []
  const lines = updated_text.split(/\n/)
  lines.forEach((line: string) => {
    if (/^\s+\S/.test(line) && !/^\s{1}\S/.test(line)) {
      Lines_Auto.push(line)
    } else if (line.trim() === "") {
      Lines_Auto.push("")
    } else {
      const words = line.split(/\s+/)
      let textField_Auto = " "
      words.forEach((word) => {
        if (textField_Auto.length + word.length + 1 <= Limit_number) {
          textField_Auto += (textField_Auto.length > 1 ? " " : "") + word
        } else {
          Lines_Auto.push(textField_Auto.trimEnd())
          textField_Auto = word
        }
      })
      if (textField_Auto) Lines_Auto.push(textField_Auto.trimEnd())
    }
  })
  return Lines_Auto
}
