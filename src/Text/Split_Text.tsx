export const splitTextIntoLines_Free = (updated_text: string, Limit_number: number) => {
  const lines_Free: string[] = []
  const segments = updated_text.split('\n')

  for (const segment of segments) {
    if (segment === "") {
      lines_Free.push("")
    } else {
      let currentLine = ""
      for (let i = 0; i < segment.length; i++) {
        currentLine += segment[i]
        if (currentLine.length >= Limit_number) {
          lines_Free.push(currentLine)
          currentLine = ""
        }
      }
      if (currentLine.length > 0) {
        lines_Free.push(currentLine)
      }
    }
  }
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
