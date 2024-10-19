import { Box } from '@mui/material'
import CanvasComponent from './Page'
import RndComponent from './Rnd'
import '/app/index.css'

function BabylonScene() {

  return (
    <Box style={{ position: 'relative', width: '100%', height: '100%' }}>
      <CanvasComponent />
      <RndComponent />
      <p style={{ fontFamily: 'NieR-Regular' }}>This text is using the NieR-Regular font.</p>
    </Box>
  )
}

export default BabylonScene
