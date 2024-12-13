import React, { useState, ReactNode, useEffect } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip'
import Icon from 'src/@core/components/icon'
import { styled } from '@mui/material/styles'
import IconButton, { IconButtonProps } from '@mui/material/IconButton'
import { useRouter } from 'next/router';

type Anchor = 'top' | 'left' | 'bottom' | 'right';

interface DrawerComponentProps {
  anchor: Anchor;
  onOpen: () => void;
  buttonLabel: string;
  children: ReactNode
  updateParent?: () => void
  width?: string;
  textBoolean?: boolean;
  closeCommand?: boolean;
  initiallyOpen?: boolean; // Add this prop for initial opening
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


const CustomCloseButton = styled(IconButton)<IconButtonProps>(({ theme }) => ({
  top: 15,
  left: 0,
  color: 'black',
  position: 'absolute',
  boxShadow: theme.shadows[2],
  transform: 'translate(10px, -10px)',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: backColor(),
  transition: 'transform 0.25s ease-in-out, box-shadow 0.25s ease-in-out',
  '&:hover': {}
}));

const DrawerComponent: React.FC<DrawerComponentProps> = ({ anchor, onOpen, buttonLabel, children, width, textBoolean, updateParent, initiallyOpen }) => {
  const [open, setOpen] = useState(initiallyOpen || false);
  const router = useRouter();

  useEffect(() => {
    if (initiallyOpen) {
      setOpen(true);
    }
  }, [initiallyOpen]);

  const toggleDrawer = (event: React.KeyboardEvent | React.MouseEvent, open: boolean) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }

    setOpen(open);
  };

  const handleClose = () => {
    if (updateParent) {
      //console.log('parent available')
      updateParent && updateParent()
      setOpen(false);
    } else {
      // console.log('No parent available')
      setOpen(false);
    }
  };



  const list = () => (
    <Box
      sx={{ width: width || (anchor === 'top' || anchor === 'bottom' ? 'auto' : '1216px'), background: '#2f2b3d0f', height: router.pathname === "/settings/auth" ? "full" : '100vh' }}
      role="presentation"
      onClick={(event) => {
        event.stopPropagation();
      }}
    >
      <CustomCloseButton id='rightDrawerClose' aria-label='close' onClick={handleClose}>
        <Icon icon='tabler:x' fontSize='1.25rem' />
      </CustomCloseButton>
      {children}
    </Box>
  );

  return (
    <React.Fragment>
      {buttonLabel == 'Add New' &&
        <Button
          variant="contained" sx={{
            display: 'flex',
            justifyContent: "center",
            alignItems: 'center',
            width: "100px",
            padding: "5px !important",
            height: '40px',
            fontSize: '15px',
            whiteSpace: "nowrap",
            '&:hover': {
              background: '#776cff',
              color: 'white',
            },
          }} onClick={() => { onOpen(); setOpen(true); }}>
          <Icon
            icon="ic:twotone-add"
            width={20}
            height={20}
          />
          {buttonLabel}
        </Button>
      }


        {buttonLabel == 'Role' &&
        <Button
          variant="contained" sx={{
            display: 'flex',
            justifyContent: "center",
            alignItems: 'center',
            width: "80px",
            padding: "5px !important",
            height: '40px',
            fontSize: '15px',
            whiteSpace: "nowrap",
            '&:hover': {
              background: '#776cff',
              color: 'white',
            },
          }} onClick={() => { onOpen(); setOpen(true); }}>

          <Icon

            icon="ic:twotone-add"
            width={20}
            height={20}
          />
          {buttonLabel}
        </Button>
      }
      {buttonLabel == 'EDit' &&
        <Tooltip title='Edit'>
          <IconButton
            size='small'
            sx={{ color: 'text.secondary' }}
            onClick={() => {
              if (!open) {
                onOpen();
              }
              setOpen(true);
            }}
          >
            <Icon icon='tabler:edit' />
          </IconButton>
        </Tooltip>
      }




      <Drawer anchor={anchor} open={open || textBoolean ? true : false} onClose={() => toggleDrawer({} as React.MouseEvent, false)}>
        {list()}
      </Drawer>
    </React.Fragment>
  );
}

export default DrawerComponent;

export function closeRightPopupClick() {
  const button = document.getElementById('rightDrawerClose')
  if (button) {
    button.click()
  } else {
  }
}
