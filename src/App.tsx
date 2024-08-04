import { useState } from 'react'
import { Box, Button, Slider } from '@mui/material'
import { Rnd } from 'react-rnd'
import { useRecoilState } from 'recoil'
import { Long_Text, Text_Switch, BookMark, CoverOpen } from './atom'
import CanvasComponent from './Page'

interface RndComponentProps {
  fontSize: number
  setFontSize: (size: number) => void
  bookmark: number
  setBookmark: (count: number) => void
  coverSwitch: boolean
  setCoverSwitch: (state: boolean) => void
}

function RndComponent(props: RndComponentProps) {
  const { fontSize, setFontSize, bookmark, setBookmark, coverSwitch, setCoverSwitch } = props
  const [, setText_update] = useRecoilState(Text_Switch)
  const [updatedText, setUpdatedText] = useRecoilState(Long_Text)

  const handleUpdate = () => {
    setUpdatedText(updatedText)
    setText_update(true)
  }

  return (
    <Rnd
      default={{ x: 400, y: 20, width: 350, height: 480 }}
      style={{ backgroundColor: 'rgba(255, 255, 255, 0.65)', padding: '10px', borderRadius: '8px', paddingBottom: '5px', paddingTop: '40px' }}
      enableResizing={{
        bottom: true,
        bottomLeft: true,
        bottomRight: true,
        left: true,
        right: true,
        top: true,
        topLeft: true,
        topRight: true,
      }}
      minWidth={350}
      minHeight={480}
    >
      <div
        style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
        onMouseDown={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
      >
        <textarea
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            outline: 'none',
            resize: 'none',
            backgroundColor: 'rgba(255, 255, 255, 1)',
          }}
          placeholder='文章を入力してください...'
          value={updatedText}
          onChange={e => setUpdatedText(e.target.value)}
        />
        <div style={{ paddingTop: '5px', alignSelf: 'flex-end' }}>
          <Button size='small' variant='outlined' onClick={handleUpdate}>
            Update
          </Button>
        </div>
        <div style={{ width: '324px', height: '120px', padding: '2px', marginTop: '5px', marginBottom: '5px', border: '1px solid black', borderRadius: '8px' }}>
          <span style={{ marginRight: '10px' }}>フォントサイズ</span>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
            <input
              type='number'
              value={fontSize}
              onChange={(e) => {
                const newValue = Number(e.target.value)
                if (newValue >= 10 && newValue <= 100) {
                  setFontSize(newValue)
                }
              }}
              min={10}
              max={100}
              style={{ width: '60px', marginRight: '10px' }}
            />
            <Slider
              value={fontSize}
              onChange={(_, newValue) => setFontSize(newValue as number)}
              aria-labelledby='font-size-slider'
              valueLabelDisplay='auto'
              step={1}
              min={10}
              max={100}
              style={{ flexGrow: 1 }}
            />
          </div>
        </div>
        <div style={{ width: '330px', height: '200px', display: 'flex', paddingBottom: '5px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', marginTop: '5px', marginRight: '5px', border: '1px solid black', borderRadius: '8px', padding: '2px' }}>
            <span>表紙</span>
            <Button
              size='small'
              variant="contained"
              color="primary"
              onClick={() => setCoverSwitch(true)}
              style={{ margin: '5px 0' }}
              disabled={coverSwitch ? true : false}
            >
              開く
            </Button>
            <Button
              size='small'
              variant="contained"
              color="primary"
              onClick={() => setCoverSwitch(false)}
              style={{ margin: '5px 0' }}
              disabled={!coverSwitch ? true : false}
            >
              閉じる
            </Button>
          </div>
          <div style={{ flexGrow: 1, marginTop: '5px', marginLeft: '5px', border: '1px solid black', borderRadius: '8px', padding: '5px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
              <span style={{ marginRight: '10px' }}>ページ管理</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontWeight: 'bold', fontSize: '16px', marginRight: '10px' }}>{bookmark === 0 ? "-" : bookmark * 2}</span>
              <span style={{ fontWeight: 'bold', fontSize: '16px', marginLeft: '10px' }}>{bookmark === 50 ? "-" : bookmark * 2 + 1}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '10px' }}>
              <Slider
                value={bookmark}
                onChange={(_, newValue) => setBookmark(newValue as number)}
                aria-labelledby='page-count-slider'
                valueLabelDisplay='auto'
                step={1}
                min={0}
                max={50}
                style={{ flexGrow: 1, marginLeft: '10px' }}
                disabled={!coverSwitch ? true : false}
              />
            </div>
          </div>
        </div>

      </div>
    </Rnd>
  )
}

function BabylonScene() {
  const [fontSize, setFontSize] = useState(22)
  const [bookmark, setBookmark] = useRecoilState(BookMark)
  const [coverSwitch, setCoverSwitch] = useRecoilState(CoverOpen)

  return (
    <Box style={{ position: 'relative', width: '100%', height: '100%' }}>
      <CanvasComponent />
      <RndComponent
        fontSize={fontSize} setFontSize={setFontSize}
        bookmark={bookmark} setBookmark={setBookmark}
        coverSwitch={coverSwitch} setCoverSwitch={setCoverSwitch} />
    </Box>
  )
}

export default BabylonScene
