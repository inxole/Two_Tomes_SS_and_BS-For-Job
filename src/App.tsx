import { Box } from '@mui/material'
import CanvasComponent from './Page'
import RndComponent from './Rnd'
import User_interface from './UI_Rnd'

function BabylonScene() {
  return (
    <Box style={{ position: 'relative', width: '100%', height: '100%' }}>
      <CanvasComponent />
      <RndComponent />
      <User_interface />
    </Box>
  )
}

export default BabylonScene
