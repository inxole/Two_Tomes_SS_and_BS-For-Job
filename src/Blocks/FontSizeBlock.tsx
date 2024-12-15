import { Slider, Switch } from '@mui/material'
import { useRecoilState } from 'recoil'
import { ChangeSize, TextReSize } from '../atom'

function FontSizeSlider() {
  const [fontSize, setFontSize] = useRecoilState(TextReSize)
  const availableSizes = [10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 48, 54, 62, 72, 84, 100, 124, 166, 250, 500]
  const currentIndex = availableSizes.indexOf(fontSize)
  const [isHidden, setIsHidden] = useRecoilState(ChangeSize)
  
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsHidden({ ...isHidden, size: event.target.checked })
  }

  return (
    <div style={{
      width: '330px', marginLeft: '5px', marginRight: '5px',
      height: isHidden.size ? '20px' : '76.5px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <span>
          <Switch
            checked={isHidden.size}
            onChange={handleChange}
            size="small"
          />{isHidden.management ? '表示' : '隠す'}
        </span>
        <span style={{ flexGrow: 1, textAlign: 'center' }}>フォントサイズ</span>
        <span style={{ display: 'flex', width: '72px' }}></span>
      </div>
      <div style={{ visibility: isHidden.size ? 'hidden' : 'visible' }}>
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
          style={{ width: '310px', display: 'flex', justifyContent: 'center', marginLeft: '5px', marginRight: '5px' }}
        />
      </div>
    </div>
  )
}

export default FontSizeSlider
