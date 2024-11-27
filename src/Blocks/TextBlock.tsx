import { useRecoilState } from 'recoil'
import { Long_Text, Text_Switch_Automatic, Text_Switch_Freedom, BookMark } from '../atom'
import { Button } from '@mui/material'

function TextInput() {
  const [, setText_update_F] = useRecoilState(Text_Switch_Freedom)
  const [, setText_update_A] = useRecoilState(Text_Switch_Automatic)
  const [updatedText, setUpdatedText] = useRecoilState(Long_Text)
  const [bookmark] = useRecoilState(BookMark)

  const UpdateFree = () => {
    setUpdatedText(updatedText)
    setText_update_F(true)
  }

  const UpdateAuto = () => {
    setUpdatedText(updatedText)
    setText_update_A(true)
  }

  const renderTextAreas = () => {
    if (bookmark === 0) {
      return (
        <textarea
          style={{
            width: '98.5%', height: '100%',
            border: 'none', outline: 'none', resize: 'none', backgroundColor: 'rgba(255, 255, 255, 1)',
            padding: 0 // 追加
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
            padding: 0 // 追加
          }}
          placeholder='Page 1'
        />
      )
    } else if (bookmark >= 2 && bookmark <= 50) {
      const pages = []
      for (let i = 0; i < 2; i++) {
        pages.push(
          <textarea
            key={`page_${bookmark * 2 + i - 2}`}
            style={{
              width: '100%', height: '100%',
              resize: 'none',
              border: '1px solid #ccc',
              backgroundColor: 'rgba(255, 255, 255, 1)',
              boxSizing: 'border-box', // パディングを含めた計算
              flexShrink: 0, // 要素の縮小を防止
            }}
            placeholder={`Page ${bookmark * 2 + i - 2}`}
          />
        )
      }
      return (
        <div style={{
          width: '100%', height: '100%',
          display: 'flex',
          overflowX: 'auto', // 横スクロールを有効化
          overflowY: 'hidden', // 縦スクロールを禁止
          boxSizing: 'border-box', // パディングを含めた計算
          scrollSnapType: 'x mandatory' // スクロールスナップを有効化
        }}>
          {pages.map((page, index) => (
            <div
              key={`container_${index}`}
              style={{
                width: '100%', height: '100%',
                flexShrink: 0,
                scrollSnapAlign: 'start' // スクロール位置を調整
              }}
            >
              {page}
            </div>
          ))}
        </div>
      )
    }
    else if (bookmark === 51) {
      return (
        <textarea
          style={{
            width: '98.5%', height: '100%',
            border: 'none', outline: 'none', resize: 'none', backgroundColor: 'rgba(255, 255, 255, 1)',
          }}
          placeholder='Page 100'
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
