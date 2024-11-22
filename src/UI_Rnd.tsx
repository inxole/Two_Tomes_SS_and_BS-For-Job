import { useEffect, useState } from "react"
import { Rnd } from "react-rnd"
import { Stack } from '@mui/material'
import { amber, grey } from '@mui/material/colors'
import BookTwoToneIcon from '@mui/icons-material/BookTwoTone'
import ArchiveTwoToneIcon from '@mui/icons-material/ArchiveTwoTone'

const sub_position = window.innerHeight - 480 - 45
function User_interface() {
    const [isMovedUp, setIsMovedUp] = useState(false)
    const [, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight })
    const [position, setPosition] = useState({ x: (window.innerWidth - 350) / 2, y: window.innerHeight - 480 - 10 })

    useEffect(() => {
        const handleResize = () => {
            const newWidth = window.innerWidth
            const newHeight = window.innerHeight
            setWindowSize({ width: newWidth, height: newHeight })
            setPosition({ x: (window.innerWidth - 350) / 2, y: window.innerHeight - 480 - 10 })
        }

        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    const handleArchiveClick = () => {
        setIsMovedUp(!isMovedUp)
    }

    return (
        <>
            <Rnd
                default={{ x: position.x, y: sub_position, width: 350, height: 40 }}
                position={{ x: position.x, y: isMovedUp ? sub_position : sub_position + 480 }}
                enableResizing={false}
                disableDragging={true}
                style={{
                    pointerEvents: 'none',
                    transition: 'transform 0.38s ease'
                }}
            >
                <div style={{ width: '200px', margin: '0 auto', display: 'flex', justifyContent: 'center' }}>
                    <Stack direction="row" alignItems="center" justifyContent="center" spacing={2} sx={{ pointerEvents: 'auto' }}>
                        <BookTwoToneIcon fontSize="large" style={{ color: amber[100], cursor: 'pointer' }} />
                        <ArchiveTwoToneIcon
                            fontSize="large"
                            style={{
                                color: grey[100],
                                cursor: 'pointer',
                                paddingTop: isMovedUp ? '0px' : '10px',
                                paddingBottom: isMovedUp ? '0px' : '10px',
                                transform: isMovedUp ? 'rotate(0deg)' : 'rotate(180deg)',
                            }}
                            onClick={handleArchiveClick}
                        />
                        <BookTwoToneIcon fontSize="large" style={{ color: grey[800], cursor: 'pointer' }} />
                    </Stack>
                </div>
            </Rnd>
            <Rnd
                default={{ x: position.x, y: position.y, width: 350, height: 480 }}
                style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.65)',
                    borderRadius: '8px',
                    paddingLeft: '4px',
                    paddingBottom: '4px',
                    paddingTop: '4px',
                    transition: 'transform 0.35s ease'
                }}
                enableResizing={false}
                disableDragging={true}
                position={{ x: position.x, y: isMovedUp ? position.y : position.y + 490 }}
            >
            </Rnd>
        </>
    )
}

export default User_interface
