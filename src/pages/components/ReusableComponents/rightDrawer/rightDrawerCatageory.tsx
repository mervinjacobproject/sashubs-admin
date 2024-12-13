// DrawerComponent.tsx
import React, { useState, ReactNode } from 'react'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import IconButton, { IconButtonProps } from '@mui/material/IconButton'
import Icon from 'src/@core/components/icon'

type Anchor = 'top' | 'left' | 'bottom' | 'right'

interface DrawerComponentProps {
  anchor: Anchor
  isOld?: boolean
  onOpen: () => void
  closeCommand?: boolean
  buttonLabel: string
  children: ReactNode
  updateParent?: () => void
}

const backColor = () => {
  const selectedMode = localStorage.getItem('selectedMode')
  if (selectedMode === 'dark') {
    return 'inherit'
  } else if (selectedMode === 'light') {
    return '#fff'
  } else if (localStorage.getItem('systemMode') === 'dark') {
    return 'inherit' 
  } else {
    return '#fff'
  }
}

const color = () => {
  const selectedMode = localStorage.getItem('selectedMode')
  if (selectedMode === 'dark') {
    return '#fff'
  } else if (selectedMode === 'light') {
    return '#222'
  } else if (localStorage.getItem('systemMode') === 'dark') {
    return '#fff' 
  } else {
    return '#222'
  }
}
const CustomCloseButton = styled(IconButton)<IconButtonProps>(({ theme }) => ({
  top: 15,
  left: 0,
  color: color(),
  position: 'absolute',
  boxShadow: theme.shadows[2],
  transform: 'translate(10px, -10px)',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: backColor(),
  transition: 'transform 0.25s ease-in-out, box-shadow 0.25s ease-in-out',
  '&:hover': {
    transform: 'translate(7px, -5px)'
  }
}))

const RightDrawerCatageory: React.FC<DrawerComponentProps> = ({
  anchor,
  onOpen,
  buttonLabel,
  children,
  closeCommand,
  updateParent
}) => {
  const [open, setOpen] = useState(false)

 
  const toggleDrawer = (event: React.KeyboardEvent | React.MouseEvent, open: boolean) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return
    }

    setOpen(open)
  }

  const handleClose = () => {
    if (updateParent) {
      updateParent && updateParent()
      setOpen(false)
    } else {
      setOpen(false)
    }
  }

  const list = () => (
    <Box
      sx={{
        width: anchor === 'top' || anchor === 'bottom' ? 'auto' : '400px',
        paddingLeft: '20px ',
        paddingRight: '20px',
        paddingBottom: '20px',
        background: '#2f2b3d0f',
        height: '100vh'
      }}
      role='presentation'
      onClick={event => {
        event.stopPropagation()
      }}
    >
      <CustomCloseButton id='rightDrawerClose' aria-label='close' onClick={handleClose}>
        <Icon icon='tabler:x' fontSize='1.25rem' />
      </CustomCloseButton>
      {children}
    </Box>
  )

  return (
    <React.Fragment>
      <Button
        variant='contained'
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100px',
          padding: '5px !important',
          height: '40px',
          fontSize: '15px',
          whiteSpace: 'nowrap',
          '&:hover': {
            background: '#776cff',
            color: 'white'
          }
        }}
        id='NewChargeBtn'
        onClick={() => {
          onOpen()
          setOpen(true)
        }}
      >
        <Icon icon='ic:twotone-add' width={20} height={20} />

        {buttonLabel}
      </Button>
      <Drawer anchor={anchor} open={open} onClose={() => toggleDrawer({} as React.MouseEvent, false)}>
        {list()}
      </Drawer>
    </React.Fragment>
  )
}

export default RightDrawerCatageory

export function closeRightPopupClick() {
  const button = document.getElementById('rightDrawerClose')
  if (button) {
    button.click()
  } else {
  }
}
