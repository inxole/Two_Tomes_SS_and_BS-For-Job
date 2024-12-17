import { Box } from '@mui/material'
import CanvasComponent from './Page'
import RndComponent from './Rnd'

function BabylonScene() {
  return (
    <Box style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
      <CanvasComponent />
      <RndComponent />
    </Box>
  )
}

export default BabylonScene
