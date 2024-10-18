import { Box } from '@mui/material'
import CanvasComponent from './Page'
import RndComponent from './Rnd'
import '/app/index.css'
import './assets/fonts/NieR-Regular.ttf'

function BabylonScene() {

  return (
    <Box style={{ position: 'relative', width: '100%', height: '100%' }}>
      <CanvasComponent />
      <RndComponent />
      <p style={{ fontFamily: 'NieR' }}>hello HELLO</p>
    </Box>
  )
}

export default BabylonScene
