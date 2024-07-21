import { useState } from 'react'
import { Box, Button, Slider } from '@mui/material'
import { Rnd } from 'react-rnd'
import { useRecoilState } from 'recoil'
import { Long_Text, Text_Switch, BookMark } from './atom'
import CanvasComponent from './Page'

interface RndComponentProps {
  fontSize: number
  setFontSize: (size: number) => void
  bookmark: number
  setBookmark: (count: number) => void
}

function RndComponent(props: RndComponentProps) {
  const { fontSize, setFontSize, bookmark, setBookmark } = props
  const [, setText_update] = useRecoilState(Text_Switch)
  const [updatedText, setUpdatedText] = useRecoilState(Long_Text)

  const handleUpdate = () => {
    setUpdatedText(updatedText)
    setText_update(true)
  }

  return (
    <Rnd
      default={{ x: 400, y: 20, width: 350, height: 400 }}
      style={{ backgroundColor: 'rgba(255, 255, 255, 0.65)', padding: '10px', borderRadius: '8px', paddingBottom: '50px' }}
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
      minHeight={400}
    >
      <div style={{ paddingTop: '40px' }} />
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
        <span style={{ marginRight: '10px' }}>開いているページ数</span>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
          <input
            type='number'
            value={bookmark}
            onChange={(e) => {
              const newValue = Number(e.target.value)
              if (newValue >= 0 && newValue <= 50) {
                setBookmark(newValue)
              }
            }}
            min={0}
            max={50}
            style={{ width: '60px', marginRight: '10px' }}
          />
          <Slider
            value={bookmark}
            onChange={(_, newValue) => setBookmark(newValue as number)}
            aria-labelledby='page-count-slider'
            valueLabelDisplay='auto'
            step={1}
            min={0}
            max={50}
            style={{ flexGrow: 1 }}
          />
        </div>
        <Button size='small' variant='outlined' style={{ alignSelf: 'flex-end' }} onClick={handleUpdate}>
          Update
        </Button>
      </div>
    </Rnd>
  )
}

function BabylonScene() {
  const [fontSize, setFontSize] = useState(22)
  const [bookmark, setBookmark] = useRecoilState(BookMark)

  return (
    <Box style={{ position: 'relative', width: '100%', height: '100%' }}>
      <CanvasComponent />
      <RndComponent fontSize={fontSize} setFontSize={setFontSize} bookmark={bookmark} setBookmark={setBookmark} />
    </Box>
  )
}

export default BabylonScene
