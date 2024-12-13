import React, { useState, useEffect } from 'react'
import Slider from '@mui/material/Slider'
import Menu from '@mui/material/Menu'
import { IconButton } from '@mui/material'
import Icon from 'src/@core/components/icon';

const FullZoom: React.FC = () => {
  const [fontSize, setFontSize] = useState<number>(1.0)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const marks = [
    { value: 0.7, label: '-0.7' },
    { value: 0.8, label: '-0.8' },
    { value: 0.9, label: '-0.9' },
    { value: 1.0, label: '1' },
    { value: 1.1, label: '1.1' },
    { value: 1.2, label: '1.2' },
    { value: 1.3, label: '1.3' }
  ]

  useEffect(() => {
    const changeHtmlFontSize = () => {
      document.documentElement.style.fontSize = `${fontSize * 100}%`
    }
    changeHtmlFontSize()
  }, [fontSize])

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleSliderChange = (event: Event, value: number | number[]) => {
    setFontSize(value as number)
  }

  return (
    <>
      <IconButton onClick={handleMenuOpen}>
      <Icon fontSize="1.625rem" icon="majesticons:font-size-line" width={35} height={35} />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          style: {
            width: '250px',
            padding:'22px 15px 15px 15px',
           
           
          }
        }}
      >
        <Slider
          value={fontSize}
          onChange={handleSliderChange}
          min={0.7}
          max={1.4}
          step={0.1}
          marks={marks}
          valueLabelDisplay='auto'
        />
      </Menu>
    </>
  )
}

export default FullZoom
