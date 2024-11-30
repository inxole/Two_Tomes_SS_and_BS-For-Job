import { useRecoilState, useRecoilValue } from 'recoil'
import { Long_Text, Text_Switch_Automatic, Text_Switch_Freedom, BookMark, TextReSize } from '../atom'
import { Button } from '@mui/material'
import { pagesTextEdit } from '../Text/Pages_Text'
import { useEffect, useState } from 'react'

function TextInput() {
  const [text_update_F, setText_update_F] = useRecoilState(Text_Switch_Freedom)
  const [text_update_A, setText_update_A] = useRecoilState(Text_Switch_Automatic)
  const [updatedText, setUpdatedText] = useRecoilState(Long_Text)
  const [bookmark] = useRecoilState(BookMark)
  const text_size = useRecoilValue(TextReSize)
  const [pages, setPages] = useState<string[][]>([])

  const UpdateFree = () => {
    setUpdatedText(updatedText)
    setText_update_F(true)
  }

  const UpdateAuto = () => {
    setUpdatedText(updatedText)
    setText_update_A(true)
  }

  useEffect(() => {
    if (text_update_A === false && text_update_F === false) { return }
    pagesTextEdit(updatedText, text_size, text_update_A).then(newPages => {
      setPages(newPages)
    })
  }, [text_update_A, text_update_F])

  // 初期レンダリング時に pages を初期化
  useEffect(() => {
    pagesTextEdit(updatedText, text_size, text_update_A).then(newPages => {
      setPages(newPages)
    })
  }, [])

  const renderTextAreas = () => {
    if (bookmark === 0) {
      return (
        <textarea
          style={{
            width: '98.5%', height: '100%',
            border: 'none', outline: 'none', resize: 'none', backgroundColor: 'rgba(255, 255, 255, 1)',
            padding: 0
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
            width: '98.5%', height: '100%',
            border: 'none', outline: 'none', resize: 'none', backgroundColor: 'rgba(255, 255, 255, 1)',
            padding: 0
          }}
          placeholder='Page 1'
          value={pages[0]?.join('\n') || ''}
          readOnly
        />
      )
    } else if (bookmark >= 2 && bookmark <= 50) {
      const startIndex = (bookmark - 1) * 2 - 1; // 修正: bookmark に基づきスライスの開始位置を調整
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
                  padding: 0
                }}
                placeholder={`Page ${startIndex + index + 1}`} // ページ番号を調整
                value={page.join('\n')}
                readOnly
              />
            </div>
          ))}
        </div>
      );
    }
    else if (bookmark === 51) {
      return (
        <textarea
          style={{
            width: '98.5%', height: '100%',
            border: 'none', outline: 'none', resize: 'none', backgroundColor: 'rgba(255, 255, 255, 1)',
            padding: 0
          }}
          placeholder='Page 100'
          value={pages[99]?.join('\n') || ''}
          readOnly
        />
      )
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      {renderTextAreas()}
      <div style={{ display: 'flex', paddingTop: '5px', alignSelf: 'flex-end' }}>
        <div style={{ paddingRight: '5px', paddingTop: '10px' }}>UPDATE</div>
        <Button size='small' variant='outlined' onClick={UpdateFree} style={{ marginRight: '5px' }}>Free</Button>
        <Button size='small' variant='outlined' onClick={UpdateAuto}>Auto</Button>
      </div>
    </div>
  )
}

export default TextInput