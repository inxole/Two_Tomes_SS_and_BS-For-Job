import { useEffect, useState } from 'react'
import { Rnd } from 'react-rnd'
import TextInput from './Blocks/TextBlock'
import FontSizeSlider from './Blocks/FontSizeBlock'
import { CoverState, PageSlider } from './Blocks/SlideBlock'
import { grey } from '@mui/material/colors'
import { Stack } from '@mui/material'
import HomeTwoToneIcon from '@mui/icons-material/HomeTwoTone'
import ArchiveTwoToneIcon from '@mui/icons-material/ArchiveTwoTone'
import BookTwoToneIcon from '@mui/icons-material/BookTwoTone'
import { InitCamera, Camera_BS, Camera_SS, BookMark, ChangeSize, DeviceMobile } from './atom'
import { useRecoilState, useRecoilValue } from 'recoil'
import { A_Camera } from './Camera/Camera_Focus'

const Rnd_width = 360
const Rnd_height = 680
const hidden_position = Rnd_height - 8
export const inner_width = '320px'

function RndComponent() {
  const [isMovedDown, setIsMovedUp] = useState(false)
  const [, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight })
  const [position, setPosition] = useState({ x: (window.innerWidth - Rnd_width) / 2, y: 10 })
  const bookmark = useRecoilValue(BookMark)
  const [, setCamera] = useRecoilState(InitCamera)
  const [, setCamera_BS] = useRecoilState(Camera_BS)
  const [, setCamera_SS] = useRecoilState(Camera_SS)
  const hideOrder = useRecoilValue(ChangeSize)
  const usedMobile = useRecoilValue(DeviceMobile)
  const [rnd2, setRnd2] = useState(0)

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
    let newRnd2 = -680
    let newY = -680

    if (isMovedDown) {
      if (!hideOrder.size && !hideOrder.management) {
        newRnd2 = 10
        newY = 10
      } else if (hideOrder.size || hideOrder.management) {
        newRnd2 = -57.5
        newY = 10
      }
      if (hideOrder.size && hideOrder.management) {
        newRnd2 = -125
      }
    }

    setRnd2(newRnd2)
    setPosition({ x: position.x, y: newY })
  }, [isMovedDown, hideOrder.size, hideOrder.management, position.x])


  function FocusCam() {
    if (usedMobile) {
      bookmark >= 1 ? A_Camera.FocusOnDefault(true, true) : A_Camera.FocusOnDefault(false, true)
    } else {
      bookmark >= 1 ? A_Camera.FocusOnDefault(true, false) : A_Camera.FocusOnDefault(false, false)
    }
    setCamera(true), setCamera_BS(false), setCamera_SS(false)
  }
  function FocusCamBS() {
    if (usedMobile) {
      bookmark >= 1 ? A_Camera.FocusOnBS(true, true) : A_Camera.FocusOnBS(false, true)
    } else {
      bookmark >= 1 ? A_Camera.FocusOnBS(true, false) : A_Camera.FocusOnBS(false, false)
    }
    setCamera(false), setCamera_BS(true), setCamera_SS(false)
  }
  function FocusCamSS() {
    if (usedMobile) {
      bookmark >= 1 ? A_Camera.FocusOnSS(true, true) : A_Camera.FocusOnSS(false, true)
    } else {
      bookmark >= 1 ? A_Camera.FocusOnSS(true, false) : A_Camera.FocusOnSS(false, false)
    }
    setCamera(false), setCamera_BS(false), setCamera_SS(true)
  }

  return (
    <>
      <Rnd
        default={{
          x: position.x, y: position.y, width: Rnd_width,
          height: hideOrder.size && hideOrder.management ? 270 :
            hideOrder.size && !hideOrder.management ? 202.5 :
              !hideOrder.size && hideOrder.management ? 202.5 :
                135
        }}
        style={{
          borderRadius: '8px', padding: '4px',
          transition: 'transform 0.35s ease'
        }}
        enableResizing={false}
        disableDragging={true}
        position={{ x: position.x, y: position.y }}
      >
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ width: inner_width, display: 'flex', ...BorderStyle }}>
            <TextInput />
          </div>
          <div style={{ width: inner_width, display: 'flex', ...BorderStyle }}>
            <FontSizeSlider />
          </div>
          <div style={{ width: inner_width, display: 'flex', ...BorderStyle }}>
            <PageSlider />
          </div>
          <div style={{ width: inner_width, display: 'flex', ...BorderStyle }}>
            <CoverState />
          </div>
        </div>
      </Rnd>
      <Rnd
        default={{ x: position.x, y: Rnd_height, width: Rnd_width, height: 40 }}
        position={{ x: position.x, y: isMovedDown ? rnd2 + Rnd_height - 10 : Rnd_height - hidden_position }}
        enableResizing={false}
        disableDragging={true}
        style={{ pointerEvents: 'none', transition: 'transform 0.38s ease' }}>
        <div style={{ width: '350px', margin: '0 auto', display: 'flex', justifyContent: 'center' }}>
          <Stack direction="row" alignItems="center" justifyContent="center" spacing={4} sx={{ pointerEvents: 'auto', paddingTop: '15px' }}>
            <ArchiveTwoToneIcon
              fontSize='large'
              titleAccess={'コントロールパネルの表示/非表示を切り替えます。'}
              sx={{
                color: grey[300], cursor: 'pointer',
                padding: '3px',
                background: 'rgba(0, 105, 211, 0.7)',
                borderRadius: '8px',
                transform: isMovedDown ? 'rotate(180deg)' : 'none',
                '&:hover': { background: 'rgba(0, 150, 255, 1)' }
              }}
              onClick={handleArchiveClick}
            />
            <BookTwoToneIcon
              fontSize="large" titleAccess="「書物型：血ト贄」にカメラを合わせます。"
              sx={{
                color: grey[100], cursor: 'pointer',
                padding: '3px',
                background: 'linear-gradient(45deg,rgba(244, 174, 35, 0.7),rgba(254, 236, 173, 0.7))',
                borderRadius: '8px',
                '&:hover': { background: 'linear-gradient(45deg, rgba(255, 200, 50, 1), rgba(255, 250, 200, 1))' }
              }}
              onClick={() => FocusCamBS()}
            />
            <HomeTwoToneIcon
              fontSize='large' titleAccess="初期の画面に戻ります。"
              sx={{
                color: grey[100], cursor: 'pointer',
                padding: '3px',
                background: 'rgba(0, 105, 211, 0.7)',
                borderRadius: '8px',
                '&:hover': { background: 'rgba(0, 150, 255, 1)' }
              }}
              onClick={() => FocusCam()}
            />
            <BookTwoToneIcon
              fontSize="large" titleAccess="「書物型：星ト歌」にカメラを合わせます。"
              sx={{
                color: grey[100],
                cursor: 'pointer',
                padding: '3px',
                background: 'linear-gradient(45deg, rgba(113, 113, 117, 0.7), rgba(58, 58, 60, 0.7), rgba(230, 188, 76, 0.7))',
                borderRadius: '8px',
                '&:hover': { background: 'linear-gradient(45deg, rgba(150, 150, 160, 1), rgba(80, 80, 90, 1), rgba(255, 220, 100, 1))' }
              }}
              onClick={() => FocusCamSS()}
            />
          </Stack>
        </div>
      </Rnd>
    </>
  )
}

const BorderStyle = { border: '1px', borderRadius: '8px', padding: '10px 15px', backgroundColor: 'rgba(255, 255, 255, 0.5)', margin: '1.5px' }
export default RndComponent