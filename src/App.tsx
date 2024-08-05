import { useState } from 'react'
import { Box } from '@mui/material'
import { useRecoilState } from 'recoil'
import { BookMark, CoverOpen } from './atom'
import CanvasComponent from './Page'
import RndComponent from './Rnd'

function BabylonScene() {
  const [fontSize, setFontSize] = useState(22)
  const [bookmark, setBookmark] = useRecoilState(BookMark)
  const [coverSwitch, setCoverSwitch] = useRecoilState(CoverOpen)

  return (
    <Box style={{ position: 'relative', width: '100%', height: '100%' }}>
      <CanvasComponent />
      <RndComponent
        fontSize={fontSize} setFontSize={setFontSize}
        bookmark={bookmark} setBookmark={setBookmark}
        coverSwitch={coverSwitch} setCoverSwitch={setCoverSwitch} />
    </Box>
  )
}

export default BabylonScene
