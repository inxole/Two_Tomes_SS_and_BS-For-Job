import { Slider, Accordion, AccordionSummary, AccordionDetails } from '@mui/material'
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp'
import { useRecoilState } from 'recoil'
import { ChangeSize, TextReSize } from '../atom'
import { inner_width } from '../Rnd'

function FontSizeSlider() {
  const [fontSize, setFontSize] = useRecoilState(TextReSize)
  const availableSizes = [10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 48, 54, 62, 72, 84, 100, 124, 166, 250, 500]
  const currentIndex = availableSizes.indexOf(fontSize)
  const [hideOrder, setHideOrder] = useRecoilState(ChangeSize)

  let interval: number | null = null
  let currentFontSizeIndex = availableSizes.indexOf(fontSize)
  const handleMouseDown = (direction: number) => {
    const changeFontSize = () => {
      const newIndex = currentFontSizeIndex + direction
      if (newIndex >= 0 && newIndex < availableSizes.length) {
        currentFontSizeIndex = newIndex
        setFontSize(availableSizes[currentFontSizeIndex])
      }
    }

    changeFontSize()
    interval = setInterval(changeFontSize, 100)
    const handleMouseUp = () => {
      if (interval) clearInterval(interval)
      interval = null
      document.removeEventListener('mouseup', handleMouseUp)
    }
    document.addEventListener('mouseup', handleMouseUp)
  }

  return (
    <div style={{ width: inner_width }}>
      <Accordion
        expanded={!hideOrder.size}
        onChange={() =>
          setHideOrder((prev) => ({ ...prev, size: !prev.size }))
        }
        disableGutters
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.01)',
          boxShadow: 'none',
          border: '1px solid rgba(255, 255, 255, 0.01)',
        }}>
        <AccordionSummary
          expandIcon={
            <ArrowForwardIosSharpIcon
              style={{
                transform: hideOrder.size ? 'rotate(0deg)' : 'rotate(-90deg)',
                transition: 'transform 0.3s',
                fontSize: '1.0rem', padding: '12.5px'
              }} />
          }
          sx={{
            display: 'flex', justifyContent: 'center', flexDirection: 'row-reverse',
            height: '20px', minHeight: '20px', padding: '0px'
          }}>
          <span style={{ flexGrow: 1, textAlign: 'center', fontSize: '1.0rem', padding: '10px 41px 10px 0px' }}>フォントサイズ</span>
        </AccordionSummary>
        <AccordionDetails style={{ padding: '0px' }}>
          <div>
            <span style={{ width: '100%', display: 'flex', justifyContent: 'center', paddingTop: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <button
                  style={{ width: '27.5px', height: '27.5px' }}
                  onMouseDown={() => handleMouseDown(-1)}
                  disabled={fontSize === availableSizes[0]}
                >
                  -
                </button>
                <input
                  type="text"
                  value={fontSize}
                  readOnly
                  style={{ width: '40px', height: '21.5px', textAlign: 'center', margin: '0px 15px' }}
                />
                <button
                  style={{ width: '27.5px', height: '27.5px' }}
                  onMouseDown={() => handleMouseDown(1)}
                  disabled={fontSize === availableSizes[availableSizes.length - 1]}
                >
                  +
                </button>
              </div>
            </span>
            <div style={{ height: '30px' }}>
              <Slider
                value={currentIndex}
                step={1}
                min={0}
                max={availableSizes.length - 1}
                onChange={(_, newValue) =>
                  setFontSize(availableSizes[newValue as number])
                }
                style={{ display: 'flex', justifyContent: 'center' }}
              />
            </div>
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  )
}

export default FontSizeSlider
