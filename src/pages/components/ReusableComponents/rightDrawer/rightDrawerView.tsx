import React, { useState, ReactNode, useEffect } from 'react'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import Button from '@mui/material/Button'
import { Tooltip } from '@mui/material'
import Icon from 'src/@core/components/icon'
import { useRouter } from 'next/router'

type Anchor = 'top' | 'left' | 'bottom' | 'right'

interface DrawerComponentProps {
  anchor: Anchor
  onOpen?: () => void
  updateParent?: () => void
  buttonLabel: string
  children: ReactNode
  width?: string
  icon?: boolean
  closeCommand?: boolean
  opendrawer?: () => void
  initiallyOpen?: boolean
}

const DrawerComponent: React.FC<DrawerComponentProps> = ({
  anchor,
  children,
  width,
  icon,
  onOpen,
  updateParent,
  closeCommand,
  buttonLabel,
  initiallyOpen
}) => {
  const [open, setOpen] = useState(initiallyOpen || false)
  const router = useRouter()


  useEffect(() => {
    if (initiallyOpen) {
      setOpen(true)
    }
  }, [initiallyOpen])

  const toggleDrawer = (event: React.KeyboardEvent | React.MouseEvent, open: boolean) => {
    if (
      event.type === 'keydown' &&
      (event as React.KeyboardEvent).key === 'n' &&
      (event as React.KeyboardEvent).altKey
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
        width: width || (anchor === 'top' || anchor === 'bottom' ? 'auto' : '820px'),
        padding: ' 0px',
        height: '100vh',
        background:
          localStorage.getItem('selectedMode') === 'dark'
            ? 'transparent'
            : localStorage.getItem('selectedMode') === 'light'
              ? '#fff'
              : localStorage.getItem('systemMode') === 'dark'
                ? 'transparent'
                : '#fff'
      }}
      role='presentation'
      onClick={event => {
        event.stopPropagation()
      }}

    //   onKeyDown={(event) => { event.stopPropagation();}}
    >
      <Button id='rightDrawerClose' onClick={handleClose}>
        <Icon fontSize='1.125rem' icon='material-symbols:close' color='black' />
      </Button>
      {children}
    </Box>
  )

  return (
    <React.Fragment>
      <Tooltip sx={{ cursor: 'pointer' }} placement='top' title=''>
        {!icon ? (
          <Button
            sx={{
              background: '#7367F0',
              color: '#fff',
              '&:hover': {
                background: '#7367F0',
                color: 'white',
                cursor: 'pointer'
              }
            }}
            onClick={() => {
              setOpen(true)
            }}
          >
            <Icon fontSize='1.125rem' icon='tabler:plus' />
            {buttonLabel == 'Invoice' ? 'Create Invoice' : 'Add New'}
          </Button>
        ) : (
          <Icon
            onClick={() => {
              setOpen(true)
            }}
            style={{
              cursor: 'pointer'
            }}
            icon={buttonLabel == 'view' ? `${'mdi:eye-outline'}` : `${'tabler:edit'}`}
            width={20}
            height={20}
          />
        )}
      </Tooltip>
      <Drawer
        anchor={anchor}
        open={open}
        onClose={
          router.pathname === '/subscriptions/rides/pricing'
            ? undefined
            : () => toggleDrawer({} as React.MouseEvent, false)
        }
      >
        {list()}
      </Drawer>
    </React.Fragment>
  )
}

export default DrawerComponent

export function closeRightPopupClick() {
  const button = document.getElementById('rightDrawerClose')
  if (button) {
    button.click() // Triggering the click event on the button

  } else {

  }
}
