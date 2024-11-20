import { useEffect, useState } from 'react'
import { Rnd } from 'react-rnd'
import TextInput from './Blocks/TextBlock'
import FontSizeSlider from './Blocks/FontSizeBlock'
import { CoverState, PageSlider } from './Blocks/SlideBlock'
import { grey } from '@mui/material/colors'
import { Stack } from '@mui/material'
import CenterFocusStrongTwoToneIcon from '@mui/icons-material/CenterFocusStrongTwoTone';
import ArchiveTwoToneIcon from '@mui/icons-material/ArchiveTwoTone'

function RndComponent() {
  const [, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight })
  const [position, setPosition] = useState({ x: (window.innerWidth - 350) / 2, y: 10 })
  const sub_position = 480

  useEffect(() => {
    const handleResize = () => {
      const newWidth = window.innerWidth
      const newHeight = window.innerHeight
      setWindowSize({ width: newWidth, height: newHeight })
      setPosition({ x: (newWidth - 350) / 2, y: 10 })
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <>
      <Rnd
        default={{ x: position.x, y: position.y, width: 350, height: 480 }}
        style={{ backgroundColor: 'rgba(255, 255, 255, 0.65)', borderRadius: '8px', paddingLeft: '4px', paddingBottom: '4px', paddingTop: '40px' }}
        enableResizing={false}
        disableDragging={true}
        position={{ x: position.x, y: position.y }}
      >
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
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
      <Rnd
        default={{ x: position.x, y: sub_position, width: 350, height: 40 }}
        position={{ x: position.x, y: sub_position }}
        enableResizing={false}
        disableDragging={true}
        style={{ pointerEvents: 'none' }}
      >
        <div style={{ width: '350px', margin: '0 auto', display: 'flex', justifyContent: 'center' }}>
          <Stack direction="row" alignItems="center" justifyContent="center" spacing={2} sx={{ pointerEvents: 'auto' }}>
            <ArchiveTwoToneIcon fontSize='large' style={{ paddingTop: '10px', color: grey[100], cursor: 'pointer' }} />
            <CenterFocusStrongTwoToneIcon fontSize='large' style={{ paddingTop: '10px', color: grey[100], cursor: 'pointer' }} />
          </Stack>
        </div>
      </Rnd>
    </>
  )
}

const BorderStyle = { border: '1px solid black', borderRadius: '8px', padding: '5px' }

export default RndComponent
