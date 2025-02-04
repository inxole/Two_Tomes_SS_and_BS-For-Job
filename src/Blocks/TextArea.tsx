import { useRecoilState, useRecoilValue } from 'recoil'
import { Long_Text, Text_Switch_Automatic, Text_Switch_Freedom, BookMark, TextReSize, PagesText, EditingTextNumber } from '../atom'
import { pagesTextEdit } from '../Text/Pages_Text'
import { useEffect } from 'react'

const renderTextAreas = () => {
  const text_update_F = useRecoilValue(Text_Switch_Freedom)
  const text_update_A = useRecoilValue(Text_Switch_Automatic)
  const [updatedText, setUpdatedText] = useRecoilState(Long_Text)
  const bookmark = useRecoilValue(BookMark)
  const text_size = useRecoilValue(TextReSize)
  const [pages, setPages] = useRecoilState(PagesText)
  const [, setEditNumber] = useRecoilState(EditingTextNumber)

  useEffect(() => {
    if (text_update_A === false && text_update_F === false) { return }
    pagesTextEdit(updatedText, text_size, text_update_A).then(newPages => {
      setPages(newPages)
    })
  }, [text_update_A, text_update_F])

  if (bookmark === 0) {
    return (
      <div style={{ ...ParentStyle }}>
        <textarea
          style={{ ...ChildStyle, resize: 'none' }}
          placeholder='文章を入力してください...'
          value={updatedText}
          onChange={e => setUpdatedText(e.target.value)}
        />
      </div>
    )
  } else if (bookmark === 1) {
    return (
      <div style={{ ...ParentStyle }} >
        <textarea
          style={{ ...ChildStyle, resize: 'none' }}
          value={pages[0]}
          onFocus={() => setEditNumber(1)}
          onChange={e => {
            const newText = e.target.value.split('\n')
            setPages(prevPages => {
              const updatedPages = [...prevPages]
              updatedPages[0] = newText.join('\n')
              return updatedPages
            })
          }}
        />
      </div>
    )
  } else if (bookmark >= 2 && bookmark <= 50) {
    const startIndex = (bookmark - 1) * 2 - 1
    return (
      <div style={{ ...ParentStyle }} >
        {pages.slice(startIndex, startIndex + 2).map((page, index) => (
          <textarea
            key={`container_${index}`}
            style={{
              width: '50%', height: '230px',
              resize: 'none',
              border: '1px solid #ccc',
              backgroundColor: 'rgba(255, 255, 255, 1)',
              boxSizing: 'border-box',
              flexShrink: 0,
              padding: '4px', borderRadius: '4px',
              margin: '0px'
            }}
            value={page}
            placeholder={`page ${startIndex + index + 1}`}
            onFocus={() => setEditNumber(startIndex + index + 1)}
            onChange={e => {
              setPages([
                ...pages.slice(0, startIndex + index),
                e.target.value,
                ...pages.slice(startIndex + index + 1)
              ])
            }}
          />
        ))}
      </div>
    )
  } else if (bookmark === 51) {
    return (
      <div style={{ ...ParentStyle }}>
        <textarea
          style={{ ...ChildStyle, resize: 'none' }}
          value={pages[99]}
          onFocus={() => setEditNumber(100)}
          onChange={e => {
            const newText = e.target.value.split('\n')
            setPages(prevPages => {
              const updatedPages = [...prevPages]
              updatedPages[99] = newText.join('\n')
              return updatedPages
            })
          }}
        />
      </div>
    )
  }
}

const ParentStyle = { width: '320px', height: '230px', display: 'flex', overflow: 'visible' }
const ChildStyle = {
  width: '310px', height: '220px', padding: '4px', borderRadius: '4px', margin: '0px',
  border: '1px solid #ccc', overflow: 'auto', backgroundColor: 'rgba(255, 255, 255, 1)',
}
export default renderTextAreas 