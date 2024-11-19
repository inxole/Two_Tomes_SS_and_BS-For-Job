import { useEffect, useState } from "react"
import { Rnd } from "react-rnd"

function User_interface() {
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

    return (
        <Rnd
            default={{ x: position.x, y: position.y, width: 350, height: 480 }}
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.65)', borderRadius: '8px', paddingLeft: '4px', paddingBottom: '4px', paddingTop: '40px' }}
            enableResizing={false}
            disableDragging={true}
            position={{ x: position.x, y: position.y }} 
        >
        </Rnd>
    )
}

export default User_interface
