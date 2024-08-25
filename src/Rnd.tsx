import { useEffect, useRef, useState } from 'react'
import { useRecoilState } from 'recoil'
import { BookMark, CoverSwitch, Long_Text, Text_Switch } from './atom'
import { Rnd } from 'react-rnd'
import { Button, Slider } from '@mui/material'

function RndComponent() {

  return (
    <Rnd
      default={{ x: 400, y: 20, width: 350, height: 480 }}
      style={{ backgroundColor: 'rgba(255, 255, 255, 0.65)', borderRadius: '8px', paddingLeft: '4px', paddingBottom: '4px', paddingTop: '40px' }}
      enableResizing={{
        bottom: true, bottomLeft: true, bottomRight: true,
        left: true, right: true,
        top: true, topLeft: true, topRight: true,
      }}
      minWidth={350} minHeight={480}
    >
      <div
        style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
        onMouseDown={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
      >
        <div style={{ width: '330px', height: '200px', display: 'flex', ...BorderStyle }}>
          <TextInput />
        </div>
        <div style={{ width: '330px', height: '100px', display: 'flex', ...BorderStyle }}>
          <FontSizeSlider />
        </div>
        <div style={{ width: '330px', height: '100px', display: 'flex', ...BorderStyle }}>
          <CoverState />
          <PageSlider />
        </div>
      </div>
    </Rnd>
  )
}

const BorderStyle = { border: '1px solid black', borderRadius: '8px', padding: '5px' }

type IndexDisplayProps = { index: number }

function FrontIndexDisplay(props: IndexDisplayProps) {
  const { index } = props
  const bookmark = index - 1
  let label = ''
  if (bookmark === 0) label = '表紙'
  else if (bookmark === -1) label = '-'
  else label = `${bookmark * 2} ページ`
  return <span style={{ fontWeight: 'bold', fontSize: '16px' }} >{label}</span>
}

function BackIndexDisplay(props: IndexDisplayProps) {
  const { index } = props
  const bookmark = index
  let label = ''
  if (bookmark === 0) label = '表紙'
  else if (bookmark === 51) label = '裏表紙'
  else label = `${bookmark * 2 - 1} ページ`
  return <span style={{ fontWeight: 'bold', fontSize: '16px' }} >{label}</span>
}

function PageSlider() {
  const [bookmark, setBookmark] = useRecoilState(BookMark)
  const [isSliderDisabled, setIsSliderDisabled] = useRecoilState(CoverSwitch)
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
    <div style={{ flexGrow: 1, marginLeft: '10px' }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
        <span />ページ管理
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <FrontIndexDisplay index={bookmark} />
        <BackIndexDisplay index={bookmark} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '10px' }}>
        <Slider
          value={bookmark}
          aria-labelledby='page-count-slider' valueLabelDisplay='auto'
          step={1} min={1} max={51}
          style={{ flexGrow: 1 }}
          onChange={(_, newValue) => setBookmark(newValue as number)}
          disabled={bookmark === 0 ? true : isSliderDisabled}
        />
      </div>
    </div>
  )
}

function CoverState() {
  const [bookmark, setBookmark] = useRecoilState(BookMark)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', marginTop: '5px', marginRight: '5px', marginBottom: '2px', paddingRight: '5px', borderRight: '1px solid black' }}>
      <span style={{ display: 'flex', justifyContent: 'center', paddingBottom: '5px' }}>表紙</span>
      <Button
        size='small' variant="contained" color="primary" style={{ marginLeft: '2px', marginRight: '2px', marginBottom: '2px' }}
        disabled={bookmark === 0 ? false : true}
        onClick={() => setBookmark(1)}
      >開く</Button>
      <Button
        size='small' variant="contained" color="primary" style={{ margin: '2px ' }}
        disabled={bookmark === 0 ? true : false}
        onClick={() => setBookmark(0)}
      >閉じる</Button>
    </div>
  )
}

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

function TextInput() {
  const [, setText_update] = useRecoilState(Text_Switch)
  const [updatedText, setUpdatedText] = useRecoilState(Long_Text)

  const handleUpdate = () => {
    setUpdatedText(updatedText)
    setText_update(true)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', resize: '-moz-initial' }}>
      <textarea
        style={{
          width: '100%', height: '100%',
          border: 'none', outline: 'none', resize: 'none', backgroundColor: 'rgba(255, 255, 255, 1)'
        }}
        placeholder='文章を入力してください...'
        value={updatedText}
        onChange={e => setUpdatedText(e.target.value)}
      />
      <div style={{ paddingTop: '5px', alignSelf: 'flex-end' }}>
        <Button size='small' variant='outlined' onClick={handleUpdate} >Update</Button>
      </div>
    </div>
  )
}

export default RndComponent
