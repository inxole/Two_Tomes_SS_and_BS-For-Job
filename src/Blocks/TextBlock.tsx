import { useRecoilState, useRecoilValue } from 'recoil'
import { Long_Text, Text_Switch_Automatic, Text_Switch_Freedom, BookMark, TextReSize, PagesText, EditingTextNumber } from '../atom'
import { Button, Tooltip } from '@mui/material'
import { pagesTextEdit } from '../Text/Pages_Text'
import { useEffect } from 'react'

function TextInput() {
  const [text_update_F, setText_update_F] = useRecoilState(Text_Switch_Freedom)
  const [text_update_A, setText_update_A] = useRecoilState(Text_Switch_Automatic)
  const [updatedText, setUpdatedText] = useRecoilState(Long_Text)
  const [bookmark] = useRecoilState(BookMark)
  const text_size = useRecoilValue(TextReSize)
  const [pages, setPages] = useRecoilState(PagesText)
  const [, setEditNumber] = useRecoilState(EditingTextNumber)
  const UpdateFree = () => { setUpdatedText(updatedText), setText_update_F(true) }
  const UpdateAuto = () => { setUpdatedText(updatedText), setText_update_A(true) }

  useEffect(() => {
    if (text_update_A === false && text_update_F === false) { return }
    pagesTextEdit(updatedText, text_size, text_update_A).then(newPages => {
      setPages(newPages)
    })
  }, [text_update_A, text_update_F])

  const renderTextAreas = () => {
    if (bookmark === 0) {
      return (
        <textarea
          style={{
            width: '100%', height: '100%',
            border: 'none', outline: 'none', resize: 'none', backgroundColor: 'rgba(255, 255, 255, 1)',
            padding: 0, borderRadius: '4px'
          }}
          placeholder='文章を入力してください...'
          value={updatedText}
          onChange={e => setUpdatedText(e.target.value)}
        />
      )
    } else if (bookmark === 1) {
      return (
        <textarea
          style={{
            width: '100%', height: '100%',
            border: 'none', outline: 'none', resize: 'none', backgroundColor: 'rgba(255, 255, 255, 1)',
            padding: 0, borderRadius: '4px'
          }}
          value={pages[0]?.join('\n') || ''}
          onFocus={() => setEditNumber(1)}
          onChange={e => {
            const newText = e.target.value.split('\n')
            setPages(prevPages => {
              const updatedPages = [...prevPages]
              updatedPages[0] = newText
              return updatedPages
            })
          }}
        />
      )
    } else if (bookmark >= 2 && bookmark <= 50) {
      const startIndex = (bookmark - 1) * 2 - 1
      return (
        <div style={{
          width: '100%', height: '100%',
          display: 'flex',
          overflowX: 'auto',
          overflowY: 'hidden',
          boxSizing: 'border-box',
          scrollSnapType: 'x mandatory'
        }}>
          {pages.slice(startIndex, startIndex + 2).map((page, index) => (
            <div
              key={`container_${index}`}
              style={{
                width: '100%', height: '100%',
                flexShrink: 0,
                scrollSnapAlign: 'start'
              }}
            >
              <textarea
                style={{
                  width: '100%', height: '100%',
                  resize: 'none',
                  border: '1px solid #ccc',
                  backgroundColor: 'rgba(255, 255, 255, 1)',
                  boxSizing: 'border-box',
                  flexShrink: 0,
                  padding: 0, borderRadius: '4px'
                }}
                value={page.join('\n')}
                onFocus={() => setEditNumber(startIndex + index + 1)}
                onChange={e => {
                  setPages([
                    ...pages.slice(0, startIndex + index),
                    e.target.value.split('\n'),
                    ...pages.slice(startIndex + index + 1)
                  ])
                }}
              />
            </div>
          ))}
        </div>
      )
    } else if (bookmark === 51) {
      return (
        <textarea
          style={{
            width: '100%', height: '100%',
            border: 'none', outline: 'none', resize: 'none', backgroundColor: 'rgba(255, 255, 255, 1)',
            padding: 0, borderRadius: '4px'
          }}
          value={pages[99]?.join('\n') || ''}
          onFocus={() => setEditNumber(100)}
          onChange={e => {
            const newText = e.target.value.split('\n')
            setPages(prevPages => {
              const updatedPages = [...prevPages]
              updatedPages[99] = newText
              return updatedPages
            })
          }}
        />
      )
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '330px' }}>
      {renderTextAreas()}
      <span style={{ display: 'flex', justifyContent: 'center', padding: '2px 0px' }}>文章の一括変更</span>
      <span style={{ display: 'flex', justifyContent: 'center' }}>
        <Tooltip title="入力された文章をそのままテクスチャに描画します（単語が見切れる可能性があります）。">
          <Button size='small' variant='outlined' onClick={UpdateFree} style={{ marginRight: '5px', width: '80px' }}>そのまま</Button>
        </Tooltip>
        <Tooltip title="入力された文章を自動的に調整し、単語が見切れないように描画します。">
          <Button size='small' variant='outlined' onClick={UpdateAuto} style={{ width: '80px' }}>お任せ</Button>
        </Tooltip>
      </span>
    </div >
  )
}

export default TextInput