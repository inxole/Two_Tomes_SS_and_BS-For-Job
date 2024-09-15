import { Slider } from '@mui/material'
import { useRecoilState } from 'recoil'
import { TextReSize } from '../atom'

function FontSizeSlider() {
  const [fontSize, setFontSize] = useRecoilState(TextReSize)
  const availableSizes = [10, 12, 14, 16, 18, 20, 22, 24, 28, 32, 36, 40, 44, 48, 52, 58, 64, 72, 82, 96, 116, 136, 166, 250, 500]
  const currentIndex = availableSizes.indexOf(fontSize)

  return (
    <div style={{ width: '324px', height: '120px', marginTop: '5px', marginBottom: '5px' }}>
      <span>フォントサイズ</span>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
        <input
          type="text"
          value={fontSize}
          readOnly
          style={{ width: '30px' }}
        />
        <Slider
          value={currentIndex}
          step={1}
          min={0}
          max={availableSizes.length - 1}
          onChange={(_, newValue) => setFontSize(availableSizes[newValue as number])}
          style={{ flexGrow: 1, marginLeft: '20px', marginRight: '5px' }}
        />
      </div>
    </div>
  )
}

export default FontSizeSlider
