export function getTextLayoutDetails(text_size: number): { labelHeight: number, max_chars_per_line: number, max_lines_per_page: number, between_line: number, column: number } {
    let labelHeight = 0
    let max_chars_per_line = 26
    let max_lines_per_page = 18
    let between_line = 10.5
    let column = 20

    switch (text_size) {
        case 10:
            labelHeight = 16 + text_size
            max_chars_per_line = 52
            max_lines_per_page = 29
            between_line = 9.2
            column = 20.8
            break
        case 12:
            labelHeight = 16 + text_size
            max_chars_per_line = 45
            max_lines_per_page = 27
            between_line = 10
            column = 20.8
            break
        case 14:
            labelHeight = 16 + text_size
            max_chars_per_line = 39
            max_lines_per_page = 25
            between_line = 10.5
            column = 20.8
            break
        case 16:
            labelHeight = 16 + text_size
            max_chars_per_line = 35
            max_lines_per_page = 23
            between_line = 11
            column = 20.6
            break
        case 18:
            labelHeight = 16 + text_size
            max_chars_per_line = 31
            max_lines_per_page = 21
            between_line = 11
            column = 20.8
            break
        case 20:
            labelHeight = 16 + text_size
            max_chars_per_line = 29
            max_lines_per_page = 19
            between_line = 10.5
            column = 20.8
            break
        case 22:
            labelHeight = 15 + text_size
            break
        case 24:
            labelHeight = 15 + 62 + ((text_size - 100) * 0.5)
            max_chars_per_line = 25
            max_lines_per_page = 17
            between_line = 10.5
            column
            break
        case 26:
            labelHeight = 15 + 62 + ((text_size - 100) * 0.5)
            max_chars_per_line = 23
            max_lines_per_page = 16
            between_line = 11
            column
            break
        case 28:
            labelHeight = 15 + 63 + ((text_size - 100) * 0.5)
            max_chars_per_line = 22
            max_lines_per_page = 15
            between_line = 10
            column
            break
        case 30:
            labelHeight = 15 + 63 + ((text_size - 100) * 0.5)
            max_chars_per_line = 20
            max_lines_per_page = 15
            between_line = 11
            column
            break
        case 32:
            labelHeight = 15 + 64 + ((text_size - 100) * 0.5)
            max_chars_per_line = 19
            max_lines_per_page = 14
            between_line = 10.5
            column
            break
        case 34:
            labelHeight = 15 + 64 + ((text_size - 100) * 0.5)
            max_chars_per_line = 18
            max_lines_per_page = 14
            between_line = 11.5
            column
            break
        case 36:
            labelHeight = 15 + 65 + ((text_size - 100) * 0.5)
            max_chars_per_line = 17
            max_lines_per_page = 13
            between_line = 11
            column = 19.4
            break
        case 38:
            labelHeight = 15 + 65 + ((text_size - 100) * 0.5)
            max_chars_per_line = 16
            max_lines_per_page = 13
            between_line = 11.5
            column = 19
            break
        case 40:
            labelHeight = 15 + 66 + ((text_size - 100) * 0.5)
            max_chars_per_line = 15
            max_lines_per_page = 12
            between_line = 10.5
            column = 19
            break
        case 42:
            labelHeight = 15 + 67 + ((text_size - 100) * 0.5)
            max_chars_per_line = 14
            max_lines_per_page = 11
            between_line = 9.5
            column = 19
            break
        case 44:
            labelHeight = 15 + 67 + ((text_size - 100) * 0.5)
            max_chars_per_line = 14
            max_lines_per_page = 11
            between_line = 10
            column = 19
            break
        case 48:
            labelHeight = 15 + 68 + ((text_size - 100) * 0.5)
            max_chars_per_line = 12
            max_lines_per_page = 10
            between_line = 8
            column = 18.8
            break
        case 54:
            labelHeight = 15 + 70 + ((text_size - 100) * 0.5)
            max_chars_per_line = 11
            max_lines_per_page = 9
            between_line = 10
            column = 18
            break
        case 62:
            labelHeight = 15 + 73 + ((text_size - 100) * 0.5)
            max_chars_per_line = 10
            max_lines_per_page = 8
            between_line = 9
            column = 18
            break
        case 72:
            labelHeight = 15 + 75 + ((text_size - 100) * 0.5)
            max_chars_per_line = 8
            max_lines_per_page = 7
            between_line = 6
            column = 17
            break
        case 84:
            labelHeight = 15 + 79 + ((text_size - 100) * 0.5)
            max_chars_per_line = 7
            max_lines_per_page = 6
            between_line = 5
            column = 16.8
            break
        case 100:
            labelHeight = 15 + 84 + ((text_size - 100) * 0.5)
            max_chars_per_line = 6
            max_lines_per_page = 5
            between_line = 1
            column = 16
            break
        case 124:
            labelHeight = 15 + 91 + ((text_size - 100) * 0.5)
            max_chars_per_line = 5
            max_lines_per_page = 4
            between_line = -2
            column = 14.6
            break
        case 166:
            labelHeight = 15 + 103 + ((text_size - 100) * 0.5)
            max_chars_per_line = 3
            max_lines_per_page = 3
            between_line = -10
            column = 40
            break
        case 250:
            labelHeight = 15 + 128 + ((text_size - 100) * 0.5)
            max_chars_per_line = 2
            max_lines_per_page = 2
            between_line = -25
            column = 40
            break
        case 500:
            labelHeight = 15 + 200 + ((text_size - 100) * 0.5)
            max_chars_per_line = 1
            max_lines_per_page = 1
            between_line = 0
            column = 45
            break
        default:
            labelHeight = 0 // Default case if text_size does not match any condition
            max_chars_per_line = 25
            max_lines_per_page = 18
            between_line = 11
            column = 20
    }
    return { labelHeight, max_chars_per_line, max_lines_per_page, between_line, column }
}