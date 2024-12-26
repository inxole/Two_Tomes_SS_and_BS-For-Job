import React, { useState } from 'react'
import { useRecoilState } from 'recoil'
import { BookMark, SliderSwitch } from '../atom'
import BookmarkIcon from '@mui/icons-material/Bookmark'

type IndexDisplayProps = { index: number }

export function FrontIndexDisplay(props: IndexDisplayProps) {
  const { index } = props
  const bookmark = index - 1
  let label = ''
  if (bookmark === 0) label = '表紙'
  else if (bookmark === -1) label = '-'
  else label = `${bookmark * 2} page`
  return <span style={{ fontSize: '12.5px', width: '60px', display: 'inline-block' }} >{label}</span>
}

export function BackIndexDisplay(props: IndexDisplayProps) {
  const { index } = props
  const bookmark = index
  let label = ''
  if (bookmark === 0) label = '表紙'
  else if (bookmark === 51) label = '背表紙'
  else label = `${bookmark * 2 - 1} page`
  return (<span style={{ fontSize: '12.5px', width: '60px', display: 'inline-block', textAlign: 'right' }} >{label}</span>)
}

export function AutoOpenToBookmark() {
  const [bookmark, setBookmark] = useRecoilState(BookMark)
  const [inputValue, setInputValue] = useState('1')
  const [, setIsSliderDisabled] = useRecoilState(SliderSwitch)

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10)
    if (value >= 1 && value <= 100) {
      setInputValue(`${value}`)
    }
  }

  const handleButtonClick = () => {
    let target = parseInt(inputValue, 10)
    if (target % 2 === 0) {
      target = (target + 2) / 2
    } else {
      target = (target + 1) / 2
    }
    if (target >= 1 && target <= 51) {
      let currentBookmark = bookmark
      const step = () => {
        if (currentBookmark < target) {
          currentBookmark++
        } else if (currentBookmark > target) {
          currentBookmark--
        }
        setBookmark(currentBookmark)
        if (currentBookmark !== target) {
          if (bookmark === 0 && currentBookmark === 1) {
            setTimeout(() => {
              setBookmark(1)
              setIsSliderDisabled(false)
              currentBookmark = 1
              step()
            }, 1002)
          } else {
            setTimeout(step, 20)
          }
        }
      }
      step()
    }
  }

  let interval: number | null = null
  let currentInputValue = parseInt(inputValue, 10)
  const handleMouseDown = (direction: number) => {
    const changeFontSize = () => {
      const newValue = currentInputValue + direction
      if (newValue >= 1 && newValue <= 100) {
        currentInputValue = newValue
        setInputValue(`${currentInputValue}`)
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
    <div style={{ display: 'flex', justifyContent: 'center', paddingRight: '34px' }}>
      <div style={{ paddingRight: '10px', cursor: 'pointer' }}>
        <BookmarkIcon onClick={handleButtonClick} color='warning'
          titleAccess='入力されたページに移動します。'
        />
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <button
          style={{ width: '27.5px', height: '27.5px' }}
          onMouseDown={() => { handleMouseDown(-1) }}
          onMouseUp={() => { }}
          disabled={inputValue === '1'}
        >-</button>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          min={1}
          max={100}
          style={{ width: '40px', height: '21.5px', textAlign: 'center', margin: '0px 15px' }}
        />
        <button
          style={{ width: '27.5px', height: '27.5px' }}
          onMouseDown={() => handleMouseDown(1)}
          onMouseUp={() => { }}
          disabled={inputValue === '100'}
        >+</button>
      </div>
    </div>
  )
}