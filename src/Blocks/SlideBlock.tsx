import { useEffect, useRef, useState } from 'react'
import { useRecoilState } from 'recoil'
import { BookMark, ChangeSize, SliderSwitch } from '../atom'
import { Button, Slider, ButtonGroup, Switch } from '@mui/material'
import { AutoOpenToBookmark, BackIndexDisplay, FrontIndexDisplay } from './SlideCenter'

export function PageSlider() {
  const [bookmark, setBookmark] = useRecoilState(BookMark)
  const [isSliderDisabled, setIsSliderDisabled] = useRecoilState(SliderSwitch)
  const prevBookmarkRef = useRef(bookmark)
  const [hideOrder, setHideOrder] = useRecoilState(ChangeSize)

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

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setHideOrder({ ...hideOrder, management: event.target.checked })
  }

  return (
    <div style={{ width: '330px', height: hideOrder.management ? '20px' : '89px' }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2px' }}>
        <span>
          <Switch
            checked={hideOrder.management}
            onChange={handleChange}
            size="small"
          />{hideOrder.management ? '表示' : '隠す'}
        </span>
        <div style={{ flexGrow: 1, textAlign: 'center' }}>
          ページ管理
        </div>
        <span style={{ display: 'flex', width: '72px' }} />
      </div>
      <div style={{ visibility: hideOrder.management ? 'hidden' : 'visible' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
          <FrontIndexDisplay index={bookmark} />
          <AutoOpenToBookmark />
          <BackIndexDisplay index={bookmark} />
        </div>
        <Slider
          value={bookmark}
          aria-labelledby='page-count-slider'
          step={1} min={1} max={51}
          style={{ display: 'flex', justifyContent: 'center' }}
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
