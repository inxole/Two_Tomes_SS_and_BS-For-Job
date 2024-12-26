import { useRecoilState } from 'recoil'
import { Long_Text, Text_Switch_Automatic, Text_Switch_Freedom } from '../atom'
import { Button, Tooltip } from '@mui/material'
import { inner_width } from '../Rnd'
import renderTextAreas from './TextArea'

function TextInput() {
  const [, setText_update_F] = useRecoilState(Text_Switch_Freedom)
  const [, setText_update_A] = useRecoilState(Text_Switch_Automatic)
  const [updatedText, setUpdatedText] = useRecoilState(Long_Text)
  const UpdateFree = () => { setUpdatedText(updatedText), setText_update_F(true) }
  const UpdateAuto = () => { setUpdatedText(updatedText), setText_update_A(true) }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: inner_width, height: '335px' }}>
      <span style={{ display: 'flex', justifyContent: 'center', width: inner_width, paddingBottom: '8px' }}>
        文章の変更
      </span>
      {renderTextAreas()}
      <span style={{ display: 'flex', justifyContent: 'center', padding: '10px 0px' }}>文章の一括変更</span>
      <span style={{ display: 'flex', justifyContent: 'center' }}>
        <Tooltip title="入力された文章をそのままページに描画します（単語が見切れる可能性があります）。">
          <Button size='small' variant='contained' onClick={UpdateFree} style={{ marginRight: '15px', width: '152.5px', height: '35px', boxShadow: 'none' }}>そのまま</Button>
        </Tooltip>
        <Tooltip title="入力された文章を自動的に調整し、単語が見切れないように描画します。">
          <Button size='small' variant='contained' onClick={UpdateAuto} style={{ width: '152.5px', height: '35px', boxShadow: 'none' }}>お任せ</Button>
        </Tooltip>
      </span>
    </div >
  )
}

export default TextInput