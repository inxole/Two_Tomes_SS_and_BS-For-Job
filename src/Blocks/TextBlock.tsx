import { useRecoilState } from 'recoil'
import { Long_Text, Text_Switch_Automatic, Text_Switch_Freedom } from '../atom'
import { Button } from '@mui/material'

function TextInput() {
  const [, setText_update_F] = useRecoilState(Text_Switch_Freedom)
  const [, setText_update_A] = useRecoilState(Text_Switch_Automatic)
  const [updatedText, setUpdatedText] = useRecoilState(Long_Text)

  const UpdateFree = () => {
    setUpdatedText(updatedText)
    setText_update_F(true)
  }

  const UpdateAuto = () => {
    setUpdatedText(updatedText)
    setText_update_A(true)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', resize: '-moz-initial' }}>
      <textarea
        style={{
          width: '98.5%', height: '100%',
          border: 'none', outline: 'none', resize: 'none', backgroundColor: 'rgba(255, 255, 255, 1)'
        }}
        placeholder='文章を入力してください...'
        value={updatedText}
        onChange={e => setUpdatedText(e.target.value)}
      />
      <div style={{ display: 'flex', paddingTop: '5px', alignSelf: 'flex-end' }}>
        <div style={{ paddingRight: '5px', paddingTop: '10px' }}>UPDATE</div>
        <Button size='small' variant='outlined' onClick={UpdateFree} style={{ marginRight: '5px' }}>Free</Button>
        <Button size='small' variant='outlined' onClick={UpdateAuto}>Auto</Button>
      </div>
    </div>
  )
}

export default TextInput
