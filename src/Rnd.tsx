import { Rnd } from 'react-rnd'
import TextInput from './Blocks/TextBlock'
import FontSizeSlider from './Blocks/FontSizeBlock'
import { CoverState, PageSlider } from './Blocks/SlideBlock'

function RndComponent() {

  return (
    <Rnd
      default={{ x: 400, y: 20, width: 350, height: 480 }}
      style={{ backgroundColor: 'rgba(255, 255, 255, 0.65)', borderRadius: '8px', paddingLeft: '4px', paddingBottom: '4px', paddingTop: '40px' }}
      enableResizing={{
        bottom: true, bottomLeft: true, bottomRight: true,
        left: true, right: true,
        top: true, topLeft: true, topRight: true,
      }}
      minWidth={350} minHeight={480}
    >
      <div
        style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
        onMouseDown={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
      >
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
  )
}

const BorderStyle = { border: '1px solid black', borderRadius: '8px', padding: '5px' }

export default RndComponent
