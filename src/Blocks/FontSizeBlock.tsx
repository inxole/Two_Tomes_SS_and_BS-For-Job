import { Slider } from '@mui/material'
import { useRecoilState } from 'recoil'
import { TextReSize } from '../atom'

function FontSizeSlider() {
  const [fontSize, setFontSize] = useRecoilState(TextReSize)
  const maxFontSize = 500
  return (

    <div style={{ width: '324px', height: '120px', marginTop: '5px', marginBottom: '5px' }}>
      <span >フォントサイズ</span>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
        <input
          type='number'
          value={fontSize}
          onChange={(e) => {
            const newValue = Number(e.target.value)
            if (newValue >= 10 && newValue <= maxFontSize) {
              setFontSize(newValue)
            }
          }}
          min={10} max={maxFontSize}
          style={{ width: '60px' }}
        />
        <Slider
          value={fontSize} aria-labelledby='font-size-slider' valueLabelDisplay='auto'
          step={2} min={10} max={maxFontSize}
          style={{ flexGrow: 1 }}
          onChange={(_, newValue) => setFontSize(newValue as number)}
        />
      </div>
    </div>
  )
}

export default FontSizeSlider
