import { useEffect, useRef, useState } from 'react'
import { useRecoilState } from 'recoil'
import { BookMark, SliderSwitch } from '../atom'
import { Button, Slider, ButtonGroup } from '@mui/material' // Updated import
import { AutoOpenToBookmark, BackIndexDisplay, FrontIndexDisplay } from './SlideCenter'

export function PageSlider() {
  const [bookmark, setBookmark] = useRecoilState(BookMark)
  const [isSliderDisabled, setIsSliderDisabled] = useRecoilState(SliderSwitch)
  const prevBookmarkRef = useRef(bookmark)

  useEffect(() => {
    const prevBookmark = prevBookmarkRef.current

    if (bookmark <= 1 && prevBookmark <= 1) {
      setIsSliderDisabled(true)
      const timer = setTimeout(() => {
        setIsSliderDisabled(false)
      }, 1001)
      return () => clearTimeout(timer)
    }
    prevBookmarkRef.current = bookmark
  }, [bookmark])

  return (
    <div style={{ flexGrow: 1, marginLeft: '5px', marginRight: '5px' }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2px' }}>
        <span />ページ管理
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
        <FrontIndexDisplay index={bookmark} />
        <AutoOpenToBookmark />
        <BackIndexDisplay index={bookmark} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Slider
          value={bookmark}
          aria-labelledby='page-count-slider'
          step={1} min={1} max={51}
          style={{ flexGrow: 1, marginLeft: '5px',marginRight: '5px' }}
          onChange={(_, newValue) => setBookmark(newValue as number)}
          disabled={bookmark === 0 ? true : isSliderDisabled}
        />
      </div>
    </div>
  )
}

export function CoverState() {
  const [bookmark, setBookmark] = useRecoilState(BookMark)
  const [cover, setCover] = useState(false)

  const decreaseBookmark = () => {
    let currentBookmark = bookmark
    const intervalId = setInterval(() => {
      if (currentBookmark > 0) {
        currentBookmark -= 1
        setBookmark(currentBookmark)
      } else {
        clearInterval(intervalId)
      }
    }, 20)
  }

  useEffect(() => {
    if (bookmark === 0) {
      setTimeout(() => setCover(true), 1001)
    } else {
      setTimeout(() => setCover(false), 1001)
    }
  }, [bookmark])

  return (
    <div style={{ width: '330%', justifyContent: 'center' }}>
      <span style={{ display: 'flex', justifyContent: 'center', paddingBottom: '2px' }}>表紙</span>
      <span style={{ display: 'flex', justifyContent: 'center' }}>
        <ButtonGroup
          disableElevation
          variant="contained"
        >
          <Button
            size='small'
            style={{ width: '65px', height: '35px' }}
            disabled={cover === true ? false : true}
            onClick={() => setBookmark(1)}
          >開く</Button>
          <Button
            size='small'
            style={{ width: '65px', height: '35px' }}
            disabled={cover === true ? true : false}
            onClick={decreaseBookmark}
          >閉じる</Button>
        </ButtonGroup>
      </span>
    </div>
  )
}
