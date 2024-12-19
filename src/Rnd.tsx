import { useEffect, useState } from 'react'
import { Rnd } from 'react-rnd'
import TextInput from './Blocks/TextBlock'
import FontSizeSlider from './Blocks/FontSizeBlock'
import { CoverState, PageSlider } from './Blocks/SlideBlock'
import { amber, grey } from '@mui/material/colors'
import { Stack } from '@mui/material'
import HomeTwoToneIcon from '@mui/icons-material/HomeTwoTone'
import ArchiveTwoToneIcon from '@mui/icons-material/ArchiveTwoTone'
import BookTwoToneIcon from '@mui/icons-material/BookTwoTone'
import { InitCamera, Camera_BS, Camera_SS, BookMark, ChangeSize } from './atom'
import { useRecoilState, useRecoilValue } from 'recoil'
import { A_Camera } from './Camera/Camera_Focus'

const Rnd_width = 360
const Rnd_height = 680
const hidden_position = Rnd_height + 10

function RndComponent() {
  const [isMovedDown, setIsMovedUp] = useState(false)
  const [, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight })
  const [position, setPosition] = useState({ x: (window.innerWidth - Rnd_width) / 2, y: 10 })
  const bookmark = useRecoilValue(BookMark)
  const [, setCamera] = useRecoilState(InitCamera)
  const [, setCamera_BS] = useRecoilState(Camera_BS)
  const [, setCamera_SS] = useRecoilState(Camera_SS)
  const hideOrder = useRecoilValue(ChangeSize)

  useEffect(() => {
    FocusCam()
    const handleResize = () => {
      const newWidth = window.innerWidth
      const newHeight = window.innerHeight
      setWindowSize({ width: newWidth, height: newHeight })
      setPosition({ x: (newWidth - Rnd_width) / 2, y: -680 })
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleArchiveClick = () => {
    setIsMovedUp(!isMovedDown)
  }

  useEffect(() => {
    if (isMovedDown && !hideOrder.size && !hideOrder.management) {
      setPosition({ x: position.x, y: 10 })
    } else if (isMovedDown && hideOrder.size && !hideOrder.management) {
      setPosition({ x: position.x, y: -46.5 })
    } else if (isMovedDown && !hideOrder.size && hideOrder.management) {
      setPosition({ x: position.x, y: -59 })
    } else if (isMovedDown && hideOrder.size && hideOrder.management) {
      setPosition({ x: position.x, y: -115.5 })
    } else {
      setPosition({ x: position.x, y: -680 })
    }
  }, [isMovedDown, hideOrder.size, hideOrder.management, position.y])

  function FocusCam() {
    bookmark >= 1 ? A_Camera.FocusOnDefault(true) : A_Camera.FocusOnDefault(false)
    setCamera(true), setCamera_BS(false), setCamera_SS(false)
  }
  function FocusCamBS() {
    bookmark >= 1 ? A_Camera.FocusOnBS(true) : A_Camera.FocusOnBS(false)
    setCamera(false), setCamera_BS(true), setCamera_SS(false)
  }
  function FocusCamSS() {
    bookmark >= 1 ? A_Camera.FocusOnSS(true) : A_Camera.FocusOnSS(false)
    setCamera(false), setCamera_BS(false), setCamera_SS(true)
  }

  return (
    <>
      <Rnd
        default={{ x: position.x, y: position.y, width: Rnd_width, height: Rnd_height }}
        style={{
          borderRadius: '8px', padding: '4px',
          transition: 'transform 0.35s ease'
        }}
        enableResizing={false}
        disableDragging={true}
        position={{ x: position.x, y: position.y }}
      >
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{
            height: hideOrder.size && hideOrder.management ? '125.5px' :
              hideOrder.size && !hideOrder.management ? '56.5px' :
                !hideOrder.size && hideOrder.management ? '69px' :
                  '0px',
          }} />
          <div style={{ width: '330px', height: '370px', display: 'flex', ...BorderStyle }}>
            <TextInput />
          </div>
          <div style={{ width: '330px', display: 'flex', ...BorderStyle }}>
            <FontSizeSlider />
          </div>
          <div style={{ width: '330px', display: 'flex', ...BorderStyle }}>
            <PageSlider />
          </div>
          <div style={{ width: '330px', display: 'flex', ...BorderStyle }}>
            <CoverState />
          </div>
        </div>
      </Rnd>
      <Rnd
        default={{ x: position.x, y: Rnd_height, width: Rnd_width, height: 40 }}
        position={{ x: position.x, y: isMovedDown ? position.y + Rnd_height - 10 : Rnd_height - hidden_position }}
        enableResizing={false}
        disableDragging={true}
        style={{ pointerEvents: 'none', transition: 'transform 0.38s ease' }}>
        <div style={{ width: '350px', margin: '0 auto', display: 'flex', justifyContent: 'center' }}>
          <Stack direction="row" alignItems="center" justifyContent="center" spacing={2} sx={{ pointerEvents: 'auto' }}>
            <ArchiveTwoToneIcon
              fontSize='large'
              titleAccess={isMovedDown ? 'Hidden' : 'Display'}
              style={{
                color: grey[100],
                cursor: 'pointer',
                paddingTop: isMovedDown ? '0px' : '10px',
                paddingBottom: !isMovedDown ? '0px' : '10px',
                transform: isMovedDown ? 'rotate(180deg)' : 'none',
              }}
              onClick={handleArchiveClick}
            />
            <BookTwoToneIcon
              fontSize="large" titleAccess="Focus B&S" style={{ paddingTop: '10px', color: amber[100], cursor: 'pointer' }}
              onClick={() => FocusCamBS()}
            />
            <HomeTwoToneIcon
              fontSize='large' titleAccess="Default angle" style={{ paddingTop: '10px', color: grey[100], cursor: 'pointer' }}
              onClick={() => FocusCam()}
            />
            <BookTwoToneIcon
              fontSize="large" titleAccess="Focus S&S" style={{ paddingTop: '10px', color: grey[800], cursor: 'pointer' }}
              onClick={() => FocusCamSS()}
            />
          </Stack>
        </div>
      </Rnd>
    </>
  )
}

const BorderStyle = { border: '1px', borderRadius: '8px', padding: '15px', backgroundColor: 'rgba(255, 255, 255, 0.5)', margin: '1.5px' }
export default RndComponent