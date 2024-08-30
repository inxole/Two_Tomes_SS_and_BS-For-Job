import { useState } from 'react'
import { Slider } from '@mui/material'

function FontSizeSlider() {
  const [fontSize, setFontSize] = useState(22)
  return (

    <div style={{ width: '324px', height: '120px', marginTop: '5px', marginBottom: '5px' }}>
      <span >フォントサイズ</span>
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
          min={10} max={100}
          style={{ width: '60px' }}
        />
        <Slider
          value={fontSize} aria-labelledby='font-size-slider' valueLabelDisplay='auto'
          step={1} min={10} max={100}
          style={{ flexGrow: 1 }}
          onChange={(_, newValue) => setFontSize(newValue as number)}
        />
      </div>
    </div>
  )
}

export default FontSizeSlider
