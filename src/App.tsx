import { Box } from '@mui/material'
import CanvasComponent from './Page'
import RndComponent from './Rnd'
import { useRecoilState } from 'recoil'
import { DeviceMobile } from './atom'
import { useEffect } from 'react'

function BabylonScene() {
  const [usedMobile, setOnMobile] = useRecoilState(DeviceMobile)

  useEffect(() => {
    const userAgent = navigator.userAgent
    const isMobileUserAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)
    const isSmallScreen = window.innerWidth <= 768

    if ((isMobileUserAgent || isSmallScreen) && !usedMobile) {
      setOnMobile(true)
    } else {
      setOnMobile(false)
    }
  }, [])

  return (
    <Box style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
      <CanvasComponent />
      <RndComponent />
    </Box>
  )
}

export default BabylonScene
