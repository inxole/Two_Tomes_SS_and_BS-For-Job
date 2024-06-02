import React, { useState } from 'react'
import { Box, Button, Slider } from '@mui/material'
import { Rnd } from 'react-rnd'
import { useRecoilState } from 'recoil'
import Page from './Page'
import { Long_Text, Text_Switch } from './atom'

interface RndComponentProps {
  fontSize: number
  setFontSize: (size: number) => void
}

const RndComponent: React.FC<RndComponentProps> = ({ fontSize, setFontSize }) => {
  const [text_update, setText_update] = useRecoilState(Text_Switch)
  const [updatedText, setUpdatedText] = useRecoilState(Long_Text)

  const handleUpdate = () => {
    setUpdatedText(updatedText)
    setText_update(true)
    console.log(text_update)
  }

  

  return (
    <Rnd
      default={{ x: 400, y: 20, width: 320, height: 300 }}
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
      minWidth={320}
      minHeight={300}
    >
      <div style={{ paddingTop: "40px" }} />
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
          placeholder="文章を入力してください..."
          value={updatedText}
          onChange={e => setUpdatedText(e.target.value)}
        />
        <span style={{ marginRight: '10px' }}>フォントサイズ</span>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
          <input
            type="number"
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
            style={{ width: '60px', marginRight: '10px' }}
          />
          <Slider
            value={fontSize}
            onChange={(_, newValue) => setFontSize(newValue as number)}
            aria-labelledby="font-size-slider"
            valueLabelDisplay="auto"
            step={1}
            min={10}
            max={100}
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

const BabylonScene = () => {
  const [fontSize, setFontSize] = useState(22)
  return (
    <Box style={{ position: 'relative', width: '100%', height: '100%' }}>
      <Page />
      <RndComponent fontSize={fontSize} setFontSize={setFontSize} />
    </Box>
  )
}

export default BabylonScene
