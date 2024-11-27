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

const Rnd_width = 360
const Rnd_height = 600
const icon_position = 600

function RndComponent() {
  const [isMovedDown, setIsMovedUp] = useState(false)
  const [, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight })
  const [position, setPosition] = useState({ x: (window.innerWidth - Rnd_width) / 2, y: 10 })

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
        position={{ x: position.x, y: isMovedDown ? position.y : position.y - 610 }}
      >
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ width: '330px', height: '370px', display: 'flex', ...BorderStyle }}>
            <TextInput />
          </div>
          <div style={{ width: '330px', height: '60px', display: 'flex', ...BorderStyle }}>
            <FontSizeSlider />
          </div>
          <div style={{ width: '330px', height: '100px', display: 'flex', ...BorderStyle }}>
            <CoverState />
            <PageSlider />
          </div>
        </div>
      </Rnd>
      <Rnd
        default={{ x: position.x, y: icon_position, width: Rnd_width, height: 40 }}
        position={{ x: position.x, y: isMovedDown ? icon_position : icon_position - 610 }}
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
            />
            <HomeTwoToneIcon
              fontSize='large' titleAccess="Default angle" style={{ paddingTop: '10px', color: grey[100], cursor: 'pointer' }}
            />
            <BookTwoToneIcon
              fontSize="large" titleAccess="Focus S&S" style={{ paddingTop: '10px', color: grey[800], cursor: 'pointer' }}
            />
          </Stack>
        </div>
      </Rnd>
    </>
  )
}

const BorderStyle = { border: '1px solid black', borderRadius: '8px', padding: '10px', backgroundColor: 'rgba(255, 255, 255, 0.5)' }

export default RndComponent