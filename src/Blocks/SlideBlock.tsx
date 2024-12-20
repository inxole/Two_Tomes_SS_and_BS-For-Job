import { useEffect, useRef, useState } from 'react'
import { useRecoilState } from 'recoil'
import { BookMark, ChangeSize, SliderSwitch } from '../atom'
import { Button, Slider, ButtonGroup, AccordionSummary, AccordionDetails, Accordion } from '@mui/material'
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp'
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

  return (
    <div style={{ width: '330px' }}>
      <Accordion
        expanded={!hideOrder.management}
        onChange={() => setHideOrder((prev) => ({ ...prev, management: !prev.management }))}
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.15)',
          boxShadow: '0px 1px 2px rgba(255, 255, 255, 0.2)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        }}>
        <AccordionSummary
          expandIcon={
            <ArrowForwardIosSharpIcon
              style={{
                transform: hideOrder.management ? 'rotate(0deg)' : 'rotate(-90deg)',
                transition: 'transform 0.3s',
                fontSize: '1.0rem'
              }} />
          }
          style={{ display: 'flex', justifyContent: 'center', flexDirection: 'row-reverse' }}>
          <span style={{ flexGrow: 1, textAlign: 'center', paddingRight: '24px', fontSize: '1.0rem' }}>ページ管理</span>
        </AccordionSummary>
        <AccordionDetails style={{ padding: '0px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
        </AccordionDetails>
      </Accordion>
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
            style={{ width: '165px', height: '35px' }}
            disabled={cover === true ? false : true}
            onClick={() => setBookmark(1)}
          >開く</Button>
          <Button
            size='small'
            style={{ width: '165px', height: '35px' }}
            disabled={cover === true ? true : false}
            onClick={decreaseBookmark}
          >閉じる</Button>
        </ButtonGroup>
      </span>
    </div>
  )
}
