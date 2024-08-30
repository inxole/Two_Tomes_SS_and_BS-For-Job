import { useRecoilState } from 'recoil'
import { Long_Text, Text_Switch } from '../atom'
import { Button } from '@mui/material'

function TextInput() {
  const [, setText_update] = useRecoilState(Text_Switch)
  const [updatedText, setUpdatedText] = useRecoilState(Long_Text)

  const handleUpdate = () => {
    setUpdatedText(updatedText)
    setText_update(true)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', resize: '-moz-initial' }}>
      <textarea
        style={{
          width: '100%', height: '100%',
          border: 'none', outline: 'none', resize: 'none', backgroundColor: 'rgba(255, 255, 255, 1)'
        }}
        placeholder='文章を入力してください...'
        value={updatedText}
        onChange={e => setUpdatedText(e.target.value)}
      />
      <div style={{ paddingTop: '5px', alignSelf: 'flex-end' }}>
        <Button size='small' variant='outlined' onClick={handleUpdate} >Update</Button>
      </div>
    </div>
  )
}

export default TextInput
