export function nieRTextLayoutDetails(text_size: number): { changedSize: number, nieR_labelHeight: number, nieR_max_chars_per_line: number, nieR_max_lines_per_page: number, nieR_between_line: number, nieR_column: number } {
    let changedSize = 22
    let nieR_labelHeight = 0
    let nieR_max_chars_per_line = 26
    let nieR_max_lines_per_page = 18
    let nieR_between_line = 10.5
    let nieR_column = 20

    switch (text_size) {
        case 10:
            changedSize = 8
            nieR_labelHeight = 16 + text_size
            nieR_max_chars_per_line = 52
            nieR_max_lines_per_page = 29
            nieR_between_line = 9.2
            nieR_column = 15
            break
        case 12:
            changedSize = 9
            nieR_labelHeight = 16 + text_size
            nieR_max_chars_per_line = 45
            nieR_max_lines_per_page = 27
            nieR_between_line = 10
            nieR_column = 20
            break
        case 14:
            changedSize = 10
            nieR_labelHeight = 16 + text_size
            nieR_max_chars_per_line = 39
            nieR_max_lines_per_page = 25
            nieR_between_line = 11
            nieR_column = 20
            break
        case 16:
            changedSize = 12
            nieR_labelHeight = 16 + text_size
            nieR_max_chars_per_line = 35
            nieR_max_lines_per_page = 23
            nieR_between_line = 11
            nieR_column = 10
            break
        case 18:
            changedSize = 14
            nieR_labelHeight = 16 + text_size
            nieR_max_chars_per_line = 31
            nieR_max_lines_per_page = 21
            nieR_between_line = 11
            nieR_column = 10
            break
        case 20:
            changedSize = 15
            nieR_labelHeight = 16 + text_size
            nieR_max_chars_per_line = 29
            nieR_max_lines_per_page = 19
            nieR_between_line = 11
            nieR_column = 10
            break
        case 22:
            changedSize = 16
            nieR_labelHeight = 15 + text_size
            nieR_between_line = 11
            nieR_column = 30
            break
        case 24:
            changedSize = 17
            nieR_labelHeight = 15 + 62 + ((text_size - 100) * 0.5)
            nieR_max_chars_per_line = 25
            nieR_max_lines_per_page = 17
            nieR_between_line = 11
            nieR_column = 10
            break
        case 26:
            changedSize = 18
            nieR_labelHeight = 15 + 62 + ((text_size - 100) * 0.5)
            nieR_max_chars_per_line = 23
            nieR_max_lines_per_page = 16
            nieR_between_line = 11
            nieR_column = 10
            break
        case 28:
            changedSize = 20
            nieR_labelHeight = 15 + 63 + ((text_size - 100) * 0.5)
            nieR_max_chars_per_line = 22
            nieR_max_lines_per_page = 15
            nieR_between_line = 10.8
            nieR_column = 1
            break
        case 30:
            changedSize = 22
            nieR_labelHeight = 15 + 63 + ((text_size - 100) * 0.5)
            nieR_max_chars_per_line = 20
            nieR_max_lines_per_page = 15
            nieR_between_line = 11.8
            nieR_column = 1
            break
        case 32:
            changedSize = 24
            nieR_labelHeight = 15 + 64 + ((text_size - 100) * 0.5)
            nieR_max_chars_per_line = 19
            nieR_max_lines_per_page = 14
            nieR_between_line = 11.5
            nieR_column = 1
            break
        case 34:
            changedSize = 26
            nieR_labelHeight = 15 + 64 + ((text_size - 100) * 0.5)
            nieR_max_chars_per_line = 18
            nieR_max_lines_per_page = 14
            nieR_between_line = 12.5
            nieR_column = 1
            break
        case 36:
            changedSize = 26
            nieR_labelHeight = 15 + 65 + ((text_size - 100) * 0.5)
            nieR_max_chars_per_line = 17
            nieR_max_lines_per_page = 13
            nieR_between_line = 12
            nieR_column = 1
            break
        case 38:
            changedSize = 28
            nieR_labelHeight = 15 + 65 + ((text_size - 100) * 0.5)
            nieR_max_chars_per_line = 16
            nieR_max_lines_per_page = 13
            nieR_between_line = 13
            nieR_column = 1
            break
        case 40:
            changedSize = 31
            nieR_labelHeight = 15 + 66 + ((text_size - 100) * 0.5)
            nieR_max_chars_per_line = 15
            nieR_max_lines_per_page = 12
            nieR_between_line = 12
            nieR_column = 1
            break
        case 42:
            changedSize = 32
            nieR_labelHeight = 15 + 67 + ((text_size - 100) * 0.5)
            nieR_max_chars_per_line = 14
            nieR_max_lines_per_page = 11
            nieR_between_line = 10
            nieR_column = 1
            break
        case 44:
            changedSize = 33.5
            nieR_labelHeight = 15 + 67 + ((text_size - 100) * 0.5)
            nieR_max_chars_per_line = 14
            nieR_max_lines_per_page = 11
            nieR_between_line = 10
            nieR_column = 1
            break
        case 48:
            changedSize = 39
            nieR_labelHeight = 15 + 68 + ((text_size - 100) * 0.5)
            nieR_max_chars_per_line = 12
            nieR_max_lines_per_page = 10
            nieR_between_line = 10
            nieR_column = 1
            break
        case 54:
            changedSize = 43
            nieR_labelHeight = 15 + 70 + ((text_size - 100) * 0.5)
            nieR_max_chars_per_line = 11
            nieR_max_lines_per_page = 9
            nieR_between_line = 10
            nieR_column = 1
            break
        case 62:
            changedSize = 47
            nieR_labelHeight = 15 + 73 + ((text_size - 100) * 0.5)
            nieR_max_chars_per_line = 10
            nieR_max_lines_per_page = 8
            nieR_between_line = 9
            nieR_column = 1
            break
        case 72:
            changedSize = 58
            nieR_labelHeight = 15 + 75 + ((text_size - 100) * 0.5)
            nieR_max_chars_per_line = 8
            nieR_max_lines_per_page = 7
            nieR_between_line = 10
            nieR_column = 1
            break
        case 84:
            changedSize = 65
            nieR_labelHeight = 15 + 79 + ((text_size - 100) * 0.5)
            nieR_max_chars_per_line = 7
            nieR_max_lines_per_page = 6
            nieR_between_line = 10
            nieR_column = 1
            break
        case 100:
            changedSize = 79
            nieR_labelHeight = 15 + 84 + ((text_size - 100) * 0.5)
            nieR_max_chars_per_line = 6
            nieR_max_lines_per_page = 5
            nieR_between_line = 10
            nieR_column = -1
            break
        case 124:
            changedSize = 95
            nieR_labelHeight = 15 + 91 + ((text_size - 100) * 0.5)
            nieR_max_chars_per_line = 5
            nieR_max_lines_per_page = 4
            nieR_between_line = 10
            nieR_column = -1
            break
        case 166:
            changedSize = 162
            nieR_labelHeight = 15 + 103 + ((text_size - 100) * 0.5)
            nieR_max_chars_per_line = 3
            nieR_max_lines_per_page = 3
            nieR_between_line = -10
            nieR_column = -4
            break
        case 250:
            changedSize = 240
            nieR_labelHeight = 15 + 128 + ((text_size - 100) * 0.5)
            nieR_max_chars_per_line = 2
            nieR_max_lines_per_page = 2
            nieR_between_line = -25
            nieR_column = 0
            break
        case 500:
            changedSize = 500
            nieR_labelHeight = 15 + 200 + ((text_size - 100) * 0.5)
            nieR_max_chars_per_line = 1
            nieR_max_lines_per_page = 1
            nieR_between_line = 0
            nieR_column = -10
            break
        default:
            changedSize = 22
            nieR_labelHeight = 0 // Default case if text_size does not match any condition
            nieR_max_chars_per_line = 25
            nieR_max_lines_per_page = 18
            nieR_between_line = 11
            nieR_column = 20
    }
    return { changedSize, nieR_labelHeight, nieR_max_chars_per_line, nieR_max_lines_per_page, nieR_between_line, nieR_column }
}