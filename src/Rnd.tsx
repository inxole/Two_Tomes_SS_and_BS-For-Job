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
import { InitCamera, Camera_BS, Camera_SS } from './atom'
import { useRecoilState } from 'recoil'
import { A_Camera } from './Camera/Camera_Controll'

const Rnd_width = 360
const Rnd_height = 680
const hidden_position = Rnd_height + 10

function RndComponent() {
  const [isMovedDown, setIsMovedUp] = useState(false)
  const [, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight })
  const [position, setPosition] = useState({ x: (window.innerWidth - Rnd_width) / 2, y: 10 })
  const [, setCamera] = useRecoilState(InitCamera)
  const [, setCamera_BS] = useRecoilState(Camera_BS)
  const [, setCamera_SS] = useRecoilState(Camera_SS)

  useEffect(() => {
    const handleResize = () => {
      const newWidth = window.innerWidth
      const newHeight = window.innerHeight
      setWindowSize({ width: newWidth, height: newHeight })
      setPosition({ x: (newWidth - Rnd_width) / 2, y: 10 })
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleArchiveClick = () => {
    setIsMovedUp(!isMovedDown)
  }

  return (
    <>
      <Rnd
        default={{ x: position.x, y: position.y, width: Rnd_width, height: Rnd_height }}
        style={{
          borderRadius: '8px',
          padding: '4px',
          transition: 'transform 0.35s ease'
        }}
        enableResizing={false}
        disableDragging={true}
        position={{ x: position.x, y: isMovedDown ? position.y : position.y - hidden_position }}
      >
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
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
        position={{ x: position.x, y: isMovedDown ? Rnd_height : Rnd_height - hidden_position }}
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
              onClick={() => A_Camera.FocusOnBS()}
            />
            <HomeTwoToneIcon
              fontSize='large' titleAccess="Default angle" style={{ paddingTop: '10px', color: grey[100], cursor: 'pointer' }}
              onClick={() => A_Camera.FocusOnDefault()}
            />
            <BookTwoToneIcon
              fontSize="large" titleAccess="Focus S&S" style={{ paddingTop: '10px', color: grey[800], cursor: 'pointer' }}
              onClick={() => A_Camera.FocusOnSS()}
            />
          </Stack>
        </div>
      </Rnd>
    </>
  )
}

const BorderStyle = { border: '1px solid black', borderRadius: '8px', padding: '10px', backgroundColor: 'rgba(255, 255, 255, 0.5)' }

export default RndComponent