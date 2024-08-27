import { Box } from '@mui/material'
import CanvasComponent from './Page'
import RndComponent from './Rnd'

function BabylonScene() {

  return (
    <Box style={{ position: 'relative', width: '100%', height: '100%' }}>
      <CanvasComponent />
      <RndComponent />
    </Box>
  )
}

export default BabylonScene
