import { Slider } from '@mui/material'
import { useRecoilState } from 'recoil'
import { TextReSize } from '../atom'

function FontSizeSlider() {
  const [fontSize, setFontSize] = useRecoilState(TextReSize)
  const availableSizes = [10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 48, 54, 62, 72, 84, 100, 124, 166, 250, 500]
  const currentIndex = availableSizes.indexOf(fontSize)

  return (
    <div style={{ width: '330px', height: '100%', marginLeft: '10px', marginRight: '10px' }}>
      <span style={{ widows: '100%', display: 'flex', justifyContent: 'center', paddingBottom: '2px' }}>フォントサイズ</span>
      <span style={{ widows: '100%', display: 'flex', justifyContent: 'center' }}>
        <input
          type="text"
          value={fontSize}
          readOnly
          style={{ width: '30px' }}
        />
      </span>

      <Slider
        value={currentIndex}
        step={1}
        min={0}
        max={availableSizes.length - 1}
        onChange={(_, newValue) => setFontSize(availableSizes[newValue as number])}
        style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
      />
    </div>
  )
}

export default FontSizeSlider
